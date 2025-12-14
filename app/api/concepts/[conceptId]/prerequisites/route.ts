/**
 * API Route: /api/concepts/[conceptId]/prerequisites
 *
 * Get prerequisite chain for a concept with depth traversal
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

interface RouteContext {
  params: Promise<{ conceptId: string }>;
}

/**
 * GET /api/concepts/[conceptId]/prerequisites
 *
 * Returns all prerequisites for a concept, traversing the graph up to maxDepth levels
 * Query params:
 *   - depth: maximum depth to traverse (default: 5, max: 10)
 *   - direct: if true, only return direct prerequisites (depth=1)
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

    // Get prerequisite chain
    const chain = await db.getPrerequisiteChain(conceptId, maxDepth);

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
      totalPrerequisites: chain.length,
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
    console.error('Error getting prerequisites:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get prerequisites' },
      { status: 500 }
    );
  }
}
