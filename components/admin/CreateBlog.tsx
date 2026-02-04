
import React, { useState, useRef } from 'react';
import { 
  Sparkles, Loader2, PenTool, Zap, BrainCircuit, Camera, 
  ShieldCheck, Globe, Search, ArrowRight, MessageSquare
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
      setTimeout(() => {
        setSuccess(false);
        onSuccess(); // Volta para a lista de posts para ver o novo post chegar
      }, 3000);
    } catch (error: any) {
      alert(error.message);
    } finally {
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
          <Sparkles size={14} /> Automação n8n
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
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-[#cfec0f]">Gerar com IA</h2>
            
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
                <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-1">Tema do Artigo</label>
                <textarea
                  value={iaPrompt}
                  onChange={(e) => setIaPrompt(e.target.value)}
                  placeholder="Ex: Guia definitivo para treinar costas..."
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
              {loading ? "ENVIANDO PARA O n8n..." : "LANÇAR AUTOMAÇÃO"}
            </button>
          </div>

          <div className="flex flex-col justify-center gap-8 p-12 border border-dashed border-white/10 rounded-[40px] bg-zinc-900/5">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
                <Globe size={32} />
              </div>
              <h3 className="text-white font-black uppercase text-sm italic">Fluxo Externo Ativado</h3>
              <p className="text-zinc-500 uppercase font-black text-[9px] tracking-widest leading-loose">
                Ao clicar em "Lançar Automação", sua requisição é enviada para o n8n. 
                Lá, o conteúdo é gerado, o SEO é otimizado e o post é salvo diretamente no Supabase.
              </p>
            </div>
            
            <div className="space-y-4 pt-8 border-t border-white/5">
              <div className="flex items-center gap-3 text-green-400 text-[9px] font-black uppercase">
                <ShieldCheck size={14} /> Conexão Segura
              </div>
              <p className="text-zinc-600 text-[9px] font-black uppercase">
                Status: Sincronizado com n8n Cloud
              </p>
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

              <div className="space-y-4">
                <select value={articleData.category} onChange={e => setArticleData({...articleData, category: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs outline-none focus:border-neon">
                  <option>Musculação</option>
                  <option>Nutrição</option>
                  <option>Espiritualidade</option>
                  <option>Lifestyle</option>
                </select>
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
        <div className="fixed bottom-12 right-12 bg-green-600 text-white px-10 py-6 rounded-3xl font-black uppercase tracking-widest shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-12 z-[100]">
          <ShieldCheck size={24} /> {activeMode === 'ia' ? 'Automação Iniciada!' : 'Conteúdo Santificado!'}
        </div>
      )}
    </div>
  );
};

export default CreateBlog;
