
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  createdAt: string;
  published: boolean;
  publishedAt?: string;
  source: 'manual' | 'ai';
}

export interface CreatePostDTO {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  source: 'manual' | 'ai';
  publishedAt?: string;
  published: boolean;
}
