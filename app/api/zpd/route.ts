import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

// GET /api/zpd - Compute ZPD for a learner
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

    // Compute ZPD
    const zpd = await db.computeZPD(userId, {
      limit: limit ? parseInt(limit, 10) : 10,
    });

    return NextResponse.json(zpd);
  } catch (error) {
    console.error('Error computing ZPD:', error);
    return NextResponse.json(
      { error: 'Failed to compute ZPD' },
      { status: 500 }
    );
  }
}
