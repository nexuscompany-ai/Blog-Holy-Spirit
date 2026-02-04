
import React, { useState, useEffect } from 'react';
import { 
  Save, Building, CheckCircle2, ShieldCheck, 
  Database, RefreshCw, Activity, Lock, AlertCircle,
  Instagram, Settings as SettingsIcon, BrainCircuit, Zap, Loader2,
  Globe, Info
} from 'lucide-react';
import { dbService, HolySettings } from '../../db';
import { aiService } from '../../services/ai.service';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'ai' | 'infra'>('general');
  const [success, setSuccess] = useState(false);
  const [dbStatus, setDbStatus] = useState<'loading' | 'online' | 'offline'>('loading');
  const [aiTestStatus, setAiTestStatus] = useState<{ loading: boolean; status: 'idle' | 'success' | 'error'; message: string }>({
    loading: false,
    status: 'idle',
    message: ''
  });

  const [settings, setSettings] = useState<HolySettings>({
    gymName: '',
    phone: '',
    instagram: '',
    address: '',
    website: '',
    aiConfig: {
      provider: 'gemini',
      model: 'gemini-3-flash-preview',
      temperature: 0.7,
      baseUrl: ''
    }
  });

  useEffect(() => {
    dbService.getSettings().then(setSettings);
    setDbStatus('online');
  }, []);

  const testAI = async () => {
    setAiTestStatus({ loading: true, status: 'idle', message: '' });
    const result = await aiService.testIntegration();
    setAiTestStatus({
      loading: false,
      status: result.success ? 'success' : 'error',
      message: result.message
    });
  };

  const handleSave = async () => {
    await dbService.saveSettings(settings);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-6xl space-y-10 pb-20">
      <div className="flex gap-4 p-1 bg-zinc-900/50 rounded-2xl w-fit border border-white/5">
        <button 
          onClick={() => setActiveTab('general')}
          className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'general' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
        >
          Geral
        </button>
        <button 
          onClick={() => setActiveTab('ai')}
          className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'ai' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
        >
          IA & Provedores
        </button>
        <button 
          onClick={() => setActiveTab('infra')}
          className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'infra' ? 'bg-[#cfec0f] text-black' : 'text-gray-500 hover:text-white'}`}
        >
          Infraestrutura
        </button>
      </div>

      {activeTab === 'general' && (
        <div className="bg-zinc-900/10 p-12 rounded-[40px] border border-white/5 space-y-10 animate-in fade-in slide-in-from-left-4 duration-500">
          <div className="flex items-center gap-4">
            <div className="bg-white/5 p-3 rounded-xl text-white"><Building size={24} /></div>
            <div>
              <h2 className="text-2xl font-black uppercase italic">Perfil do Templo</h2>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Identidade Holy Spirit</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Nome Comercial</label>
              <input value={settings.gymName} onChange={e => setSettings({...settings, gymName: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-white transition-all text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">URL Instagram</label>
              <div className="relative">
                <Instagram className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <input value={settings.instagram} onChange={e => setSettings({...settings, instagram: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl pl-14 pr-6 py-4 outline-none focus:border-white transition-all text-sm" />
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 flex justify-end">
            <button onClick={handleSave} className="bg-white text-black font-black px-12 py-5 rounded-2xl text-[10px] uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-3">
              <Save size={16} /> Atualizar Templo
            </button>
          </div>
        </div>
      )}

      {activeTab === 'ai' && (
        <div className="bg-zinc-900/10 p-12 rounded-[40px] border border-white/5 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-neon/10 p-3 rounded-xl text-neon"><BrainCircuit size={24} /></div>
              <div>
                <h2 className="text-2xl font-black uppercase italic">Motor de Inteligência</h2>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Escolha seu Provedor de Elite</p>
              </div>
            </div>
            <button 
              onClick={testAI}
              disabled={aiTestStatus.loading}
              className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border ${
                aiTestStatus.status === 'success' ? 'bg-green-500/10 border-green-500 text-green-500' : 
                aiTestStatus.status === 'error' ? 'bg-red-500/10 border-red-500 text-red-500' :
                'bg-white/5 border-white/10 text-white hover:bg-white/10'
              }`}
            >
              {aiTestStatus.loading ? <Loader2 className="animate-spin" size={14} /> : <Zap size={14} />}
              {aiTestStatus.loading ? 'Testando...' : 'Testar Conexão'}
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Provedor</label>
              <select 
                value={settings.aiConfig?.provider} 
                onChange={e => setSettings({...settings, aiConfig: { ...settings.aiConfig!, provider: e.target.value as any }})}
                className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-neon text-sm"
              >
                <option value="gemini">Google Gemini (Gratuito/Billing)</option>
                <option value="openai">OpenAI (ChatGPT/sk- key)</option>
                <option value="custom">Provedor Customizado (DeepSeek, etc)</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Modelo</label>
              <input 
                value={settings.aiConfig?.model}
                onChange={e => setSettings({...settings, aiConfig: { ...settings.aiConfig!, model: e.target.value }})}
                placeholder={settings.aiConfig?.provider === 'gemini' ? 'gemini-3-flash-preview' : 'gpt-3.5-turbo'}
                className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-neon text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Criatividade ({settings.aiConfig?.temperature})</label>
              <input 
                type="range" min="0" max="1" step="0.1" 
                value={settings.aiConfig?.temperature}
                onChange={e => setSettings({...settings, aiConfig: { ...settings.aiConfig!, temperature: parseFloat(e.target.value) }})}
                className="w-full h-12 bg-black/40 accent-neon"
              />
            </div>
          </div>

          {settings.aiConfig?.provider !== 'gemini' && (
             <div className="space-y-2 animate-in slide-in-from-top-2">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Base URL (Opcional)</label>
                <div className="relative">
                  <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
                  <input 
                    value={settings.aiConfig?.baseUrl}
                    onChange={e => setSettings({...settings, aiConfig: { ...settings.aiConfig!, baseUrl: e.target.value }})}
                    placeholder="https://api.openai.com/v1/chat/completions"
                    className="w-full bg-black border border-white/10 rounded-2xl pl-14 pr-6 py-4 outline-none focus:border-neon text-sm placeholder:text-zinc-800"
                  />
                </div>
             </div>
          )}

          <div className="p-8 bg-black/40 rounded-3xl border border-white/5 flex items-start gap-4">
             <Info className="text-zinc-500 shrink-0" size={18} />
             <p className="text-[10px] text-zinc-600 font-bold uppercase leading-relaxed">
               O sistema detecta automaticamente o provedor com base na chave no arquivo .env. 
               Se sua chave começa com <span className="text-neon">sk-</span>, usaremos o protocolo OpenAI. 
               Se começa com <span className="text-neon">AIza</span>, usaremos o SDK nativo do Google.
             </p>
          </div>

          <div className="pt-8 border-t border-white/5 flex justify-end">
            <button onClick={handleSave} className="bg-neon text-black font-black px-12 py-5 rounded-2xl text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-neon/20">
              <Save size={16} /> Consagrar Provedor
            </button>
          </div>
        </div>
      )}

      {activeTab === 'infra' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className={`p-10 rounded-[40px] border ${dbStatus === 'online' ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
            <div className="flex items-center gap-6">
              <div className="p-4 bg-black rounded-2xl text-green-400"><Database size={32} /></div>
              <div>
                <h3 className="text-xl font-black uppercase italic">Banco de Dados Sincronizado</h3>
                <p className="text-[10px] text-gray-500 uppercase font-black">Supabase Global Ativo</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="fixed bottom-10 right-10 bg-neon text-black px-8 py-5 rounded-3xl font-black uppercase tracking-widest shadow-2xl animate-in slide-in-from-right-10">
          Configurações Consagradas!
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
