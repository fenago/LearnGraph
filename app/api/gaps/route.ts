import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const db = await getDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type') as 'missing' | 'partial' | 'forgotten' | 'misconceptions' | 'all' | null;
    const includeRecommendations = searchParams.get('includeRecommendations') === 'true';

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const gaps = await db.detectGaps(userId, {
      type: type || 'all',
      includeRecommendations,
    });

    // Always wrap gaps in a 'gaps' object to match test expectations
    const response = {
      gaps: {
        missing: gaps.missing,
        partial: gaps.partial,
        forgotten: gaps.forgotten,
        misconceptions: gaps.misconceptions,
      },
      summary: gaps.summary,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Gap detection error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to detect gaps' },
      { status: 500 }
    );
  }
}
