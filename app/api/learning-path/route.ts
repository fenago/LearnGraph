import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

// GET /api/learning-path - Generate learning path for a learner
export async function GET(request: NextRequest) {
  try {
    const db = await getDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = searchParams.get('limit');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId query parameter is required' },
        { status: 400 }
      );
    }

    // Verify learner exists
    const learner = await db.getLearnerProfile(userId);
    if (!learner) {
      return NextResponse.json(
        { error: `Learner not found: ${userId}` },
        { status: 404 }
      );
    }

    // Generate learning path
    const path = await db.generateLearningPath(userId, limit ? parseInt(limit, 10) : 10);

    // Also get psychometric adjustments for context
    const adjustments = db.adjustForPsychometrics(learner);

    return NextResponse.json({
      userId,
      generatedAt: new Date().toISOString(),
      learnerName: learner.name || userId,
      psychometricAdjustments: adjustments,
      path,
      totalDuration: path.reduce((sum, step) => sum + step.estimatedDuration, 0),
    });
  } catch (error) {
    console.error('Error generating learning path:', error);
    return NextResponse.json(
      { error: 'Failed to generate learning path' },
      { status: 500 }
    );
  }
}
