
import { NextResponse } from 'next/server';
import { PostsService } from '../../../../services/posts.service';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  try {
    const post = await PostsService.getBySlug(slug);
    if (!post) {
      return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar post' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  try {
    const body = await request.json();

    // Apenas campos permitidos para atualização
    const allowed: Record<string, boolean> = {
      title: true,
      excerpt: true,
      content: true,
      category: true,
      image: true,
      published: true,
      publishedAt: true,
      archived: true
    };

    const updates: any = {};
    for (const k of Object.keys(body)) {
      if (allowed[k]) updates[k] = body[k];
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'Nenhum campo válido para atualizar' }, { status: 400 });
    }

    // Busca o post para obter id
    const post = await PostsService.getBySlug(slug);
    if (!post) return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 });

    const updated = await PostsService.updateById(post.id, updates);
    return NextResponse.json({ success: true, post: updated });
  } catch (error) {
    console.error('Erro ao atualizar post:', error);
    return NextResponse.json({ error: 'Erro ao atualizar post' }, { status: 500 });
  }
}
