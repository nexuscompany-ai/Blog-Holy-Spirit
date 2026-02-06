
import { prisma } from '../lib/prisma';
import { CreatePostDTO } from '../types/post';

export class PostsService {
  /**
   * Helper para gerar slug limpo e único
   */
  static generateSlug(title: string): string {
    const clean = title
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^\w\s-]/g, '')        // Remove caracteres especiais
      .replace(/[\s_-]+/g, '-')       // Espaços para -
      .replace(/^-+|-+$/g, '');       // Trim de -

    // Adiciona sufixo aleatório curto para garantir unicidade absoluta
    const suffix = Math.random().toString(36).substring(2, 7);
    return `${clean}-${suffix}`;
  }

  static async getAll() {
    return await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getPublished() {
    const now = new Date();
    return await prisma.post.findMany({
      where: {
        status: 'published',
        publishedAt: {
          not: null,
          lte: now
        }
      },
      orderBy: { publishedAt: 'desc' }
    });
  }

  // Fix: Added missing getBySlug method to allow retrieval of single post by its slug
  static async getBySlug(slug: string) {
    return await prisma.post.findUnique({
      where: { slug: slug.toLowerCase() },
    });
  }

  static async create(data: CreatePostDTO) {
    const slug = data.slug || this.generateSlug(data.title);
    const now = new Date().toISOString();

    return await prisma.post.create({
      data: {
        title: data.title,
        slug: slug.toLowerCase(),
        excerpt: data.excerpt,
        content: data.content,
        category: data.category,
        image: data.image,
        source: data.source,
        status: data.status || 'draft',
        createdAt: now,
        updatedAt: now,
        publishedAt: data.status === 'published' ? (data.publishedAt || now) : null,
      }
    });
  }

  static async update(id: string, data: any) {
    const now = new Date().toISOString();
    
    // Se estiver publicando agora e não tiver data, define
    if (data.status === 'published' && !data.publishedAt) {
      data.publishedAt = now;
    }

    return await prisma.post.update({
      where: { id },
      data: {
        ...data,
        updatedAt: now
      }
    });
  }
}
