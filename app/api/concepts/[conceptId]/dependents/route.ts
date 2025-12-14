/**
 * API Route: /api/concepts/[conceptId]/dependents
 *
 * Get concepts that depend on this concept (reverse prerequisite traversal)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

interface RouteContext {
  params: Promise<{ conceptId: string }>;
}

/**
 * GET /api/concepts/[conceptId]/dependents
 *
 * Returns all concepts that have this concept as a prerequisite
 * Query params:
 *   - depth: maximum depth to traverse (default: 5, max: 10)
 *   - direct: if true, only return direct dependents (depth=1)
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { conceptId } = await context.params;
    const searchParams = request.nextUrl.searchParams;
    const directOnly = searchParams.get('direct') === 'true';
    const depthParam = searchParams.get('depth');
    const maxDepth = directOnly ? 1 : Math.min(depthParam ? parseInt(depthParam) : 5, 10);

    const db = await getDB();

    // Verify concept exists
    const concept = await db.getConcept(conceptId);
    if (!concept) {
      return NextResponse.json({ error: 'Concept not found' }, { status: 404 });
    }

    // Get dependent chain
    const chain = await db.getDependentChain(conceptId, maxDepth);

    // Group by depth for easier consumption
    const byDepth: Record<number, { concept: unknown; edge: unknown }[]> = {};
    for (const item of chain) {
      if (!byDepth[item.depth]) byDepth[item.depth] = [];
      byDepth[item.depth].push({ concept: item.concept, edge: item.edge });
    }

    return NextResponse.json({
      conceptId,
      conceptName: concept.name,
      maxDepth,
      totalDependents: chain.length,
      chain: chain.map(c => ({
        conceptId: c.concept.conceptId,
        name: c.concept.name,
        domain: c.concept.domain,
        difficulty: c.concept.difficulty.absolute,
        depth: c.depth,
        edgeStrength: c.edge.strength,
        edgeReason: c.edge.reason,
      })),
      byDepth,
    });
  } catch (error) {
    console.error('Error getting dependents:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get dependents' },
      { status: 500 }
    );
  }
}
