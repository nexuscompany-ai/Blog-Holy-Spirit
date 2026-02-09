import React, { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, MapPin, ArrowLeft, Sparkles, X, Clock, Info, MessageSquare } from 'lucide-react';
import { dbService, HolyEvent, HolySettings, supabase } from '../db';
import BlogCard from './BlogCard';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string; // O dbService já entrega o nome via Join
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
      <section className="py-32 bg-black min-h-screen">
        <div className="max-w-4xl mx-auto px-6">
          <button 
            onClick={() => setSelectedPost(null)}
            className="flex items-center gap-3 text-neon font-black text-[11px] uppercase tracking-[0.4em] mb-16 hover:-translate-x-2 transition-transform"
          >
            <ArrowLeft size={16} /> Voltar para o Feed
          </button>

          <article className="space-y-16 animate-in fade-in duration-700">
            <header className="space-y-8 text-center">
              <span className="bg-neon text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                {selectedPost.category || 'Templo'}
              </span>
              <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.85] text-white">
                {selectedPost.title}
              </h1>
            </header>

            {selectedPost.image_url && selectedPost.image_url.length > 20 && (
              <div className="aspect-video rounded-[60px] overflow-hidden border border-white/5 shadow-2xl relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                <img src={selectedPost.image_url} alt={selectedPost.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="prose prose-invert max-w-none text-zinc-400 text-xl leading-loose space-y-10 font-medium pb-20 blog-content-view">
              <div dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
            </div>

            <div className="pt-32 border-t border-white/5">
              <div className="glass-card p-16 rounded-[60px] text-center space-y-10 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-neon/10 rounded-full blur-3xl"></div>
                <h3 className="text-4xl font-black uppercase italic text-white">Inspirado pela Performance?</h3>
                <p className="text-zinc-500 text-lg max-w-xl mx-auto">Transforme seu templo hoje mesmo. Comece sua jornada na Holy Spirit.</p>
                <a 
                  href={`https://wa.me/${settings?.phone?.replace(/\D/g, '') || '5511999999999'}`}
                  target="_blank"
                  className="btn-primary mx-auto inline-flex"
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
    <section id="blog" className="py-32 bg-black">
      {selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/80 animate-in fade-in duration-300">
          <div className="bg-zinc-950 border border-white/10 w-full max-w-3xl rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
            <div className="relative aspect-video">
              {selectedEvent.image ? (
                <img src={selectedEvent.image} className="w-full h-full object-cover" alt={selectedEvent.title} />
              ) : (
                <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-700">
                  <CalendarIcon size={64} />
                </div>
              )}
              <button 
                onClick={() => setSelectedEvent(null)}
                className="absolute top-6 right-6 p-3 bg-black/60 text-white rounded-full hover:bg-neon hover:text-black transition-all"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-10 space-y-8 overflow-y-auto custom-scrollbar">
              <div>
                <span className="bg-neon text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{selectedEvent.category}</span>
                <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white mt-4">{selectedEvent.title}</h2>
              </div>

              <div className="grid grid-cols-2 gap-6 border-y border-white/5 py-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-zinc-600 flex items-center gap-2"><Clock size={14} className="text-neon" /> Horário</p>
                  <p className="text-white font-bold">{new Date(selectedEvent.date).toLocaleDateString('pt-BR')} às {selectedEvent.time}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-zinc-600 flex items-center gap-2"><MapPin size={14} className="text-neon" /> Local</p>
                  <p className="text-white font-bold italic">{selectedEvent.location}</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-zinc-400 text-lg leading-relaxed whitespace-pre-wrap">{selectedEvent.description}</p>
              </div>

              {selectedEvent.whatsappEnabled && (
                <a 
                  href={`https://wa.me/${selectedEvent.whatsappNumber?.replace(/\D/g, '')}?text=${encodeURIComponent(selectedEvent.whatsappMessage || '')}`}
                  target="_blank"
                  className="btn-primary w-full py-6 text-sm"
                >
                  <MessageSquare size={18} /> Garantir minha vaga no WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-neon font-black text-[11px] uppercase tracking-[0.4em]">
              <Sparkles size={16} /> Conteúdo & Comunidade
            </div>
            <h2 className="text-5xl md:text-8xl font-black uppercase italic leading-[0.85] tracking-tighter text-white">
              O <span className="text-neon neon-glow">TEMPLO</span> <br /> EM FOCO
            </h2>
          </div>

          <div className="flex p-1.5 bg-zinc-900/50 rounded-2xl border border-white/5">
            <button 
              onClick={() => setActiveTab('articles')}
              className={`px-10 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'articles' ? 'bg-neon text-black shadow-xl shadow-neon/20' : 'text-zinc-500 hover:text-white'}`}
            >
              Blog
            </button>
            <button 
              onClick={() => setActiveTab('events')}
              className={`px-10 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'events' ? 'bg-neon text-black shadow-xl shadow-neon/20' : 'text-zinc-500 hover:text-white'}`}
            >
              Eventos ({events.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-32 flex justify-center">
            <div className="w-12 h-12 border-4 border-neon border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : activeTab === 'articles' ? (
          <div className="grid md:grid-cols-2 gap-12 animate-in fade-in duration-500">
            {posts.map((post) => (
              <BlogCard 
                key={post.id}
                image={post.image_url}
                category={post.category || 'Artigo'}
                title={post.title}
                desc={post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 160) + '...'}
                date={new Date(post.published_at!).toLocaleDateString('pt-BR')}
                readTime="5 min"
                author={{ name: "Holy Spirit Editorial", avatar: "/icon.svg" }}
                onClick={() => setSelectedPost(post)}
              />
            ))}
          </div>
        ) : (
          <div id="eventos" className="grid md:grid-cols-3 gap-8 animate-in fade-in duration-500">
            {events.map((event) => (
              <div 
                key={event.id} 
                onClick={() => setSelectedEvent(event)}
                className="glass-card rounded-[40px] overflow-hidden group cursor-pointer flex flex-col h-full"
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-zinc-900">
                  {event.image ? (
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-700">
                      <CalendarIcon size={48} />
                    </div>
                  )}
                  <div className="absolute top-6 left-6 flex gap-2">
                     <span className="bg-neon text-black px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                        {event.category}
                      </span>
                  </div>
                </div>
                <div className="p-10 space-y-6 flex-grow flex flex-col">
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter group-hover:text-neon transition-colors text-white">
                    {event.title}
                  </h3>
                  <div className="space-y-3 text-zinc-500 text-[11px] font-black uppercase tracking-widest">
                    <div className="flex items-center gap-3"><CalendarIcon size={16} className="text-neon" /> {new Date(event.date).toLocaleDateString('pt-BR')}</div>
                    <div className="flex items-center gap-3"><MapPin size={16} className="text-neon" /> {event.location}</div>
                  </div>
                  
                  <div className="mt-auto pt-6">
                    {event.whatsappEnabled ? (
                      <button 
                        className="btn-primary w-full py-4 text-[10px]"
                        onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }}
                      >
                        Garantir Vaga
                      </button>
                    ) : (
                      <button className="w-full py-4 border border-white/5 rounded-xl text-[9px] font-black uppercase text-zinc-600 group-hover:text-white transition-colors flex items-center justify-center gap-2">
                        <Info size={14} /> Ver Informações
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <div className="col-span-full py-20 text-center border border-dashed border-white/5 rounded-[40px]">
                <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest">Nenhum evento ativo no momento.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;