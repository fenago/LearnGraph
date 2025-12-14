import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const db = await getDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const conceptId = searchParams.get('conceptId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    if (!conceptId) {
      return NextResponse.json({ error: 'conceptId is required' }, { status: 400 });
    }

    // Get the knowledge state and concept
    const state = await db.getKnowledgeState(userId, conceptId);
    const concept = await db.getConcept(conceptId);

    if (!state) {
      return NextResponse.json(
        { error: 'No knowledge state found for this user and concept' },
        { status: 404 }
      );
    }

    if (!concept) {
      return NextResponse.json(
        { error: 'Concept not found' },
        { status: 404 }
      );
    }

    const decay = db.predictDecay(state, concept);

    return NextResponse.json({
      userId,
      conceptId,
      currentMastery: state.mastery,
      ...decay,
    });
  } catch (error) {
    console.error('Decay prediction error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to predict decay' },
      { status: 500 }
    );
  }
}
