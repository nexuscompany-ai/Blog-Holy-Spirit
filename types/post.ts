
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  date: string;
  status: 'published' | 'draft';
}

export interface CreatePostDTO {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
}
