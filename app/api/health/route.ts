
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  // A DATABASE_URL é mantida em segredo no ambiente de execução.
  // Projeto: xkapuhuuqqjmcxxrnpcf
  
  try {
    // Validação real do link com o banco de dados
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({ 
      status: 'online', 
      database: 'connected',
      project_id: 'xkapuhuuqqjmcxxrnpcf',
      engine: 'Supabase PostgreSQL',
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error('Supabase Connection Error:', error);
    
    return NextResponse.json({ 
      status: 'offline', 
      database: 'disconnected',
      project: 'xkapuhuuqqjmcxxrnpcf',
      error: 'Falha na autenticação ou rede. Verifique a DATABASE_URL secreta.'
    }, { status: 500 });
  }
}
