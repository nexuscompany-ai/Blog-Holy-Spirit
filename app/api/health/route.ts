
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  /**
   * Diagnóstico de Saúde da Holy Spirit
   * Verifica a conexão secreta definida em process.env.DATABASE_URL
   */
  try {
    // Executa uma consulta de baixo nível para testar a latência e conectividade
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const latency = Date.now() - start;

    return NextResponse.json({ 
      status: 'online', 
      database: 'connected',
      project_id: 'xkapuhuuqqjmcxxrnpcf',
      latency: `${latency}ms`,
      engine: 'PostgreSQL 15 (Supabase)',
      authenticated: true,
      timestamp: new Date().toISOString() 
    });
  } catch (error: any) {
    console.error('Supabase Connectivity Error:', error);
    
    return NextResponse.json({ 
      status: 'offline', 
      database: 'disconnected',
      project_id: 'xkapuhuuqqjmcxxrnpcf',
      error: error.message || 'Falha na autenticação ou timeout de rede.',
      suggestion: 'Verifique se a variável DATABASE_URL está configurada corretamente no seu ambiente de hospedagem.'
    }, { status: 500 });
  }
}
