
import React, { useState, useRef } from 'react';
import { 
  Sparkles, Loader2, PenTool, Zap, BrainCircuit, 
  ShieldCheck, AlertCircle, RefreshCw, 
  FileText, Send, ArrowLeft, Eye
} from 'lucide-react';
import { aiService } from '../../services/ai.service';
import { dbService } from '../../db';

interface CreateBlogProps {
  onSuccess: () => void;
}

const CreateBlog: React.FC<CreateBlogProps> = ({ onSuccess }) => {
  const [activeMode, setActiveMode] = useState<'ia' | 'manual'>('ia');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // States da IA
  const [iaPrompt, setIaPrompt] = useState('');
  const [targetCategory, setTargetCategory] = useState('Musculação');
  const [previewPost, setPreviewPost] = useState<any>(null);
  
  // States Manuais
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [articleData, setArticleData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category_id: null, // UUID ou null
    image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
  });

  const handleGetPreview = async () => {
    if (!iaPrompt) return;
    setLoading(true);
    setErrorMsg('');
    setPreviewPost(null);
    
    try {
      const result = await aiService.getPreview(iaPrompt, targetCategory);
      if (result.post) {
        setPreviewPost({
          title: result.post.title,
          content: result.post.content,
          excerpt: result.post.excerpt,
          category_id: null, // IA não sabe o UUID das categorias locais
          image_url: '',
          published_at: null
        });
      } else {
        throw new Error("Resposta da IA inválida.");
      }
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSaveIA = async () => {
    if (!previewPost) return;
    setLoading(true);
    try {
      await dbService.saveBlog(previewPost);
      onSuccess();
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  const publishArticleManual = async (publish: boolean) => {
    if (!articleData.title) {
      setErrorMsg("O título é obrigatório.");
      return;
    }
    setLoading(true);
    try {
      await dbService.saveBlog({ 
        ...articleData, 
        published_at: publish ? new Date().toISOString() : null 
      });
      onSuccess();
    } catch (error) {
      setErrorMsg("Erro ao salvar artigo.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setArticleData(prev => ({ ...prev, image_url: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex gap-4 mb-12 bg-zinc-900/40 p-2 rounded-3xl border border-white/5 w-fit">
        <button 
          onClick={() => { setActiveMode('ia'); setErrorMsg(''); setPreviewPost(null); }}
          className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeMode === 'ia' ? 'bg-[#cfec0f] text-black' : 'text-gray-500 hover:text-white'}`}
        >
          <Sparkles size={14} /> Escritora IA (n8n)
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
          <div className="bg-zinc-900/10 p-12 rounded-[40px] border border-white/5 space-y-8 h-fit">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-[#cfec0f]">
              {previewPost ? "Revelação Pronta" : "Orquestrar IA"}
            </h2>
            
            {!previewPost ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Contexto</label>
                  <select 
                    value={targetCategory} 
                    onChange={e => setTargetCategory(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#cfec0f] text-sm"
                  >
                    <option>Musculação</option>
                    <option>Nutrição</option>
                    <option>Espiritualidade</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Tema</label>
                  <textarea
                    value={iaPrompt}
                    onChange={(e) => setIaPrompt(e.target.value)}
                    disabled={loading}
                    placeholder="Ex: Como manter a disciplina..."
                    className="w-full bg-black border border-white/10 rounded-3xl p-8 outline-none focus:border-[#cfec0f] text-lg min-h-[200px] resize-none leading-relaxed transition-all"
                  />
                </div>

                <button
                  onClick={handleGetPreview}
                  disabled={loading || !iaPrompt}
                  className="w-full bg-[#cfec0f] text-black font-black py-6 rounded-2xl flex items-center justify-center gap-4 hover:scale-[1.02] shadow-xl shadow-[#cfec0f]/20"
                >
                  {loading ? <RefreshCw className="animate-spin" size={20} /> : <Zap size={20} />}
                  GERAR CONTEÚDO
                </button>
              </div>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-bottom-4">
                <button
                  onClick={handleConfirmSaveIA}
                  disabled={loading}
                  className="w-full bg-green-500 text-black font-black py-6 rounded-2xl flex items-center justify-center gap-4 hover:scale-[1.02] shadow-xl shadow-green-500/20"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                  SALVAR RASCUNHO
                </button>
                <button
                  onClick={() => setPreviewPost(null)}
                  className="w-full bg-zinc-800 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest"
                >
                  REFAZER
                </button>
              </div>
            )}

            {errorMsg && (
              <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500">
                <AlertCircle size={16} />
                <p className="text-[10px] font-black uppercase tracking-widest">{errorMsg}</p>
              </div>
            )}
          </div>

          <div className="bg-zinc-900/5 border border-dashed border-white/10 rounded-[40px] p-10 overflow-y-auto max-h-[80vh] custom-scrollbar">
            {previewPost ? (
              <div className="animate-in fade-in duration-700 space-y-8">
                <h1 className="text-3xl font-black italic text-white">{previewPost.title}</h1>
                <div className="prose prose-invert prose-sm" dangerouslySetInnerHTML={{ __html: previewPost.content }} />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                <FileText size={48} className="mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">Aguardando IA...</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-10 animate-in fade-in duration-700">
          <div className="lg:col-span-2 space-y-8">
            <input 
              value={articleData.title} 
              onChange={e => setArticleData({...articleData, title: e.target.value})} 
              placeholder="Título do Artigo"
              className="w-full bg-zinc-900/20 border border-white/5 rounded-2xl px-8 py-6 text-2xl font-black italic outline-none focus:border-[#cfec0f]"
            />
            <textarea 
              value={articleData.content} 
              onChange={e => setArticleData({...articleData, content: e.target.value})} 
              placeholder="Conteúdo em HTML..."
              className="w-full bg-zinc-900/20 border border-white/5 rounded-3xl p-10 text-base leading-loose min-h-[500px] outline-none focus:border-[#cfec0f]"
            />
          </div>

          <div className="space-y-8">
            <div className="bg-zinc-900/20 p-8 rounded-[40px] border border-white/5 space-y-6">
              <div 
                className="aspect-video bg-black border border-white/10 rounded-3xl overflow-hidden cursor-pointer relative group flex items-center justify-center"
                onClick={() => fileInputRef.current?.click()}
              >
                <img src={articleData.image_url} className="w-full h-full object-cover group-hover:opacity-40 transition-all" alt="Capa" />
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
              </div>

              <button onClick={() => publishArticleManual(true)} className="w-full bg-[#cfec0f] text-black font-black py-5 rounded-2xl text-[10px] uppercase tracking-widest shadow-xl">LANÇAR AGORA</button>
              <button onClick={() => publishArticleManual(false)} className="w-full bg-white/5 text-zinc-500 font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest border border-white/5">SALVAR RASCUNHO</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateBlog;
