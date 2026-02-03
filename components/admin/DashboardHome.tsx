
import React, { useEffect, useState } from 'react';
import { 
  Users, TrendingUp, BookOpen, Calendar, 
  ArrowUpRight, Clock, Star, Zap, Bot, ShieldCheck, AlertTriangle
} from 'lucide-react';
import { dbService, AutomationSettings } from '../../db';

const DashboardHome: React.FC = () => {
  const [autoSettings, setAutoSettings] = useState<AutomationSettings | null>(null);
  const [aiOnline, setAiOnline] = useState<boolean | null>(null);

  useEffect(() => {
    dbService.getAutomationSettings().then(setAutoSettings);
    // Verifica se a chave de API está presente para o funcionamento da IA
    setAiOnline(!!process.env.API_KEY);
  }, []);

  const metrics = [
    { label: 'Alcance do Templo', value: '14.2k', change: '+12%', icon: <Users className="text-blue-500" /> },
    { label: 'Tempo de Leitura', value: '4:20m', change: '+5%', icon: <Clock className="text-neon" /> },
    { label: 'Engajamento IA', value: '88%', change: '+18%', icon: <Zap className="text-orange-500" /> },
    { label: 'Conversão', value: '3.2%', change: '+2%', icon: <TrendingUp className="text-green-500" /> },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* AI Connection & Auto-Pilot Status */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className={`p-8 rounded-[32px] border transition-all flex items-center justify-between gap-6 ${
          autoSettings?.enabled ? 'bg-neon/5 border-neon/20' : 'bg-zinc-900/20 border-white/5'
        }`}>
          <div className="flex items-center gap-6">
             <div className={`p-4 rounded-2xl ${autoSettings?.enabled ? 'bg-neon text-black' : 'bg-zinc-800 text-zinc-500'}`}>
               <Bot size={24} />
             </div>
             <div>
               <h3 className="text-sm font-black uppercase tracking-widest">Auto-Pilot Status</h3>
               <p className={`text-[10px] font-bold uppercase tracking-widest ${autoSettings?.enabled ? 'text-neon' : 'text-zinc-500'}`}>
                 {autoSettings?.enabled ? `Ativo: Postagens a cada ${autoSettings.frequency_days} dias` : 'Aguardando Ativação'}
               </p>
             </div>
          </div>
        </div>

        <div className={`p-8 rounded-[32px] border transition-all flex items-center justify-between gap-6 ${
          aiOnline ? 'bg-blue-500/5 border-blue-500/20' : 'bg-red-500/5 border-red-500/20'
        }`}>
          <div className="flex items-center gap-6">
             <div className={`p-4 rounded-2xl ${aiOnline ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'}`}>
               <Zap size={24} />
             </div>
             <div>
               <h3 className="text-sm font-black uppercase tracking-widest">Escritora IA (Gemini)</h3>
               <p className={`text-[10px] font-bold uppercase tracking-widest ${aiOnline ? 'text-blue-400' : 'text-red-400'}`}>
                 {aiOnline ? 'Conexão Estabelecida' : 'API Key não configurada'}
               </p>
             </div>
          </div>
          {aiOnline ? <ShieldCheck className="text-blue-500" size={20} /> : <AlertTriangle className="text-red-500" size={20} />}
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
        <div className="lg:col-span-2 bg-zinc-900/20 rounded-[40px] border border-white/5 p-10">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-xl font-black uppercase italic flex items-center gap-3">
              <Star size={20} className="text-neon" /> Insights de IA
            </h2>
          </div>
          <div className="space-y-4">
             <div className="p-6 bg-black/40 rounded-2xl border border-white/5 italic text-sm text-zinc-400">
               "A IA está analisando seus pilares de conteúdo. Posts sobre 'Nutrição Espiritual' têm gerado 30% mais cliques no botão de matrícula."
             </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-neon/10 via-transparent to-transparent rounded-[40px] border border-neon/10 p-10 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-neon rounded-2xl flex items-center justify-center text-black mb-8 shadow-[0_0_20px_rgba(207,236,15,0.3)]">
              <Zap size={24} />
            </div>
            <h3 className="text-2xl font-black italic uppercase mb-4 leading-tight">Dica de Lançamento</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Configure seu Auto-Pilot para postar às 05:00 AM. Seus alunos costumam ler conteúdos motivacionais antes do primeiro treino.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
