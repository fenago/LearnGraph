/**
 * API Route: /api/learners/[userId]/psychometrics
 *
 * Manages psychometric scores and derived profiles for a learner
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { ALL_DOMAIN_IDS, DOMAIN_METADATA, getLearningStyleDescription, PsychometricDomainId } from '@/src/models/psychometrics';

interface RouteContext {
  params: Promise<{ userId: string }>;
}

/**
 * GET /api/learners/[userId]/psychometrics
 *
 * Returns psychometric scores and derived profiles for a learner
 * Query params:
 *   - domains: comma-separated list of domains to include (optional, defaults to all)
 *   - includeMetadata: boolean to include domain metadata (optional)
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { userId } = await context.params;
    const searchParams = request.nextUrl.searchParams;
    const domainsParam = searchParams.get('domains');
    const includeMetadata = searchParams.get('includeMetadata') === 'true';

    const db = await getDB();
    const profile = await db.getLearnerProfile(userId);

    if (!profile) {
      return NextResponse.json({ error: 'Learner not found' }, { status: 404 });
    }

    // Filter domains if specified
    const requestedDomains = domainsParam ? domainsParam.split(',') : ALL_DOMAIN_IDS;
    const scores: Record<string, unknown> = {};

    for (const domain of requestedDomains) {
      const domainId = domain as PsychometricDomainId;
      const score = profile.psychometricScores[domainId];
      if (score) {
        scores[domain] = includeMetadata
          ? { ...score, metadata: DOMAIN_METADATA[domainId] }
          : score;
      } else if (includeMetadata && ALL_DOMAIN_IDS.includes(domainId)) {
        // Include metadata even if no score exists
        scores[domain] = { score: null, metadata: DOMAIN_METADATA[domainId] };
      }
    }

    // Build response
    const response: Record<string, unknown> = {
      userId,
      psychometricScores: scores,
      scoreCount: Object.keys(profile.psychometricScores).length,
      totalDomains: ALL_DOMAIN_IDS.length,
    };

    // Include derived profiles if they exist
    if (profile.learningStyle) {
      response.learningStyle = profile.learningStyle;
      response.learningStyleDescription = getLearningStyleDescription(profile.learningStyle);
    }

    if (profile.cognitiveProfile) {
      response.cognitiveProfile = profile.cognitiveProfile;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching psychometric profile:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch psychometric profile' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/learners/[userId]/psychometrics
 *
 * Update psychometric scores for a learner
 * Body:
 *   - scores: Record<domain, { score: number, confidence?: number, source?: string }>
 *   - computeDerived: boolean to auto-compute learning style and cognitive profile
 */
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { userId } = await context.params;
    const body = await request.json();
    const { scores, computeDerived = true } = body;

    if (!scores || typeof scores !== 'object') {
      return NextResponse.json(
        { error: 'scores object is required' },
        { status: 400 }
      );
    }

    // Validate scores
    for (const [domain, data] of Object.entries(scores)) {
      if (!(ALL_DOMAIN_IDS as readonly string[]).includes(domain)) {
        return NextResponse.json(
          { error: `Invalid domain: ${domain}. Valid domains: ${ALL_DOMAIN_IDS.join(', ')}` },
          { status: 400 }
        );
      }
      const scoreData = data as { score: number; confidence?: number };
      if (typeof scoreData.score !== 'number' || scoreData.score < 0 || scoreData.score > 100) {
        return NextResponse.json(
          { error: `Invalid score for ${domain}: must be 0-100` },
          { status: 400 }
        );
      }
      if (scoreData.confidence !== undefined && (scoreData.confidence < 0 || scoreData.confidence > 1)) {
        return NextResponse.json(
          { error: `Invalid confidence for ${domain}: must be 0-1` },
          { status: 400 }
        );
      }
    }

    const db = await getDB();

    // Check if learner exists
    const existing = await db.getLearnerProfile(userId);
    if (!existing) {
      return NextResponse.json({ error: 'Learner not found' }, { status: 404 });
    }

    // Update scores
    let profile = await db.updatePsychometricScores(userId, scores);

    // Compute derived profiles if requested
    if (computeDerived) {
      profile = await db.computeAndStoreDerivedProfiles(userId);
    }

    const response: Record<string, unknown> = {
      userId,
      updatedDomains: Object.keys(scores),
      scoreCount: Object.keys(profile.psychometricScores).length,
    };

    if (profile.learningStyle) {
      response.learningStyle = profile.learningStyle;
      response.learningStyleDescription = getLearningStyleDescription(profile.learningStyle);
    }

    if (profile.cognitiveProfile) {
      response.cognitiveProfile = profile.cognitiveProfile;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating psychometric scores:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update psychometric scores' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/learners/[userId]/psychometrics/compute
 *
 * Compute derived profiles from existing psychometric scores
 * Body:
 *   - type: 'learning-style' | 'cognitive-profile' | 'all' (default: 'all')
 */
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { userId } = await context.params;
    const body = await request.json().catch(() => ({}));
    const { type = 'all' } = body;

    const db = await getDB();

    // Check if learner exists
    const existing = await db.getLearnerProfile(userId);
    if (!existing) {
      return NextResponse.json({ error: 'Learner not found' }, { status: 404 });
    }

    let profile;
    switch (type) {
      case 'learning-style':
        profile = await db.computeAndStoreLearningStyle(userId);
        break;
      case 'cognitive-profile':
        profile = await db.computeAndStoreCognitiveProfile(userId);
        break;
      case 'all':
      default:
        profile = await db.computeAndStoreDerivedProfiles(userId);
    }

    const response: Record<string, unknown> = {
      userId,
      computed: type,
    };

    if (profile.learningStyle) {
      response.learningStyle = profile.learningStyle;
      response.learningStyleDescription = getLearningStyleDescription(profile.learningStyle);
    }

    if (profile.cognitiveProfile) {
      response.cognitiveProfile = profile.cognitiveProfile;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error computing derived profiles:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to compute derived profiles' },
      { status: 500 }
    );
  }
}
