
import React, { useEffect, useState } from 'react';
import { FileCheck, Edit3, Eye, Clock, Calendar as CalendarIcon, Database, AlertCircle, RefreshCw } from 'lucide-react';

const DashboardHome: React.FC = () => {
  const [dbStatus, setDbStatus] = useState<'loading' | 'online' | 'offline'>('loading');

  const checkHealth = async () => {
    setDbStatus('loading');
    try {
      const res = await fetch('/api/health');
      if (res.ok) setDbStatus('online');
      else setDbStatus('offline');
    } catch {
      setDbStatus('offline');
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const metrics = [
    { label: 'Publicados', value: '12', icon: <FileCheck className="text-green-500" /> },
    { label: 'Rascunhos', value: '04', icon: <Edit3 className="text-yellow-500" /> },
    { label: 'Visitas Totais', value: '1.240', icon: <Eye className="text-blue-500" /> },
    { label: 'Agendados', value: '08', icon: <Clock className="text-[#cfec0f]" /> },
  ];

  return (
    <div className="space-y-8">
      {/* Banner de Status do Supabase */}
      <div className={`p-6 rounded-[32px] border flex items-center justify-between transition-all duration-500 ${
        dbStatus === 'online' ? 'bg-green-500/5 border-green-500/20 text-green-500' : 
        dbStatus === 'offline' ? 'bg-red-500/5 border-red-500/20 text-red-500' : 
        'bg-zinc-900 border-white/5 text-gray-500'
      }`}>
        <div className="flex items-center gap-5">
          <div className={`p-3 rounded-2xl ${dbStatus === 'online' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
            {dbStatus === 'online' ? <Database size={24} /> : <AlertCircle size={24} />}
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-1">
              Conexão Supabase: {dbStatus === 'loading' ? 'Sincronizando...' : dbStatus.toUpperCase()}
            </h3>
            <p className="text-[10px] font-bold opacity-60 uppercase">
              Projeto ID: xkapuhuuqqjmcxxrnpcf
            </p>
          </div>
        </div>
        <button 
          onClick={checkHealth}
          className="p-3 hover:bg-white/5 rounded-full transition-all"
        >
          <RefreshCw size={18} className={dbStatus === 'loading' ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="bg-zinc-900/30 p-8 rounded-[32px] border border-white/5 hover:border-white/10 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <span className="text-4xl font-black italic tracking-tighter">{m.value}</span>
              <div className="p-3 bg-black rounded-xl group-hover:scale-110 transition-transform">{m.icon}</div>
            </div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-zinc-900/20 rounded-[40px] border border-white/5 p-10">
          <h2 className="text-xl font-black uppercase italic flex items-center gap-3 mb-8">
            <CalendarIcon size={20} className="text-[#cfec0f]" /> Calendário Editorial
          </h2>
          <div className="space-y-4">
             <div className="p-6 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-between opacity-50">
                <span className="text-xs font-bold uppercase text-gray-500">Aguardando dados do banco...</span>
             </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#cfec0f]/10 to-transparent rounded-[40px] border border-[#cfec0f]/10 p-10 flex flex-col justify-center">
          <h3 className="text-[#cfec0f] font-black text-2xl mb-4 italic uppercase leading-none">Status Final</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-8 font-medium">
            {dbStatus === 'online' 
              ? 'Tudo pronto. O Templo está conectado e os dados serão salvos no Supabase.' 
              : 'Verifique se você configurou a DATABASE_URL no seu ambiente de produção.'}
          </p>
          <button 
            disabled={dbStatus !== 'online'}
            className="bg-[#cfec0f] text-black font-black py-5 rounded-2xl text-[10px] uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-30 disabled:grayscale"
          >
            INICIAR PRODUÇÃO IA
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
