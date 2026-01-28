
import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Clock, Plus, Trash2, Tag, CheckCircle2, Eye, EyeOff, Power, Archive, AlertTriangle, Zap, ImageIcon, Upload, Camera } from 'lucide-react';

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

const ManageEvents: React.FC = () => {
  const [events, setEvents] = useState<HolyEvent[]>([]);
  const [success, setSuccess] = useState(false);
  const [activeListTab, setActiveListTab] = useState<'active' | 'inactive'>('active');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [newEvent, setNewEvent] = useState<Omit<HolyEvent, 'id'>>({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    category: 'Workshop',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800'
  });

  useEffect(() => {
    const saved = localStorage.getItem('hs_events');
    if (saved) setEvents(JSON.parse(saved));
  }, []);

  const saveEvent = () => {
    if (!newEvent.title || !newEvent.date) return;
    const event: HolyEvent = { ...newEvent, id: Date.now().toString() };
    const updated = [event, ...events];
    setEvents(updated);
    localStorage.setItem('hs_events', JSON.stringify(updated));
    setNewEvent({ 
      title: '', 
      date: '', 
      time: '', 
      location: '', 
      description: '', 
      category: 'Workshop', 
      status: 'active',
      image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800'
    });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewEvent({ ...newEvent, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteEvent = (id: string) => {
    const updated = events.filter(e => e.id !== id);
    setEvents(updated);
    localStorage.setItem('hs_events', JSON.stringify(updated));
  };

  const toggleStatus = (id: string) => {
    const updated = events.map(e => 
      e.id === id ? { ...e, status: e.status === 'active' ? 'inactive' : 'active' } : e
    );
    setEvents(updated);
    localStorage.setItem('hs_events', JSON.stringify(updated));
  };

  const filteredEvents = events.filter(e => e.status === activeListTab);

  return (
    <div className="space-y-12 pb-20">
      <section className="bg-zinc-900/20 rounded-[40px] border border-white/5 p-12 space-y-10 shadow-inner">
        <div className="flex items-center gap-4">
          <div className="bg-[#cfec0f]/10 p-3 rounded-xl text-[#cfec0f]"><Plus size={24} /></div>
          <div>
            <h2 className="text-2xl font-black uppercase italic tracking-tight text-white">Consagrar Novo Evento</h2>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Preencha os detalhes e escolha uma imagem impactante</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Título do Evento</label>
                <input 
                  value={newEvent.title}
                  onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                  placeholder="Ex: Treino de Força Solidário"
                  className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#cfec0f] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Categoria</label>
                <select 
                  value={newEvent.category}
                  onChange={e => setNewEvent({...newEvent, category: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#cfec0f]"
                >
                  <option>Workshop</option>
                  <option>Treino Especial</option>
                  <option>Momento de Fé</option>
                  <option>Social</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Localização / Endereço</label>
              <input 
                value={newEvent.location}
                onChange={e => setNewEvent({...newEvent, location: e.target.value})}
                placeholder="Av. Principal, 123 ou Templo Interno"
                className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#cfec0f]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Descrição Curta</label>
              <textarea 
                value={newEvent.description}
                onChange={e => setNewEvent({...newEvent, description: e.target.value})}
                rows={3}
                className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#cfec0f] resize-none"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Capa do Evento</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-video bg-black border border-white/10 rounded-3xl overflow-hidden cursor-pointer group relative flex items-center justify-center"
              >
                <img src={newEvent.image} className="w-full h-full object-cover group-hover:opacity-40 transition-all" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  <Camera className="text-[#cfec0f]" size={32} />
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Data</label>
                <input type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-xs outline-none focus:border-[#cfec0f]" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Horário</label>
                <input type="time" value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-xs outline-none focus:border-[#cfec0f]" />
              </div>
            </div>

            <button 
              onClick={saveEvent}
              className="w-full bg-[#cfec0f] text-black font-black py-6 rounded-2xl text-[11px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#cfec0f]/20"
            >
              CRIAR EVENTO AGORA
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/5 pb-6">
          <div className="flex p-1 bg-zinc-900/50 rounded-xl border border-white/5">
            <button 
              onClick={() => setActiveListTab('active')}
              className={`px-8 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeListTab === 'active' ? 'bg-[#cfec0f] text-black' : 'text-gray-500 hover:text-white'}`}
            >
              Ativos ({events.filter(e => e.status === 'active').length})
            </button>
            <button 
              onClick={() => setActiveListTab('inactive')}
              className={`px-8 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeListTab === 'inactive' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
            >
              Inativos ({events.filter(e => e.status === 'inactive').length})
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <div key={event.id} className={`bg-zinc-900/20 border border-white/5 rounded-[40px] overflow-hidden group transition-all relative ${event.status === 'inactive' ? 'opacity-40 grayscale' : 'hover:border-[#cfec0f]/30'}`}>
              <div className="aspect-video relative overflow-hidden">
                <img src={event.image} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                <div className="absolute top-4 left-4">
                  <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-lg ${event.status === 'active' ? 'bg-[#cfec0f] text-black' : 'bg-zinc-800 text-gray-500'}`}>
                    {event.category}
                  </span>
                </div>
              </div>
              
              <div className="p-8 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-black italic uppercase leading-tight group-hover:text-[#cfec0f] transition-colors">
                    {event.title}
                  </h3>
                  <div className="flex gap-2">
                    <button onClick={() => toggleStatus(event.id)} className="p-2 hover:bg-white/5 rounded-lg text-gray-500 transition-all">
                      {event.status === 'active' ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button onClick={() => deleteEvent(event.id)} className="p-2 hover:bg-red-500/10 text-gray-500 hover:text-red-500 transition-all rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                  <div className="flex items-center gap-3"><Calendar size={14} className="text-[#cfec0f]" /> {new Date(event.date).toLocaleDateString('pt-BR')}</div>
                  <div className="flex items-center gap-3"><Clock size={14} className="text-[#cfec0f]" /> {event.time}</div>
                  <div className="flex items-center gap-3 italic"><MapPin size={14} className="text-[#cfec0f]" /> {event.location || "Local não definido"}</div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform">
                {event.status === 'active' ? <Zap size={120} /> : <Archive size={120} />}
              </div>
            </div>
          ))}
        </div>
      </section>

      {success && (
        <div className="fixed bottom-10 right-10 bg-green-600 text-white px-8 py-5 rounded-3xl font-black uppercase tracking-widest shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-10 z-[110]">
          <CheckCircle2 size={20} /> Evento Consagrado!
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
