import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

// GET /api/learners/[userId] - Get a specific learner
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const db = await getDB();
    const learner = await db.getLearnerProfile(params.userId);

    if (!learner) {
      return NextResponse.json(
        { error: 'Learner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(learner);
  } catch (error) {
    console.error('Error getting learner:', error);
    return NextResponse.json(
      { error: 'Failed to get learner' },
      { status: 500 }
    );
  }
}

// PUT /api/learners/[userId] - Update a learner
export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const body = await request.json();
    const db = await getDB();

    const existing = await db.getLearnerProfile(params.userId);
    if (!existing) {
      return NextResponse.json(
        { error: 'Learner not found' },
        { status: 404 }
      );
    }

    const learner = await db.setLearnerProfile(params.userId, {
      name: body.name,
      email: body.email,
      psychometricScores: body.psychometricScores,
      learningStyle: body.learningStyle,
      cognitiveProfile: body.cognitiveProfile,
      tags: body.tags,
      notes: body.notes,
    });

    return NextResponse.json(learner);
  } catch (error) {
    console.error('Error updating learner:', error);
    return NextResponse.json(
      { error: 'Failed to update learner' },
      { status: 500 }
    );
  }
}

// DELETE /api/learners/[userId] - Delete a learner
export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const db = await getDB();

    const existing = await db.getLearnerProfile(params.userId);
    if (!existing) {
      return NextResponse.json(
        { error: 'Learner not found' },
        { status: 404 }
      );
    }

    await db.deleteLearnerProfile(params.userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting learner:', error);
    return NextResponse.json(
      { error: 'Failed to delete learner' },
      { status: 500 }
    );
  }
}
