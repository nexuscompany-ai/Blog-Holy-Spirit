
import React, { useEffect, useState } from 'react';
import { 
  Users, TrendingUp, BookOpen, Calendar, 
  ArrowUpRight, Clock, Star, Zap, Bot, ShieldCheck, AlertTriangle
} from 'lucide-react';
import { dbService, AutomationSettings, DashboardMetrics } from '../../db';

const DashboardHome: React.FC = () => {
  const [autoSettings, setAutoSettings] = useState<AutomationSettings | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [aiStatus, setAiStatus] = useState<'online' | 'offline' | 'checking'>('checking');
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
        
        // Verifica se a chave existe e parece válida
        const key = process.env.API_KEY;
        setAiStatus(key && key.length > 20 ? 'online' : 'offline');
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
    { label: 'Conversão Estimada', value: '4.2%', change: '+0.5%', icon: <TrendingUp className="text-green-500" /> },
  ] : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-neon border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Sincronizando Templo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="grid lg:grid-cols-2 gap-6">
        <div className={`p-8 rounded-[32px] border transition-all flex items-center justify-between gap-6 ${
          autoSettings?.enabled ? 'bg-neon/5 border-neon/20' : 'bg-zinc-900/20 border-white/5'
        }`}>
          <div className="flex items-center gap-6">
             <div className={`p-4 rounded-2xl ${autoSettings?.enabled ? 'bg-neon text-black' : 'bg-zinc-800 text-zinc-500'}`}>
               <Bot size={24} />
             </div>
             <div>
               <h3 className="text-sm font-black uppercase tracking-widest">Auto-Pilot</h3>
               <p className={`text-[10px] font-bold uppercase tracking-widest ${autoSettings?.enabled ? 'text-neon' : 'text-zinc-500'}`}>
                 {autoSettings?.enabled ? `Publicação automática a cada ${autoSettings.frequency_days} dias` : 'Desativado'}
               </p>
             </div>
          </div>
        </div>

        <div className={`p-8 rounded-[32px] border transition-all flex items-center justify-between gap-6 ${
          aiStatus === 'online' ? 'bg-blue-500/5 border-blue-500/20' : 'bg-red-500/5 border-red-500/20'
        }`}>
          <div className="flex items-center gap-6">
             <div className={`p-4 rounded-2xl ${aiStatus === 'online' ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'}`}>
               <Zap size={24} />
             </div>
             <div>
               <h3 className="text-sm font-black uppercase tracking-widest">Motor IA (TEST API BLOG)</h3>
               <p className={`text-[10px] font-bold uppercase tracking-widest ${aiStatus === 'online' ? 'text-blue-400' : 'text-red-400'}`}>
                 {aiStatus === 'online' ? 'Pronto para Criar' : 'Erro de Configuração ou Cota'}
               </p>
             </div>
          </div>
          {aiStatus === 'online' ? <ShieldCheck className="text-blue-500" size={20} /> : <AlertTriangle className="text-red-500" size={20} />}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((m, i) => (
          <div key={i} className="bg-zinc-900/30 p-8 rounded-[32px] border border-white/5 hover:border-white/10 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-black rounded-xl border border-white/5">{m.icon}</div>
              <span className="text-[10px] font-black text-neon bg-neon/10 px-2 py-1 rounded-lg">{m.change}</span>
            </div>
            <p className="text-3xl font-black italic tracking-tighter mb-1">{m.value}</p>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-zinc-900/20 rounded-[40px] border border-white/5 p-10">
          <h2 className="text-xl font-black uppercase italic flex items-center gap-3 mb-10">
            <Star size={20} className="text-neon" /> Insights Estratégicos
          </h2>
          <div className="p-6 bg-black/40 rounded-2xl border border-white/5 italic text-sm text-zinc-400 leading-relaxed">
            {metrics?.postsCount && metrics.postsCount > 0 
              ? "Seu Templo está ganhando autoridade. Continue postando para melhorar o SEO orgânico."
              : "A IA está pronta para gerar seu primeiro conteúdo. Vá em 'Escritora IA' para começar."
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
