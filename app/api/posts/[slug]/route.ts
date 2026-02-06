
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
