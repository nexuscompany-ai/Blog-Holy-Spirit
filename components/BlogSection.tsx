
import React, { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, MapPin, ArrowLeft, Sparkles, X, Clock, Info, MessageSquare } from 'lucide-react';
import { dbService, HolyEvent, HolySettings, supabase } from '../db';
import BlogCard from './BlogCard';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image_url: string;
  created_at: string;
  published_at?: string | null;
}

const BlogSection: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [events, setEvents] = useState<HolyEvent[]>([]);
  const [activeTab, setActiveTab] = useState<'articles' | 'events'>('articles');
  const [settings, setSettings] = useState<HolySettings | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<HolyEvent | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [allPosts, allEvents, currentSettings] = await Promise.all([
          dbService.getBlogs(),
          dbService.getEvents().catch(() => []),
          dbService.getSettings()
        ]);

        const now = new Date();
        const publishedPosts = allPosts.filter((p: any) => {
          const pDate = p.published_at;
          return pDate ? new Date(pDate) <= now : false;
        });

        setPosts(publishedPosts);
        setEvents(allEvents.filter((e: any) => e.status === 'active'));
        setSettings(currentSettings);
      } catch (err) {
        console.error("Erro no feed público:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const handleHash = () => {
      if (window.location.hash === '#eventos') setActiveTab('events');
      else if (window.location.hash === '#blog') setActiveTab('articles');
    };
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  if (selectedPost) {
    return (
      <section className="py-20 md:py-32 bg-black min-h-screen">
        <div className="max-w-4xl mx-auto px-6">
          <button 
            onClick={() => setSelectedPost(null)}
            className="flex items-center gap-3 text-neon font-black text-[10px] md:text-[11px] uppercase tracking-[0.4em] mb-12 md:mb-16 hover:-translate-x-2 transition-transform"
          >
            <ArrowLeft size={16} /> Voltar para o Feed
          </button>

          <article className="space-y-12 md:space-y-16 animate-in fade-in duration-700">
            <header className="space-y-6 md:space-y-8 text-center md:text-left">
              <h1 className="text-2xl md:text-6xl font-black uppercase italic tracking-tighter leading-tight md:leading-[1.1] text-white">
                {selectedPost.title}
              </h1>
              {selectedPost.excerpt && (
                <p className="text-zinc-500 text-sm md:text-xl font-medium leading-relaxed max-w-2xl">
                  {selectedPost.excerpt}
                </p>
              )}
            </header>

            {selectedPost.image_url && selectedPost.image_url.length > 20 && (
              <div className="aspect-video rounded-[32px] md:rounded-[60px] overflow-hidden border border-white/5 shadow-2xl relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                <img src={selectedPost.image_url} alt={selectedPost.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="blog-content-view pb-20">
              <div dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
            </div>

            <div className="pt-20 md:pt-32 border-t border-white/5">
              <div className="glass-card p-10 md:p-16 rounded-[40px] md:rounded-[60px] text-center space-y-8 md:space-y-10 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-neon/10 rounded-full blur-3xl"></div>
                <h3 className="text-2xl md:text-4xl font-black uppercase italic text-white">Inspirado pela Performance?</h3>
                <p className="text-zinc-500 text-sm md:text-lg max-w-xl mx-auto">Transforme seu templo hoje mesmo. Comece sua jornada na Holy Spirit.</p>
                <a 
                  href={`https://wa.me/${settings?.phone?.replace(/\D/g, '') || '5511999999999'}`}
                  target="_blank"
                  className="btn-primary mx-auto inline-flex text-xs md:text-base px-10"
                >
                  Matricule-se Agora
                </a>
              </div>
            </div>
          </article>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-20 md:py-32 bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 gap-8 md:gap-12">
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center gap-3 text-neon font-black text-[10px] md:text-[11px] uppercase tracking-[0.3em] md:tracking-[0.4em]">
              <Sparkles size={16} /> Conteúdo & Comunidade
            </div>
            <h2 className="text-4xl md:text-8xl font-black uppercase italic leading-[0.9] md:leading-[0.85] tracking-tighter text-white">
              O <span className="text-neon neon-glow">TEMPLO</span> <br /> EM FOCO
            </h2>
          </div>

          <div className="flex p-1 bg-zinc-900/50 rounded-2xl border border-white/5 w-full md:w-auto overflow-x-auto scrollbar-hide">
            <button 
              onClick={() => setActiveTab('articles')}
              className={`flex-1 md:flex-none whitespace-nowrap px-6 md:px-10 py-3 md:py-4 rounded-xl text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'articles' ? 'bg-neon text-black shadow-xl shadow-neon/20' : 'text-zinc-500 hover:text-white'}`}
            >
              Blog
            </button>
            <button 
              onClick={() => setActiveTab('events')}
              className={`flex-1 md:flex-none whitespace-nowrap px-6 md:px-10 py-3 md:py-4 rounded-xl text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'events' ? 'bg-neon text-black shadow-xl shadow-neon/20' : 'text-zinc-500 hover:text-white'}`}
            >
              Eventos ({events.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-20 md:py-32 flex justify-center">
            <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-neon border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : activeTab === 'articles' ? (
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 animate-in fade-in duration-500">
            {posts.map((post) => (
              <BlogCard 
                key={post.id}
                image={post.image_url}
                title={post.title}
                desc={post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 120) + '...'}
                date={new Date(post.published_at!).toLocaleDateString('pt-BR')}
                readTime="5 min"
                author={{ name: "Holy Spirit Editorial", avatar: "/icon.svg" }}
                onClick={() => setSelectedPost(post)}
              />
            ))}
          </div>
        ) : (
          <div id="eventos" className="grid md:grid-cols-3 gap-6 md:gap-8 animate-in fade-in duration-500">
            {events.map((event) => (
              <div 
                key={event.id} 
                onClick={() => setSelectedEvent(event)}
                className="glass-card rounded-[32px] md:rounded-[40px] overflow-hidden group cursor-pointer flex flex-col h-full"
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-zinc-900">
                  {event.image ? (
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-700">
                      <CalendarIcon size={40} />
                    </div>
                  )}
                </div>
                <div className="p-8 md:p-10 space-y-4 md:space-y-6 flex-grow flex flex-col">
                  <h3 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter group-hover:text-neon transition-colors text-white line-clamp-2">
                    {event.title}
                  </h3>
                  <div className="space-y-3 text-zinc-500 text-[9px] md:text-[11px] font-black uppercase tracking-widest">
                    <div className="flex items-center gap-3"><CalendarIcon size={14} className="text-neon" /> {new Date(event.date).toLocaleDateString('pt-BR')}</div>
                    <div className="flex items-center gap-3"><MapPin size={14} className="text-neon" /> {event.location}</div>
                  </div>
                  
                  <div className="mt-auto pt-4 md:pt-6">
                    {event.whatsappEnabled ? (
                      <button 
                        className="btn-primary w-full py-4 text-[9px] md:text-[10px]"
                        onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }}
                      >
                        Garantir Vaga
                      </button>
                    ) : (
                      <button className="w-full py-3 md:py-4 border border-white/5 rounded-xl text-[8px] md:text-[9px] font-black uppercase text-zinc-600 group-hover:text-white transition-colors flex items-center justify-center gap-2">
                        <Info size={14} /> Ver Informações
                      </button>
                    )}
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
