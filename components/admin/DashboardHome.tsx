
import React, { useEffect, useState } from 'react';
import { 
  Users, TrendingUp, BookOpen, Calendar, 
  ArrowUpRight, Clock, Star, Zap, Bot, ShieldCheck, AlertTriangle
} from 'lucide-react';
import { dbService, AutomationSettings, DashboardMetrics } from '../../db';

const DashboardHome: React.FC = () => {
  const [autoSettings, setAutoSettings] = useState<AutomationSettings | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [aiOnline, setAiOnline] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const [auto, m] = await Promise.all([
          dbService.getAutomationSettings(),
          dbService.getMetrics()
        ]);
        setAutoSettings(auto);
        setMetrics(m);
        // AI status check depends strictly on process.env.API_KEY per guidelines
        setAiOnline(!!process.env.API_KEY);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const metricCards = metrics ? [
    { label: 'Artigos Publicados', value: metrics.postsCount.toString(), change: 'Total', icon: <BookOpen className="text-blue-500" /> },
    { label: 'Eventos Ativos', value: metrics.activeEventsCount.toString(), change: 'No Feed', icon: <Calendar className="text-neon" /> },
    { label: 'Automação IA', value: metrics.automationActive ? 'Ativa' : 'Pausada', change: 'Status', icon: <Bot className="text-orange-500" /> },
    { label: 'Conversão', value: 'Reais', change: '+2%', icon: <TrendingUp className="text-green-500" /> },
  ] : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-neon border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Consolidando Métricas...</p>
        </div>
      </div>
    );
  }

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
               <h3 className="text-sm font-black uppercase tracking-widest">Publicação Automática</h3>
               <p className={`text-[10px] font-bold uppercase tracking-widest ${autoSettings?.enabled ? 'text-neon' : 'text-zinc-500'}`}>
                 {autoSettings?.enabled ? `Ativa: Postagens a cada ${autoSettings.frequency_days} dias` : 'Aguardando Configuração'}
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
               <h3 className="text-sm font-black uppercase tracking-widest">Inteligência Holy Spirit</h3>
               <p className={`text-[10px] font-bold uppercase tracking-widest ${aiOnline ? 'text-blue-400' : 'text-red-400'}`}>
                 {aiOnline ? 'Integração Estabelecida' : 'Falta Chave de Integração'}
               </p>
             </div>
          </div>
          {aiOnline ? <ShieldCheck className="text-blue-500" size={20} /> : <AlertTriangle className="text-red-500" size={20} />}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((m, i) => (
          <div key={i} className="bg-zinc-900/30 p-8 rounded-[32px] border border-white/5 hover:border-white/10 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-black rounded-xl group-hover:scale-110 transition-transform border border-white/5">{m.icon}</div>
              <span className="text-[10px] font-black text-neon bg-neon/10 px-2 py-1 rounded-lg">{m.change}</span>
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
              <Star size={20} className="text-neon" /> Insights de Gestão
            </h2>
          </div>
          <div className="space-y-4">
             <div className="p-6 bg-black/40 rounded-2xl border border-white/5 italic text-sm text-zinc-400 leading-relaxed">
               {metrics?.postsCount === 0 
                 ? "O Templo ainda não possui artigos. Que tal usar a Inteligência IA para criar o seu primeiro post hoje?"
                 : `Você já possui ${metrics?.postsCount} artigos. Manter a frequência de postagem ajuda a manter seu Templo no topo das buscas.`
               }
             </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-neon/10 via-transparent to-transparent rounded-[40px] border border-neon/10 p-10 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-neon rounded-2xl flex items-center justify-center text-black mb-8 shadow-[0_0_20px_rgba(207,236,15,0.3)]">
              <Zap size={24} />
            </div>
            <h3 className="text-2xl font-black italic uppercase mb-4 leading-tight">Dica do Mestre</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 font-medium">
              Configure eventos com botões de WhatsApp personalizados para aumentar a taxa de confirmação dos seus alunos em aulas especiais.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
