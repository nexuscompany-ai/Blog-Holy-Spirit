
import React from 'react';
import { FileCheck, Edit3, Eye, Clock, Calendar as CalendarIcon } from 'lucide-react';

const DashboardHome: React.FC = () => {
  const metrics = [
    { label: 'Publicados', value: '12', icon: <FileCheck className="text-green-500" /> },
    { label: 'Rascunhos', value: '04', icon: <Edit3 className="text-yellow-500" /> },
    { label: 'Visitas Totais', value: '1.240', icon: <Eye className="text-blue-500" /> },
    { label: 'Agendados', value: '08', icon: <Clock className="text-[#cfec0f]" /> },
  ];

  const schedule = [
    { title: 'Nutrição no Templo', type: 'IA', date: '24/05 - 09:00' },
    { title: 'Treino de Pernas e Fé', type: 'Manual', date: '25/05 - 14:00' },
    { title: 'O Jejum do Guerreiro', type: 'IA', date: '26/05 - 08:30' },
  ];

  return (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
            <div className="flex justify-between items-start mb-4">
              <span className="text-3xl font-black">{m.value}</span>
              <div className="p-2 bg-black rounded-lg">{m.icon}</div>
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Calendar View */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-zinc-900/30 rounded-3xl border border-white/5 p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black uppercase italic flex items-center gap-3">
              <CalendarIcon size={20} className="text-[#cfec0f]" /> Calendário Editorial
            </h2>
            <select className="bg-black border border-white/10 rounded-lg px-3 py-1 text-xs outline-none text-gray-400">
              <option>Maio 2024</option>
            </select>
          </div>
          
          <div className="space-y-4">
            {schedule.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5 hover:border-[#cfec0f]/20 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${item.type === 'IA' ? 'bg-[#cfec0f]' : 'bg-blue-500'}`}></div>
                  <div>
                    <h4 className="font-bold text-sm">{item.title}</h4>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-tighter">Origem: {item.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-400">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#cfec0f]/10 to-transparent rounded-3xl border border-[#cfec0f]/20 p-8 flex flex-col justify-center">
          <h3 className="text-[#cfec0f] font-black text-2xl mb-4 leading-tight">Dica de IA</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Sua última postagem sobre "Treino e Jejum" teve 40% mais engajamento. Sugerimos agendar uma série sobre "Suplementação Natural" para amanhã.
          </p>
          <button className="bg-[#cfec0f] text-black font-black py-3 rounded-xl text-xs hover:scale-105 transition-all">
            GERAR COM IA AGORA
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
