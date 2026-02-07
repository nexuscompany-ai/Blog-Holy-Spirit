
import React, { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, MapPin, ArrowLeft, Sparkles, BookOpen, X, Clock, Info } from 'lucide-react';
import { dbService, HolyEvent, HolySettings, supabase } from '../db';
import BlogCard from './BlogCard';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  slug: string;
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
        const { data: publishedPostsData } = await supabase
          .from('posts')
          .select('*')
          .not('published_at', 'is', null)
          .order('published_at', { ascending: false });

        const [allEvents, currentSettings] = await Promise.all([
          dbService.getEvents().catch(() => []),
          dbService.getSettings()
        ]);

        const now = new Date();
        const finalPosts = (publishedPostsData || []).filter((p: any) => {
          const pDate = p.published_at;
          return pDate ? new Date(pDate) <= now : false;
        });

        setPosts(finalPosts);
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
                {selectedPost.category}
              </span>
              <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.85] text-white">
                {selectedPost.title}
              </h1>
              <p className="text-zinc-500 text-2xl leading-relaxed italic border-l-4 border-neon pl-8 max-w-2xl mx-auto">
                "{selectedPost.excerpt}"
              </p>
            </header>

            {selectedPost.image && selectedPost.image.length > 10 && (
              <div className="aspect-video rounded-[60px] overflow-hidden border border-white/5 shadow-2xl relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="prose prose-invert max-w-none text-zinc-400 text-xl leading-loose space-y-10 font-medium pb-20">
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
      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/60 animate-in fade-in duration-300">
          <div className="bg-zinc-950 border border-white/10 w-full max-w-3xl rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="relative aspect-video">
              <img src={selectedEvent.image} className="w-full h-full object-cover" alt={selectedEvent.title} />
              <button 
                onClick={() => setSelectedEvent(null)}
                className="absolute top-6 right-6 p-3 bg-black/50 text-white rounded-full backdrop-blur-md hover:bg-neon hover:text-black transition-all"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-10 space-y-8">
              <div className="space-y-4">
                <span className="bg-neon text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{selectedEvent.category}</span>
                <h2 className="text-4xl md:text-5xl font-black uppercase italic italic tracking-tighter text-white">{selectedEvent.title}</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-6 border-y border-white/5">
                <div className="space-y-1">
                  <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest flex items-center gap-2"><CalendarIcon size={12}/> Data</p>
                  <p className="text-white font-bold">{new Date(selectedEvent.date).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest flex items-center gap-2"><Clock size={12}/> Horário</p>
                  <p className="text-white font-bold">{selectedEvent.time}</p>
                </div>
                <div className="col-span-2 md:col-span-1 space-y-1">
                  <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest flex items-center gap-2"><MapPin size={12}/> Local</p>
                  <p className="text-white font-bold italic">{selectedEvent.location}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-neon">Sobre este momento</h4>
                <p className="text-zinc-400 leading-loose text-lg">{selectedEvent.description || 'Nenhuma descrição adicional informada para este evento.'}</p>
              </div>

              {selectedEvent.whatsappEnabled && (
                <a 
                  href={`https://wa.me/${selectedEvent.whatsappNumber?.replace(/\D/g, '')}?text=${encodeURIComponent(selectedEvent.whatsappMessage || '')}${encodeURIComponent(selectedEvent.title)}`}
                  target="_blank"
                  className="btn-primary w-full py-6 text-sm"
                >
                  Confirmar presença no WhatsApp
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
                image={post.image}
                category={post.category}
                title={post.title}
                desc={post.excerpt}
                date={new Date(post.published_at!).toLocaleDateString('pt-BR')}
                readTime="5 min"
                author={{ name: "Holy Spirit Editorial", avatar: "/icon.svg" }}
                onClick={() => setSelectedPost(post)}
              />
            ))}
            {posts.length === 0 && (
              <div className="col-span-full py-32 text-center glass-card rounded-[40px] border-dashed">
                 <BookOpen size={64} className="mx-auto text-zinc-800 mb-8" />
                 <p className="text-zinc-600 font-black uppercase text-sm tracking-[0.4em]">Aguardando as primeiras palavras do Templo...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 animate-in fade-in duration-500">
            {events.map((event) => {
              const waLink = event.whatsappEnabled 
                ? `https://wa.me/${event.whatsappNumber?.replace(/\D/g, '')}?text=${encodeURIComponent(event.whatsappMessage || '')}${encodeURIComponent(event.title)}`
                : null;

              return (
                <div 
                  key={event.id} 
                  onClick={() => setSelectedEvent(event)}
                  className="glass-card rounded-[40px] overflow-hidden group cursor-pointer"
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-6 left-6 flex gap-2">
                       <span className="bg-neon text-black px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                        {event.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-10 space-y-6">
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter group-hover:text-neon transition-colors text-white">
                      {event.title}
                    </h3>
                    <div className="space-y-3 text-zinc-500 text-[11px] font-black uppercase tracking-widest">
                      <div className="flex items-center gap-3"><CalendarIcon size={16} className="text-neon" /> {new Date(event.date).toLocaleDateString('pt-BR')}</div>
                      <div className="flex items-center gap-3"><MapPin size={16} className="text-neon" /> {event.location}</div>
                    </div>
                    {waLink ? (
                      <a 
                        href={waLink}
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                        className="btn-primary w-full py-4 text-xs"
                      >
                        Confirmar via WhatsApp
                      </a>
                    ) : (
                      <button className="w-full py-4 text-[10px] font-black uppercase tracking-widest border border-white/10 rounded-xl text-zinc-500 group-hover:text-white group-hover:border-white/30 transition-all flex items-center justify-center gap-2">
                         <Info size={14} /> Ver Detalhes
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {events.length === 0 && (
              <div className="col-span-full py-32 text-center glass-card rounded-[40px] border-dashed">
                 <CalendarIcon size={64} className="mx-auto text-zinc-800 mb-8" />
                 <p className="text-zinc-600 font-black uppercase text-sm tracking-[0.4em]">Nenhum evento agendado no momento.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
