
import { NextResponse } from 'next/server';
import { PostsService } from '../../../services/posts.service';

export async function GET() {
  try {
    const posts = await PostsService.getAll();
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newPost = await PostsService.create(body);
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar post' }, { status: 500 });
  }
}
