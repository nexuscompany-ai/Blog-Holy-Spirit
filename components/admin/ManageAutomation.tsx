
import React, { useState, useEffect } from 'react';
import { Bot, Zap, Calendar, MessageSquare, ShieldCheck, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { dbService, AutomationSettings } from '../../db';

const ManageAutomation: React.FC = () => {
  const [settings, setSettings] = useState<AutomationSettings>({
    enabled: false,
    frequency_days: 3,
    topics: 'Musculação em alta, Nutrição para hipertrofia, Saúde espiritual no treino',
    target_category: 'Musculação'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    dbService.getAutomationSettings().then(setSettings);
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await dbService.saveAutomationSettings(settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl space-y-10 pb-20">
      {/* Header Status */}
      <div className={`p-10 rounded-[40px] border transition-all duration-700 relative overflow-hidden ${
        settings.enabled ? 'bg-neon/5 border-neon/20' : 'bg-zinc-900/20 border-white/5'
      }`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-6">
            <div className={`p-6 rounded-3xl transition-all ${
              settings.enabled ? 'bg-neon text-black shadow-[0_0_30px_rgba(207,236,15,0.4)]' : 'bg-zinc-800 text-gray-500'
            }`}>
              <Bot size={40} />
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">
                {settings.enabled ? 'Auto-Pilot Ativado' : 'Auto-Pilot em Standby'}
              </h3>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">
                A IA do Templo gera conteúdo de forma autônoma com base nas suas regras.
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => setSettings({...settings, enabled: !settings.enabled})}
            className={`px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${
              settings.enabled ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-neon text-black hover:scale-105 shadow-xl shadow-neon/20'
            }`}
          >
            {settings.enabled ? 'DESATIVAR AGORA' : 'ATIVAR AUTOMAÇÃO'}
          </button>
        </div>
        {settings.enabled && <div className="absolute top-0 right-0 w-64 h-64 bg-neon/10 rounded-full blur-[100px] animate-pulse"></div>}
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Configuration Panel */}
        <div className="bg-zinc-900/10 p-10 rounded-[40px] border border-white/5 space-y-8">
          <div className="flex items-center gap-3 text-neon font-black text-[10px] uppercase tracking-widest">
            <Zap size={14} /> Regras de Frequência
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-1">Frequência de Postagem</label>
              <div className="grid grid-cols-3 gap-3">
                {[1, 3, 7].map(days => (
                  <button
                    key={days}
                    onClick={() => setSettings({...settings, frequency_days: days})}
                    className={`py-4 rounded-xl text-[10px] font-black uppercase border transition-all ${
                      settings.frequency_days === days ? 'bg-white text-black border-white' : 'bg-black/40 border-white/5 text-gray-500 hover:text-white'
                    }`}
                  >
                    Cada {days} {days === 1 ? 'dia' : 'dias'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-1">Categoria Alvo</label>
              <select 
                value={settings.target_category}
                onChange={e => setSettings({...settings, target_category: e.target.value})}
                className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-neon text-sm"
              >
                <option>Musculação</option>
                <option>Nutrição</option>
                <option>Espiritualidade</option>
                <option>Lifestyle</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Strategy */}
        <div className="bg-zinc-900/10 p-10 rounded-[40px] border border-white/5 space-y-8">
          <div className="flex items-center gap-3 text-neon font-black text-[10px] uppercase tracking-widest">
            <MessageSquare size={14} /> Pilares de Conteúdo
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-1">Tópicos e Palavras-Chave</label>
              <textarea 
                value={settings.topics}
                onChange={e => setSettings({...settings, topics: e.target.value})}
                rows={4}
                placeholder="Ex: Treino de glúteos, dieta cetogênica, motivação matinal..."
                className="w-full bg-black border border-white/10 rounded-2xl p-6 outline-none focus:border-neon text-sm resize-none leading-relaxed"
              />
              <p className="text-[8px] text-zinc-600 font-bold uppercase">Separe os temas por vírgula. A IA irá alternar entre eles.</p>
            </div>

            <button 
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-white text-black font-black py-5 rounded-2xl text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="animate-spin" size={14} /> : <ShieldCheck size={14} />}
              {loading ? 'SALVANDO...' : 'SALVAR E SINCRONIZAR'}
            </button>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-500/5 border border-blue-500/20 p-8 rounded-[32px] flex items-start gap-6">
        <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl"><AlertCircle size={20} /></div>
        <div className="space-y-2">
          <h4 className="text-xs font-black uppercase tracking-widest text-blue-400 italic">Como funciona a publicação?</h4>
          <p className="text-[10px] text-zinc-500 font-medium leading-loose">
            Após salvar, as configurações são enviadas para o Supabase. No ambiente de produção, um <strong>Edge Function Cron</strong> despertará a cada período configurado, lerá seus pilares e gerará um post inédito usando Gemini 3 Pro, publicando-o automaticamente no blog.
          </p>
        </div>
      </div>

      {success && (
        <div className="fixed bottom-10 right-10 bg-green-600 text-white px-8 py-5 rounded-3xl font-black uppercase tracking-widest shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-10 z-[110]">
          <ShieldCheck /> Automação Consagrada!
        </div>
      )}
    </div>
  );
};

export default ManageAutomation;
