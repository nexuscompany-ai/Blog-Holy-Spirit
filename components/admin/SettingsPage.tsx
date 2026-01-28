
import React, { useState, useEffect } from 'react';
import { Save, Building, CheckCircle2, Trash2 } from 'lucide-react';
import { dbService, HolySettings } from '../../db';

const SettingsPage: React.FC = () => {
  const [success, setSuccess] = useState(false);
  const [settings, setSettings] = useState<HolySettings>({
    gymName: '',
    phone: '',
    instagram: '',
    address: '',
    website: ''
  });

  useEffect(() => {
    const loadSettings = async () => {
      const current = await dbService.getSettings();
      setSettings(current);
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    await dbService.saveSettings(settings);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const clearCache = () => {
    if (confirm('Deseja realmente limpar todos os dados locais (Posts e Eventos)?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl space-y-10 pb-20">
      <div className="bg-zinc-900/20 p-12 rounded-[40px] border border-white/5 space-y-10 shadow-2xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-[#cfec0f]/10 p-3 rounded-xl text-[#cfec0f]"><Building size={24} /></div>
          <div>
            <h2 className="text-2xl font-black uppercase italic">Identidade do Templo</h2>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Configuração do Banco de Dados Local</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Nome da Academia</label>
            <input 
              value={settings.gymName} 
              onChange={e => setSettings({...settings, gymName: e.target.value})} 
              className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#cfec0f] text-white" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Instagram @</label>
            <input 
              value={settings.instagram} 
              onChange={e => setSettings({...settings, instagram: e.target.value})} 
              className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#cfec0f] text-white" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">WhatsApp (com DDD)</label>
            <input 
              value={settings.phone} 
              onChange={e => setSettings({...settings, phone: e.target.value})} 
              className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#cfec0f] text-white" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">URL Website</label>
            <input 
              value={settings.website} 
              onChange={e => setSettings({...settings, website: e.target.value})} 
              className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#cfec0f] text-white" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Localização Física</label>
          <input 
            value={settings.address} 
            onChange={e => setSettings({...settings, address: e.target.value})} 
            className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#cfec0f] text-white" 
          />
        </div>

        <div className="pt-6 border-t border-white/5 flex justify-between items-center">
          <button 
            onClick={clearCache} 
            className="text-red-500/50 hover:text-red-500 text-[9px] font-black uppercase flex items-center gap-2 transition-all"
          >
            <Trash2 size={14} /> Resetar Banco de Dados
          </button>
          <button 
            onClick={handleSave} 
            className="bg-[#cfec0f] text-black font-black px-12 py-5 rounded-2xl text-[10px] uppercase hover:scale-105 transition-all shadow-xl shadow-[#cfec0f]/20 flex items-center gap-3"
          >
            <Save size={16} /> SALVAR CONFIGURAÇÕES
          </button>
        </div>
      </div>

      <div className="bg-blue-500/5 border border-blue-500/10 p-10 rounded-[40px] space-y-4">
        <h3 className="text-blue-500 font-black uppercase italic tracking-widest text-sm">Escalabilidade</h3>
        <p className="text-gray-500 text-xs leading-relaxed">
          Atualmente as informações estão sendo gravadas no seu <strong>LocalStorage</strong>. Se você desejar expandir para um banco de dados em nuvem (como Supabase), eu só precisaria atualizar o arquivo <code>db.ts</code> para conectar os mesmos métodos à sua nova API.
        </p>
      </div>

      {success && (
        <div className="fixed bottom-10 right-10 bg-green-600 text-white px-8 py-5 rounded-3xl font-black uppercase tracking-widest shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-10 z-[110]">
          <CheckCircle2 /> Configurações Atualizadas!
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
