
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  createdAt: string;
  updatedAt?: string;
  status: 'draft' | 'published';
  publishedAt?: string | null;
  source: 'manual' | 'ai';
}

export interface CreatePostDTO {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  source: 'manual' | 'ai';
  status: 'draft' | 'published';
  publishedAt?: string | null;
}
