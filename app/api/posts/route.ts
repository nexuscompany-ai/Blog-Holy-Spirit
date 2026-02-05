
import { NextResponse } from 'next/server';
import { PostsService } from '../../../services/posts.service';

/**
 * GET - Buscar todos os posts publicados
 */
export async function GET() {
  try {
    const posts = await PostsService.getPublished();
    return NextResponse.json({
      success: true,
      count: posts.length,
      posts,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Erro ao buscar posts',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      }, 
      { status: 500 }
    );
  }
}

/**
 * POST - Criar um novo post
 * Pode ser chamado manualmente ou pelo webhook do n8n
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validação básica
    if (!body.title || !body.excerpt || !body.content || !body.category) {
      return NextResponse.json(
        { 
          error: 'Campos obrigatórios faltando',
          required: ['title', 'excerpt', 'content', 'category']
        },
        { status: 400 }
      );
    }

    const newPost = await PostsService.create({
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      category: body.category,
      image: body.image,
      source: body.source || 'manual',
      published: body.published !== false,
      publishedAt: body.publishedAt
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Post criado com sucesso',
        post: newPost
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao criar post:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Erro ao criar post',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
