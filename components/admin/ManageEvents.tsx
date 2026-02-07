
import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, MapPin, Clock, Plus, Trash2, CheckCircle2, 
  Eye, EyeOff, Archive, Zap, Camera, MessageSquare, ShieldCheck
} from 'lucide-react';
import { dbService, HolyEvent } from '../../db';

const ManageEvents: React.FC = () => {
  const [events, setEvents] = useState<HolyEvent[]>([]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
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
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800',
    whatsappEnabled: false,
    whatsappNumber: '',
    whatsappMessage: 'Olá! Gostaria de confirmar minha vaga no evento: '
  });

  const loadEvents = async () => {
    const allEvents = await dbService.getEvents();
    setEvents(allEvents);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const saveEvent = async () => {
    if (!newEvent.title || !newEvent.date) {
      alert("Por favor, preencha o título e a data do evento.");
      return;
    }
    setLoading(true);
    try {
      // Não enviamos ID manual. O Supabase gera o UUID automaticamente.
      await dbService.saveEvent(newEvent);
      
      setNewEvent({ 
        title: '', 
        date: '', 
        time: '', 
        location: '', 
        description: '', 
        category: 'Workshop', 
        status: 'active',
        image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800',
        whatsappEnabled: false,
        whatsappNumber: '',
        whatsappMessage: 'Olá! Gostaria de confirmar minha vaga no evento: '
      });
      
      setSuccess(true);
      await loadEvents();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert("Erro ao salvar o evento. Verifique o console para detalhes.");
    } finally {
      setLoading(false);
    }
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

  const deleteEvent = async (id: string) => {
    if (confirm('Excluir este evento permanentemente?')) {
      await dbService.deleteEvent(id);
      await loadEvents();
    }
  };

  const toggleStatus = async (id: string) => {
    const event = events.find(e => e.id === id);
    if (!event) return;
    const newStatus = event.status === 'active' ? 'inactive' : 'active';
    await dbService.updateEvent(id, { status: newStatus });
    await loadEvents();
  };

  const filteredEvents = events.filter(e => e.status === activeListTab);

  return (
    <div className="space-y-12 pb-20">
      <section className="bg-zinc-900/20 rounded-[40px] border border-white/5 p-12 space-y-10 shadow-inner">
        <div className="flex items-center gap-4">
          <div className="bg-[#cfec0f]/10 p-3 rounded-xl text-[#cfec0f]"><Plus size={24} /></div>
          <div>
            <h2 className="text-2xl font-black uppercase italic tracking-tight text-white">Consagrar Novo Evento</h2>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Organize e divulgue experiências únicas no Templo</p>
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
                  placeholder="Ex: Workshop de Nutrição"
                  className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#cfec0f] transition-all text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Categoria</label>
                <select 
                  value={newEvent.category}
                  onChange={e => setNewEvent({...newEvent, category: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#cfec0f] text-sm"
                >
                  <option>Workshop</option>
                  <option>Treino Especial</option>
                  <option>Momento de Fé</option>
                  <option>Social</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Local do Evento</label>
              <input 
                value={newEvent.location}
                onChange={e => setNewEvent({...newEvent, location: e.target.value})}
                placeholder="Av. das Nações ou Templo Interno"
                className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#cfec0f] text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Breve Descrição</label>
              <textarea 
                value={newEvent.description}
                onChange={e => setNewEvent({...newEvent, description: e.target.value})}
                rows={3}
                placeholder="Explique o que acontecerá..."
                className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#cfec0f] resize-none text-sm leading-relaxed"
              />
            </div>

            {/* WhatsApp CTA Section */}
            <div className="bg-zinc-950 p-8 rounded-3xl border border-white/5 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare className="text-[#cfec0f]" size={20} />
                  <h4 className="text-[10px] font-black uppercase tracking-widest">Chamada para WhatsApp</h4>
                </div>
                <button 
                  onClick={() => setNewEvent({...newEvent, whatsappEnabled: !newEvent.whatsappEnabled})}
                  className={`w-12 h-6 rounded-full transition-all relative ${newEvent.whatsappEnabled ? 'bg-[#cfec0f]' : 'bg-zinc-800'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${newEvent.whatsappEnabled ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>

              {newEvent.whatsappEnabled && (
                <div className="grid md:grid-cols-2 gap-6 animate-in slide-in-from-top-2">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-gray-600 tracking-widest ml-1">Número WhatsApp</label>
                    <input 
                      value={newEvent.whatsappNumber}
                      onChange={e => setNewEvent({...newEvent, whatsappNumber: e.target.value})}
                      placeholder="11999999999"
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#cfec0f]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-gray-600 tracking-widest ml-1">Mensagem Padrão</label>
                    <input 
                      value={newEvent.whatsappMessage}
                      onChange={e => setNewEvent({...newEvent, whatsappMessage: e.target.value})}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#cfec0f]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Capa do Evento</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-video bg-black border border-white/10 rounded-3xl overflow-hidden cursor-pointer group relative flex items-center justify-center"
              >
                <img src={newEvent.image} className="w-full h-full object-cover group-hover:opacity-40 transition-all" alt="Capa Preview" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  <Camera className="text-[#cfec0f]" size={32} />
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Data</label>
                <input type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-xs outline-none focus:border-[#cfec0f] text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Horário</label>
                <input type="time" value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-xs outline-none focus:border-[#cfec0f] text-white" />
              </div>
            </div>

            <button 
              onClick={saveEvent}
              disabled={loading}
              className="w-full bg-[#cfec0f] text-black font-black py-6 rounded-2xl text-[11px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#cfec0f]/20 disabled:opacity-50"
            >
              {loading ? "PROCESSANDO..." : "PUBLICAR EVENTO"}
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
              No Feed ({events.filter(e => e.status === 'active').length})
            </button>
            <button 
              onClick={() => setActiveListTab('inactive')}
              className={`px-8 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeListTab === 'inactive' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
            >
              Arquivados ({events.filter(e => e.status === 'inactive').length})
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <div key={event.id} className={`bg-zinc-900/20 border border-white/5 rounded-[40px] overflow-hidden group transition-all relative ${event.status === 'inactive' ? 'opacity-40 grayscale' : 'hover:border-[#cfec0f]/30'}`}>
              <div className="aspect-video relative overflow-hidden">
                <img src={event.image} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt={event.title} />
                <div className="absolute top-4 left-4">
                  <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-lg ${event.status === 'active' ? 'bg-[#cfec0f] text-black' : 'bg-zinc-800 text-gray-500'}`}>
                    {event.category}
                  </span>
                </div>
                {event.whatsappEnabled && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full shadow-lg">
                    <MessageSquare size={12} />
                  </div>
                )}
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
                  <div className="flex items-center gap-3 italic"><MapPin size={14} className="text-[#cfec0f]" /> {event.location || "Local sob consulta"}</div>
                </div>
              </div>
            </div>
          ))}
          {filteredEvents.length === 0 && (
            <div className="col-span-full py-20 text-center border border-dashed border-white/5 rounded-3xl">
              <p className="text-gray-600 text-xs font-bold uppercase">Nenhum evento registrado nesta lista.</p>
            </div>
          )}
        </div>
      </section>

      {success && (
        <div className="fixed bottom-10 right-10 bg-green-600 text-white px-8 py-5 rounded-3xl font-black uppercase tracking-widest shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-10 z-[110]">
          <ShieldCheck size={20} /> Evento Registrado no Templo!
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
