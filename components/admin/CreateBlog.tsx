
import React, { useState, useRef } from 'react';
import { 
  Sparkles, Loader2, PenTool, Zap, BrainCircuit, Camera, 
  ShieldCheck, Globe, Search, ArrowRight, MessageSquare, CheckCircle
} from 'lucide-react';
import { aiService } from '../../services/ai.service';
import { dbService } from '../../db';

interface CreateBlogProps {
  onSuccess: () => void;
}

const CreateBlog: React.FC<CreateBlogProps> = ({ onSuccess }) => {
  const [activeMode, setActiveMode] = useState<'ia' | 'manual'>('ia');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState<'input' | 'editing'>('input');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [iaPrompt, setIaPrompt] = useState('');
  const [targetCategory, setTargetCategory] = useState('Musculação');
  
  const [articleData, setArticleData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Musculação',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
    publishedAt: new Date().toISOString().split('T')[0],
    published: true,
    source: 'manual',
    seo_keywords: [],
    meta_description: '',
    slug_suggestion: ''
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setArticleData(prev => ({ ...prev, image: reader.result as string }));
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const triggerN8nAutomation = async () => {
    if (!iaPrompt) return;
    setLoading(true);
    try {
      await aiService.generatePost(iaPrompt, {
        category: targetCategory
      });
      
      setSuccess(true);
      setIaPrompt('');
      
      setTimeout(() => {
        setSuccess(false);
        onSuccess();
      }, 4000);
    } catch (error: any) {
      alert("Aviso: " + error.message);
      setLoading(false);
    }
  };

  const publishArticleManual = async () => {
    if (!articleData.title) return;
    setLoading(true);
    try {
      await dbService.saveBlog(articleData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSuccess();
      }, 2000);
    } catch (error) {
      alert("Erro ao salvar artigo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex gap-4 mb-12 bg-zinc-900/40 p-2 rounded-3xl border border-white/5 w-fit">
        <button 
          onClick={() => { setActiveMode('ia'); setStep('input'); }}
          className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeMode === 'ia' ? 'bg-[#cfec0f] text-black' : 'text-gray-500 hover:text-white'}`}
        >
          <Sparkles size={14} /> Escritora n8n
        </button>
        <button 
          onClick={() => { setActiveMode('manual'); setStep('editing'); }}
          className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeMode === 'manual' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
        >
          <PenTool size={14} /> Manual
        </button>
      </div>

      {step === 'input' && activeMode === 'ia' && (
        <div className="grid lg:grid-cols-2 gap-12 animate-in fade-in duration-700">
          <div className="bg-zinc-900/10 p-12 rounded-[40px] border border-white/5 space-y-8">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-[#cfec0f]">Geração n8n Cloud</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-1">Categoria Alvo</label>
                <select 
                  value={targetCategory} 
                  onChange={e => setTargetCategory(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#cfec0f] text-sm"
                >
                  <option>Musculação</option>
                  <option>Nutrição</option>
                  <option>Espiritualidade</option>
                  <option>Lifestyle</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-1">Briefing do Conteúdo</label>
                <textarea
                  value={iaPrompt}
                  onChange={(e) => setIaPrompt(e.target.value)}
                  placeholder="Descreva o que deseja que o cérebro n8n gere..."
                  className="w-full bg-black border border-white/10 rounded-3xl p-8 outline-none focus:border-[#cfec0f] text-lg min-h-[200px] resize-none leading-relaxed transition-all"
                />
              </div>
            </div>

            <button
              onClick={triggerN8nAutomation}
              disabled={loading || !iaPrompt}
              className="w-full bg-[#cfec0f] text-black font-black py-6 rounded-2xl flex items-center justify-center gap-4 hover:scale-[1.02] shadow-xl disabled:opacity-30"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Zap size={18} />}
              {loading ? "ENVIANDO AO HUB n8n..." : "DISPARAR AUTOMAÇÃO"}
            </button>
          </div>

          <div className="flex flex-col justify-center gap-8 p-12 border border-dashed border-white/10 rounded-[40px] bg-zinc-900/5">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-neon/10 rounded-2xl flex items-center justify-center text-neon">
                <BrainCircuit size={32} />
              </div>
              <h3 className="text-white font-black uppercase text-sm italic">Como funciona o Hub Externo:</h3>
              <ul className="text-zinc-500 uppercase font-black text-[9px] tracking-widest space-y-4">
                <li className="flex items-start gap-3"><CheckCircle size={14} className="text-neon shrink-0" /> O site atua apenas como cliente.</li>
                <li className="flex items-start gap-3"><CheckCircle size={14} className="text-neon shrink-0" /> O n8n recebe o briefing e decide a estratégia.</li>
                <li className="flex items-start gap-3"><CheckCircle size={14} className="text-neon shrink-0" /> Geração de texto e SEO ocorre fora do site.</li>
                <li className="flex items-start gap-3"><CheckCircle size={14} className="text-neon shrink-0" /> O resultado é injetado diretamente no banco.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {step === 'editing' && (
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-4">Título Principal</label>
               <input 
                value={articleData.title} 
                onChange={e => setArticleData({...articleData, title: e.target.value})} 
                className="w-full bg-zinc-900/20 border border-white/5 rounded-2xl px-8 py-6 text-2xl font-black italic outline-none focus:border-[#cfec0f]"
              />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-4">Conteúdo do Blog</label>
               <textarea 
                value={articleData.content} 
                onChange={e => setArticleData({...articleData, content: e.target.value})} 
                className="w-full bg-zinc-900/20 border border-white/5 rounded-3xl p-10 text-base leading-loose min-h-[600px] outline-none focus:border-[#cfec0f] font-medium"
              />
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-zinc-900/20 p-8 rounded-[40px] border border-white/5 space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-1">Capa do Artigo</label>
                <div className="aspect-video bg-black border border-white/5 rounded-3xl overflow-hidden cursor-pointer group relative flex items-center justify-center" onClick={() => fileInputRef.current?.click()}>
                  {uploading ? <Loader2 className="animate-spin text-[#cfec0f]" /> : (
                    <img src={articleData.image} className="w-full h-full object-cover group-hover:opacity-40 transition-all" alt="Preview" />
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                </div>
              </div>

              <button 
                onClick={publishArticleManual}
                disabled={loading}
                className="w-full bg-[#cfec0f] text-black font-black py-5 rounded-2xl text-[10px] uppercase tracking-widest hover:scale-[1.02] shadow-xl disabled:opacity-30 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={14} /> : <ShieldCheck size={14} />}
                {loading ? "PUBLICANDO..." : "PUBLICAR NO TEMPLO"}
              </button>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="fixed bottom-12 right-12 bg-neon text-black px-10 py-6 rounded-3xl font-black uppercase tracking-widest shadow-2xl flex flex-col gap-2 animate-in slide-in-from-right-12 z-[100]">
          <div className="flex items-center gap-3">
             <ShieldCheck size={24} /> 
             <span>{activeMode === 'ia' ? 'Automação Iniciada!' : 'Conteúdo Santificado!'}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateBlog;
