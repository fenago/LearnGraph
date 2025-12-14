import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

/**
 * GET /api/concepts - List, search, or filter concepts
 * Query params:
 *   - domain: filter by domain
 *   - search: search by name/description
 *   - minDifficulty: minimum difficulty (1-10)
 *   - maxDifficulty: maximum difficulty (1-10)
 *   - bloomLevel: filter by Bloom level (remember, understand, apply, analyze, evaluate, create)
 */
export async function GET(request: NextRequest) {
  try {
    const db = await getDB();
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');
    const search = searchParams.get('search');
    const minDifficulty = searchParams.get('minDifficulty');
    const maxDifficulty = searchParams.get('maxDifficulty');
    const bloomLevel = searchParams.get('bloomLevel');

    let concepts;

    // Search takes priority
    if (search) {
      concepts = await db.searchConcepts(search);
    } else if (domain) {
      concepts = await db.listConceptsByDomain(domain);
    } else if (minDifficulty || maxDifficulty) {
      concepts = await db.listConceptsByDifficulty(
        minDifficulty ? parseInt(minDifficulty) : 1,
        maxDifficulty ? parseInt(maxDifficulty) : 10
      );
    } else if (bloomLevel) {
      const validLevels = ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'];
      if (!validLevels.includes(bloomLevel)) {
        return NextResponse.json(
          { error: `Invalid bloom level. Valid values: ${validLevels.join(', ')}` },
          { status: 400 }
        );
      }
      concepts = await db.listConceptsByBloomLevel(bloomLevel as 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create');
    } else {
      concepts = await db.listConcepts();
    }

    return NextResponse.json(concepts);
  } catch (error) {
    console.error('Error listing concepts:', error);
    return NextResponse.json(
      { error: 'Failed to list concepts' },
      { status: 500 }
    );
  }
}

// POST /api/concepts - Create a new concept
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDB();

    if (!body.conceptId) {
      return NextResponse.json(
        { error: 'conceptId is required' },
        { status: 400 }
      );
    }

    // Normalize difficulty to ConceptDifficulty format
    let difficulty = body.difficulty;
    if (typeof difficulty === 'number') {
      // Convert plain number to full ConceptDifficulty object
      difficulty = {
        absolute: difficulty,
        cognitiveLoad: difficulty / 10, // Scale 1-10 to 0-1
        abstractness: 0.5,
      };
    } else if (!difficulty) {
      difficulty = { absolute: 5, cognitiveLoad: 0.5, abstractness: 0.5 };
    }

    const concept = await db.addConcept({
      conceptId: body.conceptId,
      name: body.name || body.conceptId,
      domain: body.domain || 'general',
      subdomain: body.subdomain,
      description: body.description || '',
      difficulty,
      bloomObjectives: body.bloomObjectives,
      timeEstimates: body.timeEstimates,
      tags: body.tags,
    });

    return NextResponse.json(concept, { status: 201 });
  } catch (error) {
    console.error('Error creating concept:', error);
    return NextResponse.json(
      { error: 'Failed to create concept' },
      { status: 500 }
    );
  }
}
