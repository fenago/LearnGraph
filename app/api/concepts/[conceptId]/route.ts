import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

interface RouteContext {
  params: Promise<{ conceptId: string }>;
}

/**
 * GET /api/concepts/[conceptId] - Get a specific concept
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { conceptId } = await context.params;
    const db = await getDB();
    const concept = await db.getConcept(conceptId);

    if (!concept) {
      return NextResponse.json(
        { error: 'Concept not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(concept);
  } catch (error) {
    console.error('Error getting concept:', error);
    return NextResponse.json(
      { error: 'Failed to get concept' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/concepts/[conceptId] - Update a concept
 */
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { conceptId } = await context.params;
    const body = await request.json();
    const db = await getDB();

    const existing = await db.getConcept(conceptId);
    if (!existing) {
      return NextResponse.json(
        { error: 'Concept not found' },
        { status: 404 }
      );
    }

    const concept = await db.addConcept({
      conceptId,
      name: body.name,
      domain: body.domain,
      subdomain: body.subdomain,
      description: body.description,
      difficulty: body.difficulty,
      bloomObjectives: body.bloomObjectives,
      timeEstimates: body.timeEstimates,
      tags: body.tags,
    });

    return NextResponse.json(concept);
  } catch (error) {
    console.error('Error updating concept:', error);
    return NextResponse.json(
      { error: 'Failed to update concept' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/concepts/[conceptId] - Delete a concept
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { conceptId } = await context.params;
    const db = await getDB();

    const existing = await db.getConcept(conceptId);
    if (!existing) {
      return NextResponse.json(
        { error: 'Concept not found' },
        { status: 404 }
      );
    }

    await db.deleteConcept(conceptId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting concept:', error);
    return NextResponse.json(
      { error: 'Failed to delete concept' },
      { status: 500 }
    );
  }
}
