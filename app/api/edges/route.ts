import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

// GET /api/edges - List all edges
export async function GET() {
  try {
    const db = await getDB();
    const edges = await db.listEdges();
    return NextResponse.json(edges);
  } catch (error) {
    console.error('Error listing edges:', error);
    return NextResponse.json(
      { error: 'Failed to list edges' },
      { status: 500 }
    );
  }
}

// POST /api/edges - Create a new edge
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDB();

    if (!body.from || !body.to) {
      return NextResponse.json(
        { error: 'from and to are required' },
        { status: 400 }
      );
    }

    // Verify both concepts exist
    const fromConcept = await db.getConcept(body.from);
    const toConcept = await db.getConcept(body.to);

    if (!fromConcept) {
      return NextResponse.json(
        { error: `Source concept not found: ${body.from}` },
        { status: 400 }
      );
    }

    if (!toConcept) {
      return NextResponse.json(
        { error: `Target concept not found: ${body.to}` },
        { status: 400 }
      );
    }

    const edge = await db.addEdge({
      from: body.from,
      to: body.to,
      strength: body.strength || 'recommended',
      reason: body.reason,
    });

    return NextResponse.json(edge, { status: 201 });
  } catch (error) {
    console.error('Error creating edge:', error);
    return NextResponse.json(
      { error: 'Failed to create edge' },
      { status: 500 }
    );
  }
}

// DELETE /api/edges - Delete an edge (pass from and to as query params)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    if (!from || !to) {
      return NextResponse.json(
        { error: 'from and to query parameters are required' },
        { status: 400 }
      );
    }

    const db = await getDB();
    await db.deleteEdge(from, to);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting edge:', error);
    return NextResponse.json(
      { error: 'Failed to delete edge' },
      { status: 500 }
    );
  }
}
