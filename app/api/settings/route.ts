
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.settings.findFirst();
    return NextResponse.json(settings || {});
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar configurações' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const existing = await prisma.settings.findFirst();
    
    let settings;
    if (existing) {
      settings = await prisma.settings.update({
        where: { id: existing.id },
        data: body
      });
    } else {
      settings = await prisma.settings.create({
        data: body
      });
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao salvar configurações' }, { status: 500 });
  }
}
