import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

// GET /api/learners - List all learners
export async function GET() {
  try {
    const db = await getDB();
    const learners = await db.listLearnerProfiles();
    return NextResponse.json(learners);
  } catch (error) {
    console.error('Error listing learners:', error);
    return NextResponse.json(
      { error: 'Failed to list learners' },
      { status: 500 }
    );
  }
}

// POST /api/learners - Create a new learner
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDB();

    // Generate userId if not provided
    const userId = body.userId || uuidv4();

    const learner = await db.setLearnerProfile(userId, {
      name: body.name,
      email: body.email,
      psychometricScores: body.psychometricScores || {},
      learningStyle: body.learningStyle,
      cognitiveProfile: body.cognitiveProfile,
      tags: body.tags,
      notes: body.notes,
    });

    return NextResponse.json(learner, { status: 201 });
  } catch (error) {
    console.error('Error creating learner:', error);
    return NextResponse.json(
      { error: 'Failed to create learner' },
      { status: 500 }
    );
  }
}
