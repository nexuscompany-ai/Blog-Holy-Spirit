
import React, { useState, useEffect } from 'react';
import { 
  Save, Building, CheckCircle2, ShieldCheck, 
  Database, RefreshCw, Activity, Lock, AlertCircle,
  Instagram, Settings as SettingsIcon, Zap, Loader2,
  Globe, Info, MessageSquare
} from 'lucide-react';
import { dbService, HolySettings } from '../../db';
import { aiService } from '../../services/ai.service';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'automation' | 'infra'>('general');
  const [success, setSuccess] = useState(false);
  const [dbStatus, setDbStatus] = useState<'loading' | 'online' | 'offline'>('loading');
  const [webhookTestStatus, setWebhookTestStatus] = useState<{ loading: boolean; status: 'idle' | 'success' | 'error'; message: string }>({
    loading: false,
    status: 'idle',
    message: ''
  });

  const [settings, setSettings] = useState<HolySettings>({
    gymName: '',
    phone: '',
    instagram: '',
    address: '',
    website: ''
  });

  useEffect(() => {
    dbService.getSettings().then(setSettings);
    setDbStatus('online');
  }, []);

  const testWebhook = async () => {
    setWebhookTestStatus({ loading: true, status: 'idle', message: '' });
    const result = await aiService.testIntegration();
    setWebhookTestStatus({
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
          onClick={() => setActiveTab('automation')}
          className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'automation' ? 'bg-[#cfec0f] text-black' : 'text-gray-500 hover:text-white'}`}
        >
          Hub n8n
        </button>
        <button 
          onClick={() => setActiveTab('infra')}
          className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'infra' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
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

      {activeTab === 'automation' && (
        <div className="bg-zinc-900/10 p-12 rounded-[40px] border border-white/5 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-neon/10 p-3 rounded-xl text-neon"><Zap size={24} /></div>
              <div>
                <h2 className="text-2xl font-black uppercase italic">Conexão Cloud Hub (n8n)</h2>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">A inteligência reside exclusivamente no n8n</p>
              </div>
            </div>
            <button 
              onClick={testWebhook}
              disabled={webhookTestStatus.loading}
              className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border ${
                webhookTestStatus.status === 'success' ? 'bg-green-500/10 border-green-500 text-green-500' : 
                webhookTestStatus.status === 'error' ? 'bg-red-500/10 border-red-500 text-red-500' :
                'bg-white/5 border-white/10 text-white hover:bg-white/10'
              }`}
            >
              {webhookTestStatus.loading ? <Loader2 className="animate-spin" size={14} /> : <Activity size={14} />}
              {webhookTestStatus.loading ? 'Sincronizando...' : 'Testar Conexão Cloud'}
            </button>
          </div>

          <div className="p-10 bg-black/40 rounded-[32px] border border-white/5 space-y-6">
             <div className="flex items-center gap-3 text-neon font-black uppercase text-[10px] tracking-[0.2em]">
               <Info size={16} /> Arquitetura Produção
             </div>
             <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl">
               Este site não possui lógica inteligente local. Todas as decisões de conteúdo são processadas pelo Hub Externo.
               <code className="block mt-4 p-4 bg-black rounded-xl border border-white/10 text-neon font-mono text-[10px] break-all">
                 Endpoint: https://felipealmeida0777.app.n8n.cloud/webhook/blog-generator
               </code>
             </p>
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
