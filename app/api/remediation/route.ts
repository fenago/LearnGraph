import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const db = await getDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const maxSteps = searchParams.get('maxSteps');
    const focusType = searchParams.get('focusType') as 'missing' | 'partial' | 'forgotten' | 'misconceptions' | null;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const remediation = await db.generateRemediationPlan(userId, {
      maxSteps: maxSteps ? parseInt(maxSteps) : undefined,
      focusType: focusType || undefined,
    });

    return NextResponse.json(remediation);
  } catch (error) {
    console.error('Remediation plan error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate remediation plan' },
      { status: 500 }
    );
  }
}
