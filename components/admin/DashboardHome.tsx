
import React, { useEffect, useState } from 'react';
import { 
  Users, TrendingUp, BookOpen, Calendar, 
  ArrowUpRight, Clock, Star, Zap, Bot
} from 'lucide-react';
import { dbService, AutomationSettings } from '../../db';

const DashboardHome: React.FC = () => {
  const [autoSettings, setAutoSettings] = useState<AutomationSettings | null>(null);

  useEffect(() => {
    dbService.getAutomationSettings().then(setAutoSettings);
  }, []);

  const metrics = [
    { label: 'Alcance do Templo', value: '14.2k', change: '+12%', icon: <Users className="text-blue-500" /> },
    { label: 'Tempo de Leitura', value: '4:20m', change: '+5%', icon: <Clock className="text-neon" /> },
    { label: 'Engajamento IA', value: '88%', change: '+18%', icon: <Zap className="text-orange-500" /> },
    { label: 'Conversão', value: '3.2%', change: '+2%', icon: <TrendingUp className="text-green-500" /> },
  ];

  const recentActivity = [
    { title: 'A Jornada do Jejum Intermitente', type: 'IA Blog', time: '2 horas atrás', status: 'Publicado' },
    { title: 'Workshop de Agachamento Holy', type: 'Evento', time: '5 horas atrás', status: 'Ativo' },
    { title: 'Nutrição Baseada em Princípios', type: 'Manual', time: 'Ontem', status: 'Agendado' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Auto-Pilot Status Header */}
      <div className="grid lg:grid-cols-4 gap-6">
        <div className={`lg:col-span-4 p-8 rounded-[32px] border transition-all flex flex-col md:flex-row items-center justify-between gap-6 ${
          autoSettings?.enabled ? 'bg-neon/5 border-neon/20' : 'bg-zinc-900/20 border-white/5'
        }`}>
          <div className="flex items-center gap-6">
             <div className={`p-4 rounded-2xl ${autoSettings?.enabled ? 'bg-neon text-black' : 'bg-zinc-800 text-zinc-500'}`}>
               <Bot size={24} />
             </div>
             <div>
               <h3 className="text-sm font-black uppercase tracking-widest">Status do Auto-Pilot</h3>
               <p className={`text-[10px] font-bold uppercase tracking-widest ${autoSettings?.enabled ? 'text-neon' : 'text-zinc-500'}`}>
                 {autoSettings?.enabled ? `Ativado: Geração a cada ${autoSettings.frequency_days} dias` : 'Desativado: Aguardando configuração'}
               </p>
             </div>
          </div>
          <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
            Próxima geração estimada: {autoSettings?.enabled ? 'Em breve (via Cron Server)' : 'N/A'}
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="bg-zinc-900/30 p-8 rounded-[32px] border border-white/5 hover:border-white/10 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-black rounded-xl group-hover:scale-110 transition-transform border border-white/5">{m.icon}</div>
              <span className="text-[10px] font-black text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">{m.change}</span>
            </div>
            <p className="text-3xl font-black italic tracking-tighter mb-1">{m.value}</p>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-zinc-900/20 rounded-[40px] border border-white/5 p-10">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-xl font-black uppercase italic flex items-center gap-3">
              <Star size={20} className="text-neon" /> Atividade Recente
            </h2>
            <button className="text-[10px] font-black uppercase text-gray-500 hover:text-white transition-colors">Ver Tudo</button>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((act, i) => (
              <div key={i} className="flex items-center justify-between p-6 bg-black/40 rounded-2xl border border-white/5 hover:border-neon/20 transition-all group">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-neon transition-colors">
                    {act.type === 'Evento' ? <Calendar size={20} /> : <BookOpen size={20} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{act.title}</p>
                    <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">{act.type} • {act.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-full ${act.status === 'Publicado' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                    {act.status}
                  </span>
                  <ArrowUpRight size={14} className="text-zinc-700 group-hover:text-white transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-gradient-to-br from-neon/10 via-transparent to-transparent rounded-[40px] border border-neon/10 p-10 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-neon rounded-2xl flex items-center justify-center text-black mb-8 shadow-[0_0_20px_rgba(207,236,15,0.3)]">
              <Zap size={24} />
            </div>
            <h3 className="text-2xl font-black italic uppercase mb-4 leading-tight">Dica do <br /> Estrategista</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Artigos criados via IA com o tom "Inspirador" tendem a ter 24% mais compartilhamentos na Holy Spirit.
            </p>
          </div>
          <button className="w-full bg-white/5 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
            Ver Insights de SEO
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
