
import React, { useEffect, useState } from 'react';
import { BookOpen, Share2 } from 'lucide-react';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  slug: string;
  date: string;
}

const INITIAL_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'A Disciplina do Treino como Reflexo da Vida Espiritual',
    excerpt: 'Como a constância na academia nos ensina lições profundas sobre fé, resiliência e a jornada cristã diária.',
    content: '',
    category: 'Espiritualidade',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800',
    slug: 'disciplina-treino-vida-espiritual',
    date: '20 Mai 2024'
  },
  {
    id: '2',
    title: 'Alimentação para o Templo: O que a Bíblia e a Ciência Dizem',
    excerpt: 'Um guia prático sobre nutrição equilibrada para quem deseja honrar a Deus através do cuidado com a saúde.',
    content: '',
    category: 'Nutrição',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800',
    slug: 'nutricao-templo-biblia-ciencia',
    date: '18 Mai 2024'
  }
];

const BlogSection: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const savedPosts = localStorage.getItem('hs_blogs');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      setPosts(INITIAL_POSTS);
      localStorage.setItem('hs_blogs', JSON.stringify(INITIAL_POSTS));
    }
  }, []);

  return (
    <section id="blog" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-black uppercase italic mb-4">
              Blog do <span className="text-[#cfec0f]">Templo</span>
            </h2>
            <p className="text-gray-500 font-medium">
              Conteúdo gerado com autoridade para transformar seu estilo de vida.
            </p>
          </div>
          <button className="flex items-center gap-2 text-[#cfec0f] font-bold hover:underline">
            VER TODO O CONTEÚDO <BookOpen size={20} />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {posts.map((post) => (
            <article key={post.id} className="group cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="relative aspect-[16/9] rounded-3xl overflow-hidden mb-6 border border-white/10 shadow-2xl">
                <img 
                  src={post.image || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800'} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#cfec0f] text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-lg">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-xs text-gray-600 font-bold uppercase tracking-widest">
                  <span>{post.date}</span>
                  <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                  <span>Leitura Sugerida</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black group-hover:text-[#cfec0f] transition-colors leading-tight">
                  {post.title}
                </h3>
                <p className="text-gray-400 leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="pt-4 flex items-center justify-between">
                  <button className="text-white font-black text-sm border-b-2 border-[#cfec0f] pb-1 hover:text-[#cfec0f] transition-colors uppercase">
                    Ler Artigo Completo
                  </button>
                  <button className="p-2 text-gray-500 hover:text-[#cfec0f] transition-colors">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
