
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' }
    });
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar eventos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newEvent = await prisma.event.create({
      data: body
    });
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar evento' }, { status: 500 });
  }
}
