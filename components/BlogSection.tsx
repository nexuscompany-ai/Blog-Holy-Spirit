
import React, { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, MessageCircle, MapPin, Clock, BookOpen, X, ArrowLeft } from 'lucide-react';
import { dbService, HolyEvent, HolySettings } from '../db';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  slug: string;
  createdAt: string;
}

const BlogSection: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [events, setEvents] = useState<HolyEvent[]>([]);
  const [activeTab, setActiveTab] = useState<'articles' | 'events'>('articles');
  const [settings, setSettings] = useState<HolySettings | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  
  const waLink = settings ? `https://wa.me/${settings.phone.replace(/\D/g, '')}` : '#';

  useEffect(() => {
    const fetchData = async () => {
      const [allPosts, allEvents, currentSettings] = await Promise.all([
        dbService.getBlogs(),
        dbService.getEvents(),
        dbService.getSettings()
      ]);
      
      setPosts(allPosts);
      setEvents(allEvents.filter(e => e.status === 'active'));
      setSettings(currentSettings);
    };
    
    fetchData();
  }, []);

  // SEO DINÂMICO
  useEffect(() => {
    if (selectedPost) {
      document.title = `${selectedPost.title} | Holy Spirit Blog`;
      // Simulação de atualização de meta tags (em Next.js real seria via Head component)
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', selectedPost.excerpt);
    } else {
      document.title = 'Holy Spirit Gym | Treine o Templo';
    }
  }, [selectedPost]);

  if (selectedPost) {
    return (
      <section className="py-32 bg-black min-h-screen animate-in fade-in duration-500">
        <div className="max-w-4xl mx-auto px-4">
          <button 
            onClick={() => setSelectedPost(null)}
            className="flex items-center gap-3 text-neon font-black text-[10px] uppercase tracking-[0.3em] mb-12 hover:-translate-x-2 transition-transform"
          >
            <ArrowLeft size={14} /> Voltar para o Templo
          </button>

          <div className="space-y-12">
            <header className="space-y-6 text-center">
              <span className="bg-neon/10 text-neon px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-neon/20">
                {selectedPost.category}
              </span>
              <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
                {selectedPost.title}
              </h1>
              <p className="text-gray-500 text-xl leading-relaxed italic">"{selectedPost.excerpt}"</p>
            </header>

            <div className="aspect-video rounded-[50px] overflow-hidden border border-white/5 shadow-2xl">
              <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-full object-cover" />
            </div>

            <div className="prose prose-invert max-w-none text-gray-300 text-lg leading-loose space-y-6">
              {selectedPost.content.split('\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <div className="pt-20 border-t border-white/5">
              <div className="bg-zinc-900/40 p-12 rounded-[50px] text-center space-y-8">
                <h3 className="text-3xl font-black uppercase italic">Inspirado por este conteúdo?</h3>
                <p className="text-gray-500">Comece sua jornada de transformação física e espiritual hoje mesmo.</p>
                <a href={waLink} target="_blank" className="inline-block bg-neon text-black font-black px-12 py-6 rounded-3xl uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-neon/10">
                  Agendar Aula Experimental
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div className="max-w-xl">
            <h2 className="text-5xl md:text-6xl font-black uppercase italic mb-4 tracking-tighter">
              O <span className="text-[#cfec0f]">TEMPLO</span> ONLINE
            </h2>
            <div className="flex gap-4 mt-8 p-1 bg-zinc-900/50 rounded-2xl w-fit border border-white/5">
              <button 
                onClick={() => setActiveTab('articles')}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'articles' ? 'bg-[#cfec0f] text-black shadow-lg shadow-[#cfec0f]/20' : 'text-gray-500 hover:text-white'}`}
              >
                Artigos IA
              </button>
              <button 
                onClick={() => setActiveTab('events')}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'events' ? 'bg-[#cfec0f] text-black shadow-lg shadow-[#cfec0f]/20' : 'text-gray-500 hover:text-white'}`}
              >
                Eventos Ativos ({events.length})
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'articles' ? (
          <div className="grid md:grid-cols-2 gap-12">
            {posts.map((post) => (
              <article 
                key={post.id} 
                onClick={() => setSelectedPost(post)}
                className="group cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                <div className="relative aspect-[16/9] rounded-[40px] overflow-hidden mb-8 border border-white/5 shadow-2xl">
                  <img 
                    src={post.image || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800'} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="bg-[#cfec0f] text-black px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="space-y-4 px-2">
                  <h3 className="text-3xl font-black group-hover:text-[#cfec0f] transition-colors leading-tight tracking-tighter uppercase italic">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed line-clamp-2 text-sm">
                    {post.excerpt}
                  </p>
                  <div className="pt-6">
                    <span className="text-neon text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                      Ler Artigo Completo <ArrowLeft className="rotate-180" size={14} />
                    </span>
                  </div>
                </div>
              </article>
            ))}
            {posts.length === 0 && (
              <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-[40px]">
                 <BookOpen size={48} className="mx-auto text-zinc-800 mb-4" />
                 <p className="text-gray-600 font-black uppercase text-xs tracking-widest">Aguardando as primeiras palavras do Templo...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {events.map((event) => (
              <div key={event.id} className="bg-zinc-900/30 border border-white/5 rounded-[40px] overflow-hidden group hover:border-[#cfec0f]/30 transition-all flex flex-col h-full animate-in fade-in zoom-in-95 duration-500">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                <div className="p-8 flex flex-col flex-grow space-y-4">
                  <h3 className="text-xl font-black italic uppercase tracking-tight group-hover:text-[#cfec0f] transition-colors">
                    {event.title}
                  </h3>
                  <div className="space-y-2 text-gray-500 text-[11px] font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-3"><CalendarIcon size={14} className="text-[#cfec0f]" /> {new Date(event.date).toLocaleDateString('pt-BR')}</div>
                    <div className="flex items-center gap-3"><MapPin size={14} className="text-[#cfec0f]" /> {event.location}</div>
                  </div>
                  <div className="pt-4 mt-auto">
                    <a href={waLink} target="_blank" className="w-full bg-[#cfec0f] text-black text-center py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest block hover:scale-[1.02] transition-all">
                      GARANTIR VAGA
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
