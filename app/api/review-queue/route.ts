import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const db = await getDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = searchParams.get('limit');
    const priority = searchParams.get('priority'); // urgent, normal, low
    const includeNotDue = searchParams.get('includeNotDue') === 'true';

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const queue = await db.getReviewQueue(userId, {
      limit: limit ? parseInt(limit) : undefined,
      includeNotDue,
    });

    // Filter by priority if specified
    if (priority && (priority === 'urgent' || priority === 'normal' || priority === 'low')) {
      const filteredQueue = queue.queue.filter(item => item.priority === priority);
      return NextResponse.json({
        queue: filteredQueue,
        stats: {
          ...queue.stats,
          filtered: filteredQueue.length,
        },
      });
    }

    return NextResponse.json(queue);
  } catch (error) {
    console.error('Review queue error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get review queue' },
      { status: 500 }
    );
  }
}
