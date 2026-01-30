
import { prisma } from '../lib/prisma';
import { Post, CreatePostDTO } from '../types/post';

export class PostsService {
  static async getAll() {
    return await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      where: { status: 'published' }
    });
  }

  static async getBySlug(slug: string) {
    return await prisma.post.findUnique({
      where: { slug }
    });
  }

  static async create(data: CreatePostDTO) {
    const slug = data.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return await prisma.post.create({
      data: {
        ...data,
        slug,
        status: 'published',
        date: new Date().toLocaleDateString('pt-BR', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric' 
        })
      }
    });
  }

  static async delete(id: string) {
    return await prisma.post.delete({
      where: { id }
    });
  }
}
