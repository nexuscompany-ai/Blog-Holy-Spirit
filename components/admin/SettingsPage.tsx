
import React, { useState, useEffect } from 'react';
// Removed Key and ShieldCheck imports as they are no longer used
import { Save, Building, Phone, Instagram, MapPin, Globe, CheckCircle2 } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [success, setSuccess] = useState(false);
  const [settings, setSettings] = useState({
    gymName: 'Holy Spirit Academia',
    phone: '(11) 99999-9999',
    instagram: '@holyspirit.gym',
    address: 'Av. das Nações, 1000 - São Paulo, SP',
    website: 'www.holyspiritgym.com.br'
  });

  useEffect(() => {
    const saved = localStorage.getItem('hs_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure we clean up any legacy apiKey from local storage state
      const { apiKey, ...rest } = parsed;
      setSettings(rest);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('hs_settings', JSON.stringify(settings));
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-10 pb-20">
      {/* Removed the API Key configuration section as per SDK guidelines */}
      <div className="bg-zinc-900/20 p-12 rounded-[40px] border border-white/5 space-y-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-[#cfec0f]/10 p-3 rounded-xl text-[#cfec0f]"><Building size={24} /></div>
          <div>
            <h2 className="text-2xl font-black uppercase italic">Identidade do Templo</h2>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Informações públicas e contatos</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Nome da Academia</label>
            <input value={settings.gymName} onChange={e => setSettings({...settings, gymName: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#cfec0f]" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Instagram @</label>
            <input value={settings.instagram} onChange={e => setSettings({...settings, instagram: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#cfec0f]" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">WhatsApp</label>
            <input value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#cfec0f]" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">URL Website</label>
            <input value={settings.website} onChange={e => setSettings({...settings, website: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#cfec0f]" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Localização Física</label>
          <input value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#cfec0f]" />
        </div>

        <div className="pt-6 border-t border-white/5 flex justify-end">
          <button onClick={handleSave} className="bg-[#cfec0f] text-black font-black px-12 py-5 rounded-2xl text-[10px] uppercase hover:scale-105 transition-all shadow-xl shadow-[#cfec0f]/20 flex items-center gap-3">
            <Save size={16} /> SALVAR CONFIGURAÇÕES
          </button>
        </div>
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
