import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

// GET /api/states - Get knowledge states (filter by userId)
export async function GET(request: NextRequest) {
  try {
    const db = await getDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const conceptId = searchParams.get('conceptId');

    if (userId && conceptId) {
      // Get specific state
      const state = await db.getKnowledgeState(userId, conceptId);
      if (!state) {
        return NextResponse.json(
          { error: 'Knowledge state not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(state);
    } else if (userId) {
      // Get all states for a learner
      const states = await db.getLearnerKnowledgeStates(userId);
      return NextResponse.json(states);
    } else {
      // Return all states (for admin overview)
      const learners = await db.listLearnerProfiles();
      const allStates = [];
      for (const learner of learners) {
        const states = await db.getLearnerKnowledgeStates(learner.userId);
        allStates.push(...states);
      }
      return NextResponse.json(allStates);
    }
  } catch (error) {
    console.error('Error getting states:', error);
    return NextResponse.json(
      { error: 'Failed to get states' },
      { status: 500 }
    );
  }
}

// POST /api/states - Create or update a knowledge state
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDB();

    if (!body.userId || !body.conceptId) {
      return NextResponse.json(
        { error: 'userId and conceptId are required' },
        { status: 400 }
      );
    }

    // Verify learner exists
    const learner = await db.getLearnerProfile(body.userId);
    if (!learner) {
      return NextResponse.json(
        { error: `Learner not found: ${body.userId}` },
        { status: 400 }
      );
    }

    // Verify concept exists
    const concept = await db.getConcept(body.conceptId);
    if (!concept) {
      return NextResponse.json(
        { error: `Concept not found: ${body.conceptId}` },
        { status: 400 }
      );
    }

    const state = await db.setKnowledgeState(body.userId, body.conceptId, {
      mastery: body.mastery ?? 0,
      bloomLevel: body.bloomLevel ?? 1,
      retentionStrength: body.retentionStrength,
      reviewCount: body.reviewCount,
      misconceptions: body.misconceptions,
      lastReviewed: body.lastReviewed,
      nextReview: body.nextReview,
    });

    return NextResponse.json(state, { status: 201 });
  } catch (error) {
    console.error('Error creating/updating state:', error);
    return NextResponse.json(
      { error: 'Failed to create/update state' },
      { status: 500 }
    );
  }
}

// DELETE /api/states - Delete a knowledge state
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const conceptId = searchParams.get('conceptId');

    if (!userId || !conceptId) {
      return NextResponse.json(
        { error: 'userId and conceptId query parameters are required' },
        { status: 400 }
      );
    }

    const db = await getDB();
    await db.deleteKnowledgeState(userId, conceptId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting state:', error);
    return NextResponse.json(
      { error: 'Failed to delete state' },
      { status: 500 }
    );
  }
}
