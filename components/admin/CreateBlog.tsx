
import React, { useState, useRef } from 'react';
import { 
  Sparkles, Loader2, PenTool, Zap, BrainCircuit, 
  ShieldCheck, CheckCircle, AlertCircle, RefreshCw, 
  Terminal, FileText, CheckCircle2, Eye, Send, Trash2, ArrowLeft
} from 'lucide-react';
import { aiService } from '../../services/ai.service';
import { dbService } from '../../db';

interface CreateBlogProps {
  onSuccess: () => void;
}

const CreateBlog: React.FC<CreateBlogProps> = ({ onSuccess }) => {
  const [activeMode, setActiveMode] = useState<'ia' | 'manual'>('ia');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // States da IA
  const [iaPrompt, setIaPrompt] = useState('');
  const [targetCategory, setTargetCategory] = useState('Musculação');
  const [previewPost, setPreviewPost] = useState<any>(null);
  
  // States Manuais
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [articleData, setArticleData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Musculação',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
    publishedAt: new Date().toISOString().split('T')[0],
    published: true,
    source: 'manual'
  });

  const handleGetPreview = async () => {
    if (!iaPrompt) return;
    setLoading(true);
    setErrorMsg('');
    setPreviewPost(null);
    
    try {
      const result = await aiService.getPreview(iaPrompt, targetCategory);
      if (result.post) {
        setPreviewPost(result.post);
      } else {
        throw new Error("O n8n não retornou o objeto 'post' esperado no modo Preview.");
      }
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPublish = async () => {
    if (!previewPost) return;
    setLoading(true);
    setErrorMsg('');
    
    try {
      const result = await aiService.publishPost(previewPost, targetCategory);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onSuccess();
        }, 3000);
      } else {
        throw new Error(result.error || "Falha ao publicar via n8n.");
      }
    } catch (error: any) {
      setErrorMsg(error.message);
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
      setErrorMsg("Erro ao salvar artigo manualmente.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex gap-4 mb-12 bg-zinc-900/40 p-2 rounded-3xl border border-white/5 w-fit">
        <button 
          onClick={() => { setActiveMode('ia'); setErrorMsg(''); setPreviewPost(null); }}
          className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeMode === 'ia' ? 'bg-[#cfec0f] text-black shadow-lg shadow-[#cfec0f]/20' : 'text-gray-500 hover:text-white'}`}
        >
          <Sparkles size={14} /> Escritora n8n
        </button>
        <button 
          onClick={() => { setActiveMode('manual'); setErrorMsg(''); }}
          className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeMode === 'manual' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
        >
          <PenTool size={14} /> Manual
        </button>
      </div>

      {activeMode === 'ia' ? (
        <div className="grid lg:grid-cols-2 gap-12 animate-in fade-in duration-700">
          {/* PAINEL DE COMANDO */}
          <div className="bg-zinc-900/10 p-12 rounded-[40px] border border-white/5 space-y-8 relative overflow-hidden h-fit">
            <div className="flex justify-between items-center relative z-10">
               <h2 className="text-4xl font-black uppercase italic tracking-tighter text-[#cfec0f]">
                {previewPost ? "Revisão Final" : "Gerador Cloud"}
               </h2>
               <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
                 <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${previewPost ? 'bg-orange-500' : 'bg-green-500'}`} />
                 <span className="text-[8px] font-black uppercase text-zinc-500 tracking-widest">
                  {previewPost ? 'Aguardando Confirmação' : 'n8n Pipeline'}
                 </span>
               </div>
            </div>
            
            {!previewPost ? (
              <div className="space-y-4 relative z-10">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-1">Categoria</label>
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
                  <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-1">Briefing do Post</label>
                  <textarea
                    value={iaPrompt}
                    onChange={(e) => setIaPrompt(e.target.value)}
                    disabled={loading}
                    placeholder="O que a IA deve escrever? Defina o tema..."
                    className="w-full bg-black border border-white/10 rounded-3xl p-8 outline-none focus:border-[#cfec0f] text-lg min-h-[220px] resize-none leading-relaxed transition-all disabled:opacity-50"
                  />
                </div>

                <button
                  onClick={handleGetPreview}
                  disabled={loading || !iaPrompt}
                  className="w-full bg-[#cfec0f] text-black font-black py-6 rounded-2xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#cfec0f]/20 disabled:opacity-30"
                >
                  {loading ? <RefreshCw className="animate-spin" size={20} /> : <Zap size={20} />}
                  {loading ? "GERANDO PREVIEW..." : "OBTER PREVIEW"}
                </button>
              </div>
            ) : (
              <div className="space-y-6 relative z-10">
                <div className="p-6 bg-black/40 rounded-3xl border border-white/5 space-y-4">
                  <div className="flex items-center gap-2 text-[#cfec0f]">
                    <ShieldCheck size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Controle de Qualidade</span>
                  </div>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    O post foi gerado com sucesso. Revise o conteúdo ao lado. Caso esteja correto, clique em publicar para salvar permanentemente no Supabase.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleConfirmPublish}
                    disabled={loading}
                    className="w-full bg-green-500 text-black font-black py-6 rounded-2xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-green-500/20"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                    CONFIRMAR PUBLICAÇÃO
                  </button>
                  
                  <button
                    onClick={() => setPreviewPost(null)}
                    className="w-full bg-zinc-800 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-4 hover:bg-zinc-700 transition-all text-[10px] uppercase tracking-widest"
                  >
                    <ArrowLeft size={16} /> REFAZER BRIEFING
                  </button>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex flex-col gap-2 animate-in shake relative z-10">
                <div className="flex items-center gap-3 text-red-500">
                  <AlertCircle size={16} />
                  <p className="text-[10px] font-black uppercase tracking-widest">Erro no Backend n8n</p>
                </div>
                <p className="text-zinc-500 text-[10px] leading-relaxed font-medium pl-7">{errorMsg}</p>
              </div>
            )}
          </div>

          {/* ÁREA DE VISUALIZAÇÃO (PREVIEW) */}
          <div className="bg-zinc-900/5 border border-dashed border-white/10 rounded-[40px] p-10 overflow-y-auto max-h-[80vh] custom-scrollbar">
            {previewPost ? (
              <div className="animate-in fade-in slide-in-from-right-10 duration-700">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-neon/10 text-neon rounded-xl"><Eye size={20} /></div>
                  <h3 className="text-xl font-black italic uppercase text-white">Preview do Artigo</h3>
                </div>

                <div className="space-y-10">
                  <div className="space-y-2">
                    <span className="text-[9px] font-black text-neon uppercase tracking-widest">Título Gerado</span>
                    <h1 className="text-4xl font-black italic leading-tight text-white">{previewPost.title}</h1>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Resumo (Excerpt)</span>
                    <p className="text-zinc-400 italic font-medium leading-relaxed">{previewPost.excerpt}</p>
                  </div>

                  <div className="space-y-4">
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">HTML Final</span>
                    <div className="p-8 bg-black rounded-3xl border border-white/5 prose prose-invert prose-sm max-w-none text-zinc-400 leading-relaxed font-medium">
                       <div dangerouslySetInnerHTML={{ __html: previewPost.content }} />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-8 p-10">
                <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center text-zinc-800">
                  <FileText size={40} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-white font-black uppercase italic text-sm">Aguardando Orquestração</h3>
                  <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest max-w-[240px]">
                    Assim que você disparar o n8n, o preview do artigo aparecerá aqui para sua revisão final.
                  </p>
                </div>
                {loading && (
                   <div className="flex flex-col items-center gap-4 animate-in fade-in">
                     <div className="w-10 h-10 border-2 border-neon border-t-transparent rounded-full animate-spin" />
                     <p className="text-neon text-[8px] font-black uppercase tracking-[0.3em]">IA no Templo...</p>
                   </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-10 animate-in fade-in duration-700">
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
               <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-4">Conteúdo</label>
               <textarea 
                value={articleData.content} 
                onChange={e => setArticleData({...articleData, content: e.target.value})} 
                className="w-full bg-zinc-900/20 border border-white/5 rounded-3xl p-10 text-base leading-loose min-h-[500px] outline-none focus:border-[#cfec0f]"
              />
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-zinc-900/20 p-8 rounded-[40px] border border-white/5 space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-1">Imagem de Capa</label>
                <div 
                  className="aspect-video bg-black border border-white/10 rounded-3xl overflow-hidden cursor-pointer flex items-center justify-center relative group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploading ? <Loader2 className="animate-spin text-neon" /> : (
                    <img src={articleData.image} className="w-full h-full object-cover group-hover:opacity-40 transition-all" alt="Preview" />
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                </div>
              </div>

              <button 
                onClick={publishArticleManual}
                disabled={loading}
                className="w-full bg-white text-black font-black py-5 rounded-2xl text-[10px] uppercase tracking-widest hover:scale-[1.02] shadow-xl disabled:opacity-30"
              >
                {loading ? "PROCESSANDO..." : "PUBLICAR MANUALMENTE"}
              </button>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="fixed bottom-12 right-12 bg-[#cfec0f] text-black px-10 py-6 rounded-3xl font-black uppercase tracking-widest shadow-2xl flex flex-col gap-1 animate-in slide-in-from-right-12 z-[100]">
          <div className="flex items-center gap-3">
            <ShieldCheck size={24} /> 
            <span className="text-sm">Consagração Completa!</span>
          </div>
          <p className="text-[8px] font-bold text-black/60 uppercase tracking-widest">O post está ao vivo no Templo.</p>
        </div>
      )}
    </div>
  );
};

export default CreateBlog;
