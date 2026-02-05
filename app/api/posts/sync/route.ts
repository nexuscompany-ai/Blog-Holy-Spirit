import { PostsService } from '../../../../services/posts.service';

/**
 * Endpoint para sincronizar/atualizar lista de posts
 * Usado pelo frontend para polling
 */

export async function GET() {
  try {
    const posts = await PostsService.getAll();
    return new Response(
      JSON.stringify({
        success: true,
        count: posts.length,
        posts,
        timestamp: new Date().toISOString()
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erro ao sincronizar posts:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Erro ao sincronizar posts',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
