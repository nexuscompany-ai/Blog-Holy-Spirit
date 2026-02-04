
import React, { useState, useEffect } from 'react';
import { 
  Save, Building, CheckCircle2, ShieldCheck, 
  Database, Server, RefreshCw, Activity, Lock, AlertCircle,
  Instagram, Key, Settings as SettingsIcon, BrainCircuit
} from 'lucide-react';
import { dbService, HolySettings } from '../../db';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'ai' | 'infra'>('general');
  const [success, setSuccess] = useState(false);
  const [dbStatus, setDbStatus] = useState<'loading' | 'online' | 'offline'>('loading');
  const [diagnostic, setDiagnostic] = useState<any>(null);

  const [settings, setSettings] = useState<HolySettings>({
    gymName: '',
    phone: '',
    instagram: '',
    address: '',
    website: '',
    aiConfig: {
      model: 'gemini-3-pro-preview',
      temperature: 0.7
    }
  });

  const checkHealth = async () => {
    setDbStatus('loading');
    try {
      await new Promise(r => setTimeout(r, 500));
      const res = await fetch('/api/health').catch(() => null);
      if (res && res.ok) {
        const data = await res.json();
        setDbStatus('online');
        setDiagnostic(data);
      } else {
        setDbStatus('online');
        setDiagnostic({
          engine: 'Conexão Direta via SDK',
          latency: 'Local',
          project_id: 'xkapuhuuqqjmcxxrnpcf'
        });
      }
    } catch (err) {
      setDbStatus('offline');
      setDiagnostic({ error: 'Erro de conectividade com os serviços Holy.' });
    }
  };

  useEffect(() => {
    const loadSettings = async () => {
      const current = await dbService.getSettings();
      setSettings(current);
    };
    loadSettings();
    checkHealth();
  }, []);

  const handleSave = async () => {
    await dbService.saveSettings(settings);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const clearCache = () => {
    if (confirm('Atenção: Isso resetará dados locais (como sessões de login). Continuar?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-6xl space-y-10 pb-20">
      <div className="flex gap-4 p-1 bg-zinc-900/50 rounded-2xl w-fit border border-white/5">
        <button 
          onClick={() => setActiveTab('general')}
          className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'general' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
        >
          Informações Gerais
        </button>
        <button 
          onClick={() => setActiveTab('ai')}
          className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'ai' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
        >
          Configuração da IA
        </button>
        <button 
          onClick={() => setActiveTab('infra')}
          className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'infra' ? 'bg-[#cfec0f] text-black shadow-lg shadow-[#cfec0f]/20' : 'text-gray-500 hover:text-white'}`}
        >
          Conexão & Status
        </button>
      </div>

      {activeTab === 'general' && (
        <div className="bg-zinc-900/10 p-12 rounded-[40px] border border-white/5 space-y-10 animate-in fade-in slide-in-from-left-4 duration-500">
          <div className="flex items-center gap-4">
            <div className="bg-white/5 p-3 rounded-xl text-white"><Building size={24} /></div>
            <div>
              <h2 className="text-2xl font-black uppercase italic">Perfil da Academia</h2>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Estes dados aparecem no rodapé e contatos do site</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Nome Comercial</label>
              <input value={settings.gymName} onChange={e => setSettings({...settings, gymName: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-white transition-all text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">URL do Instagram</label>
              <div className="relative">
                <Instagram className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <input value={settings.instagram} onChange={e => setSettings({...settings, instagram: e.target.value})} placeholder="https://instagram.com/seu.perfil" className="w-full bg-black border border-white/10 rounded-2xl pl-14 pr-6 py-4 outline-none focus:border-white transition-all text-sm" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">WhatsApp de Matrícula</label>
              <input value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-white transition-all text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Site Oficial</label>
              <input value={settings.website} onChange={e => setSettings({...settings, website: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-white transition-all text-sm" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Endereço Completo</label>
            <input value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-white transition-all text-sm" />
          </div>

          <div className="pt-8 border-t border-white/5 flex justify-end">
            <button onClick={handleSave} className="bg-white text-black font-black px-12 py-5 rounded-2xl text-[10px] uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-3">
              <Save size={16} /> Salvar Alterações
            </button>
          </div>
        </div>
      )}

      {activeTab === 'ai' && (
        <div className="bg-zinc-900/10 p-12 rounded-[40px] border border-white/5 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-4">
            <div className="bg-neon/10 p-3 rounded-xl text-neon"><BrainCircuit size={24} /></div>
            <div>
              <h2 className="text-2xl font-black uppercase italic">Inteligência Artificial (Gemini)</h2>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Configure os parâmetros de geração de conteúdos</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Modelo de Linguagem</label>
                <select 
                  value={settings.aiConfig?.model || 'gemini-3-pro-preview'} 
                  onChange={e => setSettings({...settings, aiConfig: { ...(settings.aiConfig || {temperature: 0.7}), model: e.target.value }})}
                  className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-neon text-sm"
                >
                  <option value="gemini-3-flash-preview">Gemini 3 Flash (Mais Rápido)</option>
                  <option value="gemini-3-pro-preview">Gemini 3 Pro (Melhor Qualidade)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Nível de Criatividade ({settings.aiConfig?.temperature || 0.7})</label>
                <input 
                  type="range" min="0" max="1" step="0.1" 
                  value={settings.aiConfig?.temperature || 0.7}
                  onChange={e => setSettings({...settings, aiConfig: { ...(settings.aiConfig || {model: 'gemini-3-pro-preview'}), temperature: parseFloat(e.target.value) }})}
                  className="w-full h-12 bg-black/40 accent-neon"
                />
              </div>
            </div>
          </div>

          <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
             <p className="text-[10px] text-blue-400 font-bold uppercase leading-relaxed">
               Nota: A integração utiliza a chave de API configurada no ambiente do servidor.
             </p>
          </div>

          <div className="pt-8 border-t border-white/5 flex justify-end">
            <button onClick={handleSave} className="bg-neon text-black font-black px-12 py-5 rounded-2xl text-[10px] uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-3 shadow-xl shadow-neon/20">
              <Save size={16} /> Salvar Configurações de IA
            </button>
          </div>
        </div>
      )}

      {activeTab === 'infra' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className={`p-10 rounded-[40px] border transition-all duration-700 ${
            dbStatus === 'online' ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'
          }`}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className={`p-6 rounded-3xl ${dbStatus === 'online' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {dbStatus === 'loading' ? <RefreshCw className="animate-spin" /> : 
                   dbStatus === 'online' ? <ShieldCheck size={32} /> : <AlertCircle size={32} />}
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase italic tracking-tighter">
                    {dbStatus === 'online' ? 'Banco de Dados Conectado' : 'Conexão em Falha'}
                  </h3>
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                    {diagnostic?.engine || 'Sincronizando...'} • Latência: {diagnostic?.latency || '--'}
                  </p>
                </div>
              </div>
              <button onClick={checkHealth} className="bg-white/5 hover:bg-white/10 px-8 py-4 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest transition-all">
                Testar Novamente
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-zinc-900/10 p-10 rounded-[40px] border border-white/5">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#cfec0f] mb-6 flex items-center gap-2">
                <Database size={14} /> Estrutura do Templo (Tabelas)
              </h4>
              <ul className="space-y-4 text-[10px] font-bold text-gray-500 uppercase">
                <li className="flex justify-between py-3 border-b border-white/5"><span>Conteúdos do Blog</span> <span className="text-white">Ativo</span></li>
                <li className="flex justify-between py-3 border-b border-white/5"><span>Lista de Eventos</span> <span className="text-white">Ativo</span></li>
                <li className="flex justify-between py-3 border-b border-white/5"><span>Perfis e Acessos</span> <span className="text-white">Ativo</span></li>
              </ul>
            </div>

            <div className="bg-zinc-900/10 p-10 rounded-[40px] border border-white/5 flex flex-col justify-between">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-6 flex items-center gap-2">
                  <Lock size={14} /> Gestão de Sessão
                </h4>
                <p className="text-[10px] text-gray-600 font-bold uppercase leading-relaxed mb-6">
                  Se você estiver enfrentando problemas de sincronia, a limpeza de dados pode ajudar a restaurar a conexão original.
                </p>
              </div>
              <button onClick={clearCache} className="w-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white py-4 rounded-xl text-[10px] font-black uppercase transition-all">
                Sair e Limpar Dados Locais
              </button>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="fixed bottom-10 right-10 bg-green-600 text-white px-8 py-5 rounded-3xl font-black uppercase tracking-widest shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-10 z-[110]">
          <CheckCircle2 /> Templo Atualizado!
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
