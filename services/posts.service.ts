
import { prisma } from '../lib/prisma';
import { CreatePostDTO } from '../types/post';

export class PostsService {
  static async getAll() {
    return await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      // Em produção, listamos todos para o admin, mas o frontend filtra por publishedAt
    });
  }

  static async getPublished() {
    const now = new Date();
    return await prisma.post.findMany({
      where: {
        published: true,
        OR: [
          { publishedAt: null },
          { publishedAt: { lte: now } }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getBySlug(slug: string) {
    return await prisma.post.findUnique({
      where: { slug }
    });
  }

  static async create(data: CreatePostDTO) {
    const baseSlug = data.title
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Garante slug único adicionando timestamp se necessário
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    return await prisma.post.create({
      data: {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        category: data.category,
        image: data.image,
        slug,
        source: data.source,
        published: data.published,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
      }
    });
  }

  static async delete(id: string) {
    return await prisma.post.delete({
      where: { id }
    });
  }
}
