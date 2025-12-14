import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

// GET /api/graph - Get graph data for visualization
export async function GET(request: NextRequest) {
  try {
    const db = await getDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Get all concepts
    const concepts = await db.listConcepts();

    // Get all edges
    const edges = await db.listEdges();

    // Transform concepts to nodes
    const nodes = concepts.map((concept, index) => ({
      id: concept.conceptId,
      type: 'concept',
      position: {
        // Simple grid layout - will be overridden by React Flow
        x: (index % 5) * 200,
        y: Math.floor(index / 5) * 150,
      },
      data: {
        label: concept.name,
        conceptId: concept.conceptId,
        domain: concept.domain,
        subdomain: concept.subdomain,
        difficulty: concept.difficulty.absolute,
        description: concept.description,
      },
    }));

    // Transform edges
    const graphEdges = edges.map((edge) => ({
      id: `${edge.from}-${edge.to}`,
      source: edge.from,
      target: edge.to,
      type: 'smoothstep',
      animated: edge.strength === 'required',
      data: {
        strength: edge.strength,
        reason: edge.reason,
      },
      style: {
        strokeWidth: edge.strength === 'required' ? 2 : 1,
        stroke: edge.strength === 'required' ? '#3b82f6' : '#9ca3af',
      },
      markerEnd: {
        type: 'arrowclosed',
        color: edge.strength === 'required' ? '#3b82f6' : '#9ca3af',
      },
    }));

    // If userId provided, add learner overlay data
    let overlay = null;
    if (userId) {
      const learner = await db.getLearnerProfile(userId);
      if (learner) {
        const states = await db.getLearnerKnowledgeStates(userId);
        const masteryMap: Record<string, number> = {};
        const zpdConcepts: string[] = [];
        const forgottenConcepts: string[] = [];

        for (const state of states) {
          masteryMap[state.conceptId] = state.mastery;

          // Check if concept might be forgotten (retention < 0.5 and last accessed > 7 days ago)
          if (state.retentionStrength < 0.5 && state.lastAccessed) {
            const daysSinceAccess = (Date.now() - new Date(state.lastAccessed).getTime()) / (1000 * 60 * 60 * 24);
            if (daysSinceAccess > 7) {
              forgottenConcepts.push(state.conceptId);
            }
          }
        }

        // Simple ZPD calculation: concepts where prerequisites are mastered but this isn't
        for (const concept of concepts) {
          const mastery = masteryMap[concept.conceptId] || 0;
          if (mastery < 80) {
            // Not yet mastered
            const prereqs = await db.getPrerequisites(concept.conceptId);
            const allPrereqsMastered = prereqs.every(
              (prereq) => (masteryMap[prereq.from] || 0) >= 80
            );
            if (allPrereqsMastered || prereqs.length === 0) {
              zpdConcepts.push(concept.conceptId);
            }
          }
        }

        overlay = {
          userId,
          learnerName: learner.name,
          masteryLevels: masteryMap,
          zpdConcepts,
          forgottenConcepts,
        };
      }
    }

    // Get stats
    const stats = await db.getStats();

    return NextResponse.json({
      nodes,
      edges: graphEdges,
      overlay,
      stats,
    });
  } catch (error) {
    console.error('Error getting graph data:', error);
    return NextResponse.json(
      { error: 'Failed to get graph data' },
      { status: 500 }
    );
  }
}
