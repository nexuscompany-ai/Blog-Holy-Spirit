
import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Loader2, PenTool, Zap, 
  ShieldCheck, AlertCircle, RefreshCw, 
  FileText, Send, CheckCircle2
} from 'lucide-react';
import { aiService } from '../../services/ai.service';
import { dbService } from '../../db';

interface CreateBlogProps {
  onSuccess: () => void;
}

const CreateBlog: React.FC<CreateBlogProps> = ({ onSuccess }) => {
  const [activeMode, setActiveMode] = useState<'ia' | 'manual'>('ia');
  const [loading, setLoading] = useState(false);
  const [creationSuccess, setCreationSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loadingStep, setLoadingStep] = useState(0);
  
  // States do Assistente
  const [iaPrompt, setIaPrompt] = useState('');
  const [targetCategory, setTargetCategory] = useState('Musculação');
  
  // States Manuais
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [articleData, setArticleData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category_id: null,
    image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
  });

  const loadingMessages = [
    "Iniciando inteligência editorial...",
    "Pesquisando referências de alta performance...",
    "Estruturando tópicos e SEO...",
    "Finalizando redação do templo...",
    "Quase pronto! Organizando metadados..."
  ];

  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep(prev => (prev + 1) % loadingMessages.length);
      }, 5000);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleGenerateAndSave = async () => {
    if (!iaPrompt) return;
    setLoading(true);
    setErrorMsg('');
    
    try {
      // 1. Solicita a geração ao n8n (sem timeout no fetch)
      const result = await aiService.getPreview(iaPrompt, targetCategory);
      
      if (result.post) {
        // 2. Salva automaticamente no Banco de Dados
        await dbService.saveBlog({
          title: result.post.title,
          content: result.post.content,
          excerpt: result.post.excerpt,
          category: targetCategory,
          source: 'ai',
          published_at: null // Salva como rascunho por padrão
        });

        // 3. Feedback de sucesso e redirecionamento
        setCreationSuccess(true);
        setTimeout(() => {
          onSuccess(); // Redireciona para "Meus Artigos"
        }, 2500);
      } else {
        throw new Error("O servidor de inteligência não retornou um conteúdo válido.");
      }
    } catch (error: any) {
      console.error("Erro na geração/salvamento:", error);
      setErrorMsg(error.message || "Falha na comunicação com o Hub Editorial.");
      setLoading(false);
    }
  };

  const publishArticleManual = async (publish: boolean) => {
    if (!articleData.title) {
      setErrorMsg("O título é fundamental para o seu artigo.");
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
      setErrorMsg("Erro ao salvar artigo no site.");
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

  if (creationSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-neon rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(207,236,15,0.4)]">
          <CheckCircle2 size={48} className="text-black" />
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">Blog Gerado com Sucesso!</h2>
          <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Sincronizando com seu feed e redirecionando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex gap-4 mb-12 bg-zinc-900/40 p-2 rounded-3xl border border-white/5 w-fit">
        <button 
          onClick={() => { setActiveMode('ia'); setErrorMsg(''); }}
          disabled={loading}
          className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeMode === 'ia' ? 'bg-[#cfec0f] text-black' : 'text-gray-500 hover:text-white disabled:opacity-30'}`}
        >
          <Sparkles size={14} /> Assistente de Redação
        </button>
        <button 
          onClick={() => { setActiveMode('manual'); setErrorMsg(''); }}
          disabled={loading}
          className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeMode === 'manual' ? 'bg-white text-black' : 'text-gray-500 hover:text-white disabled:opacity-30'}`}
        >
          <PenTool size={14} /> Escrita Manual
        </button>
      </div>

      {activeMode === 'ia' ? (
        <div className="grid lg:grid-cols-5 gap-12 animate-in fade-in duration-700">
          <div className="lg:col-span-3 bg-zinc-900/10 p-12 rounded-[40px] border border-white/5 space-y-8 h-fit">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-[#cfec0f]">
              {loading ? "Processando Ideia..." : "Preparar Novo Artigo"}
            </h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Qual o foco do artigo?</label>
                <select 
                  value={targetCategory} 
                  onChange={e => setTargetCategory(e.target.value)}
                  disabled={loading}
                  className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#cfec0f] text-sm"
                >
                  <option>Musculação</option>
                  <option>Nutrição</option>
                  <option>Espiritualidade</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Sobre o que deseja falar hoje?</label>
                <textarea
                  value={iaPrompt}
                  onChange={(e) => setIaPrompt(e.target.value)}
                  disabled={loading}
                  placeholder="Ex: Como manter a constância nos treinos mesmo em dias difíceis..."
                  className="w-full bg-black border border-white/10 rounded-3xl p-8 outline-none focus:border-[#cfec0f] text-lg min-h-[200px] resize-none leading-relaxed transition-all"
                />
              </div>

              <button
                onClick={handleGenerateAndSave}
                disabled={loading || !iaPrompt}
                className="w-full bg-[#cfec0f] text-black font-black py-6 rounded-2xl flex items-center justify-center gap-4 hover:scale-[1.02] shadow-xl shadow-[#cfec0f]/20 disabled:opacity-50 disabled:grayscale transition-all"
              >
                {loading ? <RefreshCw className="animate-spin" size={20} /> : <Zap size={20} />}
                {loading ? "INTELIGÊNCIA EM CURSO..." : "GERAR E PUBLICAR NO FEED"}
              </button>
            </div>

            {errorMsg && (
              <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500">
                <AlertCircle size={16} />
                <p className="text-[10px] font-black uppercase tracking-widest">{errorMsg}</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 flex flex-col justify-center items-center p-12 bg-black/40 border border-dashed border-white/10 rounded-[40px] text-center">
            {loading ? (
              <div className="space-y-6 animate-pulse">
                <div className="w-20 h-20 bg-neon/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RefreshCw className="text-neon animate-spin" size={32} />
                </div>
                <p className="text-xl font-black italic uppercase text-white">{loadingMessages[loadingStep]}</p>
                <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em]">O n8n está construindo seu conteúdo agora...</p>
              </div>
            ) : (
              <div className="space-y-6 opacity-30">
                <FileText size={48} className="mx-auto" />
                <p className="text-[10px] font-black uppercase tracking-widest">Defina o tema à esquerda para iniciar a automação editorial.</p>
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
              placeholder="Título do seu Artigo"
              className="w-full bg-zinc-900/20 border border-white/5 rounded-2xl px-8 py-6 text-2xl font-black italic outline-none focus:border-[#cfec0f]"
            />
            <textarea 
              value={articleData.content} 
              onChange={e => setArticleData({...articleData, content: e.target.value})} 
              placeholder="Escreva seu conteúdo aqui..."
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

              <button onClick={() => publishArticleManual(true)} className="w-full bg-[#cfec0f] text-black font-black py-5 rounded-2xl text-[10px] uppercase tracking-widest shadow-xl">PUBLICAR AGORA NO SITE</button>
              <button onClick={() => publishArticleManual(false)} className="w-full bg-white/5 text-zinc-500 font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest border border-white/5">SALVAR COMO RASCUNHO</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateBlog;
