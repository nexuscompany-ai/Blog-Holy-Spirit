
import React, { useEffect, useState } from 'react';
import { BookOpen, Share2, Calendar as CalendarIcon, MessageCircle, MapPin, Clock } from 'lucide-react';

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

interface HolyEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string;
  status: 'active' | 'inactive';
  image?: string;
}

const BlogSection: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [events, setEvents] = useState<HolyEvent[]>([]);
  const [activeTab, setActiveTab] = useState<'articles' | 'events'>('articles');
  
  const settings = JSON.parse(localStorage.getItem('hs_settings') || '{"phone": "5511999999999"}');
  const waLink = `https://wa.me/${settings.phone.replace(/\D/g, '')}`;

  useEffect(() => {
    const savedPosts = localStorage.getItem('hs_blogs');
    const savedEvents = localStorage.getItem('hs_events');
    
    if (savedPosts) setPosts(JSON.parse(savedPosts));
    if (savedEvents) {
      const allEvents = JSON.parse(savedEvents);
      setEvents(allEvents.filter((e: HolyEvent) => e.status === 'active'));
    }
  }, []);

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
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[#cfec0f] font-black text-xs tracking-widest hover:translate-x-2 transition-transform uppercase">
            DÚVIDAS? FALE CONOSCO <MessageCircle size={18} />
          </a>
        </div>

        {activeTab === 'articles' ? (
          <div className="grid md:grid-cols-2 gap-12">
            {posts.map((post) => (
              <article key={post.id} className="group cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                  <div className="flex items-center gap-4 text-[10px] text-gray-600 font-black uppercase tracking-[0.2em]">
                    <span>{post.date}</span>
                    <span className="w-1.5 h-1.5 bg-[#cfec0f]/30 rounded-full"></span>
                    <span>Editorial Piloto IA</span>
                  </div>
                  <h3 className="text-3xl font-black group-hover:text-[#cfec0f] transition-colors leading-tight tracking-tighter uppercase italic">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed line-clamp-2 text-sm">
                    {post.excerpt}
                  </p>
                  <div className="pt-6 flex items-center justify-between">
                    <a href={waLink} className="bg-white/5 text-white px-8 py-4 rounded-2xl font-black text-[10px] hover:bg-[#cfec0f] hover:text-black transition-all uppercase tracking-widest flex items-center gap-3">
                      Saber Mais no Whats <MessageCircle size={14} />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {events.map((event) => (
              <div key={event.id} className="bg-zinc-900/30 border border-white/5 rounded-[40px] overflow-hidden group hover:border-[#cfec0f]/30 transition-all flex flex-col h-full animate-in fade-in zoom-in-95 duration-500">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img 
                    src={event.image || 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800'} 
                    alt={event.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#cfec0f] text-black px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest">
                      {event.category}
                    </span>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow space-y-4">
                  <h3 className="text-xl font-black italic uppercase tracking-tight group-hover:text-[#cfec0f] transition-colors">
                    {event.title}
                  </h3>
                  <div className="space-y-2 text-gray-500 text-[11px] font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-3"><CalendarIcon size={14} className="text-[#cfec0f]" /> {new Date(event.date).toLocaleDateString('pt-BR')}</div>
                    <div className="flex items-center gap-3"><Clock size={14} className="text-[#cfec0f]" /> {event.time}</div>
                    <div className="flex items-center gap-3"><MapPin size={14} className="text-[#cfec0f]" /> {event.location}</div>
                  </div>
                  <p className="text-gray-600 text-xs leading-relaxed line-clamp-3">
                    {event.description}
                  </p>
                  <div className="pt-4 mt-auto">
                    <a href={waLink} className="w-full bg-[#cfec0f] text-black text-center py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest block hover:scale-[1.02] transition-all">
                      GARANTIR VAGA
                    </a>
                  </div>
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-[40px]">
                 <CalendarIcon size={48} className="mx-auto text-zinc-800 mb-4" />
                 <p className="text-gray-600 font-black uppercase text-xs tracking-widest">Nenhum evento ativo no momento</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
