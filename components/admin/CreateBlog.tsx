
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, Save, Type as TypeIcon, Loader2, CheckCircle2, 
  Image as ImageIcon, Upload, PenTool, Edit3, AlignLeft,
  AlertCircle, Clock, Calendar, ShieldAlert, Zap, 
  ChevronRight, Activity, BrainCircuit, Globe, Info
} from 'lucide-react';
// Correct import as per @google/genai guidelines
import { GoogleGenAI, Type } from "@google/genai";
import { BlogPost } from '../BlogSection';

interface CreateBlogProps {
  onSuccess: () => void;
}

const CreateBlog: React.FC<CreateBlogProps> = ({ onSuccess }) => {
  const [activeSubTab, setActiveSubTab] = useState<'ia' | 'auto' | 'manual'>('ia');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState<'input' | 'editing'>('input');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Automação States
  const [autoEnabled, setAutoEnabled] = useState(false);
  const [frequency, setFrequency] = useState('24h');
  
  // Artigo States
  const [iaPrompt, setIaPrompt] = useState('');
  const [articleData, setArticleData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Espiritualidade',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
    source: ''
  });

  const loadingMessages = [
    "Sincronizando com o Templo de Dados...",
    "Interpretando princípios e objetivos...",
    "Esculpindo o conteúdo (Corpo e Espírito)...",
    "Otimizando para buscadores sagrados (SEO)...",
    "Finalizando consagração do texto..."
  ];

  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep(prev => (prev < 4 ? prev + 1 : prev));
      }, 1500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const generateWithIA = async () => {
    if (!iaPrompt) return;
    setLoading(true);
    
    try {
      // Corrected initialization using process.env.API_KEY
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Gere um artigo de blog profissional para a academia Holy Spirit Gym. 
        Tema: ${iaPrompt}. 
        Conceito: Corpo como Templo, Fé e Musculação de Alta Performance.
        Retorne um JSON estrito com: title, excerpt, content, category, slug.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              excerpt: { type: Type.STRING },
              content: { type: Type.STRING },
              category: { type: Type.STRING },
              slug: { type: Type.STRING }
            },
            required: ["title", "excerpt", "content", "category", "slug"]
          }
        }
      });

      // Extract text using .text property
      const result = JSON.parse(response.text || '{}');
      
      setArticleData({
        ...articleData,
        title: result.title,
        excerpt: result.excerpt,
        content: result.content,
        category: result.category,
        source: 'GERADO POR HOLY IA'
      });
      
      setStep('editing');
    } catch (error: any) {
      console.error(error);
      alert("Erro na conexão sagrada. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const publishArticle = () => {
    const existing = JSON.parse(localStorage.getItem('hs_blogs') || '[]');
    const newPost: BlogPost = {
      id: Date.now().toString(),
      title: articleData.title,
      excerpt: articleData.excerpt,
      content: articleData.content,
      category: articleData.category,
      image: articleData.image,
      slug: articleData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    localStorage.setItem('hs_blogs', JSON.stringify([newPost, ...existing]));
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Sistema de Alerta de Consumo */}
      <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldAlert className="text-amber-500" size={20} />
          <div>
            <p className="text-[10px] font-black uppercase text-amber-500">Aviso de Créditos IA</p>
            <p className="text-xs text-amber-500/80">Cada geração automática consome ~1.5k tokens. Monitore seu uso no Google Cloud Console.</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4 border-l border-amber-500/20 pl-6">
          <div className="text-right">
            <p className="text-[10px] font-black uppercase text-gray-500">Saúde da API</p>
            <p className="text-xs font-bold text-green-500">100% OPERACIONAL</p>
          </div>
          <Activity size={20} className="text-green-500" />
        </div>
      </div>

      {/* Navegação Superior - 3 Opções */}
      <div className="flex p-1.5 bg-zinc-900/50 rounded-2xl border border-white/5 w-fit">
        <button 
          onClick={() => { setActiveSubTab('ia'); setStep('input'); }}
          className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'ia' ? 'bg-[#cfec0f] text-black shadow-lg shadow-[#cfec0f]/20' : 'text-gray-500 hover:text-white'}`}
        >
          <Zap size={14} /> Orquestrador
        </button>
        <button 
          onClick={() => { setActiveSubTab('auto'); setStep('input'); }}
          className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'auto' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-gray-500 hover:text-white'}`}
        >
          <Clock size={14} /> Auto-Postagem
        </button>
        <button 
          onClick={() => { setActiveSubTab('manual'); setStep('editing'); }}
          className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'manual' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
        >
          <PenTool size={14} /> Manual
        </button>
      </div>

      {step === 'input' && activeSubTab === 'ia' && (
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-zinc-900/20 p-12 rounded-[40px] border border-white/5 space-y-8">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">Geração Instantânea</h2>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Qual o ensinamento de hoje?</label>
              <textarea
                value={iaPrompt}
                onChange={(e) => setIaPrompt(e.target.value)}
                placeholder="Ex: Por que treinar pernas é um ato de disciplina cristã..."
                className="w-full bg-black border border-white/10 rounded-3xl px-8 py-6 outline-none focus:border-[#cfec0f] transition-all text-lg min-h-[180px] resize-none"
              />
            </div>
            <button
              onClick={generateWithIA}
              disabled={loading || !iaPrompt}
              className="w-full bg-[#cfec0f] text-black font-black py-6 rounded-2xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 shadow-[0_10px_40px_rgba(207,236,15,0.2)]"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
              {loading ? "CONSAGRANDO..." : "GERAR ARTIGO"}
            </button>
          </div>

          <div className="bg-black/40 border border-white/5 rounded-[40px] p-12 flex flex-col justify-center items-center text-center space-y-6">
            {!loading ? (
              <>
                <div className="w-20 h-20 bg-[#cfec0f]/10 rounded-full flex items-center justify-center text-[#cfec0f] mb-4">
                  <BrainCircuit size={40} />
                </div>
                <h3 className="text-xl font-black uppercase italic">IA Orquestradora Holy</h3>
                <p className="text-gray-500 text-sm max-w-xs leading-relaxed">Nossa inteligência entende o DNA da Holy Spirit para criar conteúdos que unem musculação de elite e espiritualidade profunda.</p>
              </>
            ) : (
              <div className="w-full space-y-8 animate-in fade-in duration-500">
                <div className="relative w-24 h-24 mx-auto">
                   <div className="absolute inset-0 border-4 border-[#cfec0f]/20 rounded-full"></div>
                   <div className="absolute inset-0 border-4 border-[#cfec0f] rounded-full border-t-transparent animate-spin"></div>
                </div>
                <div className="space-y-4">
                   <p className="text-[#cfec0f] font-black uppercase tracking-widest animate-pulse">{loadingMessages[loadingStep]}</p>
                   <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#cfec0f] h-full transition-all duration-700 ease-out" 
                        style={{ width: `${(loadingStep + 1) * 20}%` }}
                      ></div>
                   </div>
                   <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest">Passo {loadingStep + 1} de 5</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSubTab === 'auto' && (
        <div className="bg-zinc-900/20 p-12 rounded-[40px] border border-white/5 space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h2 className="text-3xl font-black uppercase italic tracking-tighter">Auto-Postagem Inteligente</h2>
              <p className="text-gray-500 text-sm mt-2">A IA gerará e publicará artigos automaticamente seguindo sua configuração.</p>
            </div>
            <button 
              onClick={() => setAutoEnabled(!autoEnabled)}
              className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-3 ${autoEnabled ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-zinc-800 text-gray-500'}`}
            >
              <div className={`w-3 h-3 rounded-full ${autoEnabled ? 'bg-white animate-pulse' : 'bg-gray-600'}`}></div>
              {autoEnabled ? 'AUTOMAÇÃO ATIVA' : 'ATIVAR AUTOMAÇÃO'}
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-black/40 p-8 rounded-3xl border border-white/5 space-y-4">
              <div className="flex items-center gap-3 text-blue-400 mb-2">
                <Calendar size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">Frequência</span>
              </div>
              <select 
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-blue-400 transition-all"
              >
                <option value="6h">A cada 6 horas</option>
                <option value="12h">A cada 12 horas</option>
                <option value="24h">Diariamente (24h)</option>
                <option value="weekly">Semanalmente</option>
              </select>
            </div>

            <div className="bg-black/40 p-8 rounded-3xl border border-white/5 space-y-4">
              <div className="flex items-center gap-3 text-purple-400 mb-2">
                <Globe size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">Temas Foco</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Treino', 'Espiritualidade', 'Nutrição'].map(tag => (
                  <span key={tag} className="text-[9px] font-black uppercase bg-zinc-800 px-3 py-1.5 rounded-lg border border-white/5 text-gray-400">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-black/40 p-8 rounded-3xl border border-white/5 space-y-4 flex flex-col justify-center">
              <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Próxima Consagração</p>
              <p className="text-2xl font-black text-white italic">
                {autoEnabled ? 'Hoje, às 18:00' : '---'}
              </p>
              <p className="text-[9px] text-gray-600 font-bold uppercase">Baseado no seu fuso horário (SP)</p>
            </div>
          </div>

          <div className="bg-blue-500/5 border border-blue-500/10 p-6 rounded-3xl flex items-start gap-4">
            {/* Fix: Added missing Info icon to lucide-react imports */}
            <Info size={20} className="text-blue-500 shrink-0" />
            <p className="text-xs text-blue-500/80 leading-relaxed italic">
              "A automação utiliza algoritmos de varredura de tendências para criar posts que estão em alta no mundo fitness cristão. Você sempre poderá editar ou excluir posts gerados automaticamente na aba 'Meus Blogs'."
            </p>
          </div>
        </div>
      )}

      {step === 'editing' && (
        <div className="space-y-8 animate-in zoom-in-95 duration-500">
          <div className="flex flex-col md:flex-row justify-between items-center bg-zinc-900/50 p-6 rounded-3xl border border-white/5 gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-[#cfec0f]/10 p-3 rounded-xl text-[#cfec0f]"><Edit3 size={20} /></div>
              <div>
                <h3 className="font-black uppercase italic tracking-tight">Revisão Editorial</h3>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Ajuste os detalhes finais antes de publicar</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setStep('input')}
                className="px-6 py-3 rounded-xl text-[10px] font-black uppercase text-gray-500 hover:text-white transition-all"
              >
                Descartar
              </button>
              <button 
                onClick={publishArticle}
                className="bg-[#cfec0f] text-black px-8 py-3 rounded-xl text-[10px] font-black uppercase hover:scale-105 transition-all shadow-lg"
              >
                Publicar no Templo
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2">
                  {/* Fix: Use aliased TypeIcon to avoid conflict with GenAI Type */}
                  <TypeIcon size={14} className="text-[#cfec0f]" /> Título do Artigo
                </label>
                <input 
                  value={articleData.title} 
                  onChange={e => setArticleData({...articleData, title: e.target.value})}
                  className="w-full bg-zinc-900/30 border border-white/5 rounded-2xl px-6 py-5 text-2xl font-black italic outline-none focus:border-[#cfec0f] transition-all" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2">
                  <AlignLeft size={14} className="text-[#cfec0f]" /> Conteúdo Completo
                </label>
                <textarea 
                  value={articleData.content} 
                  onChange={e => setArticleData({...articleData, content: e.target.value})}
                  className="w-full bg-zinc-900/30 border border-white/5 rounded-2xl p-8 text-sm leading-relaxed min-h-[600px] outline-none focus:border-[#cfec0f] transition-all" 
                />
              </div>
            </div>

            <div className="space-y-6">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-video bg-black border border-white/5 rounded-3xl overflow-hidden cursor-pointer group relative flex items-center justify-center"
              >
                {articleData.image ? (
                  <img src={articleData.image} className="w-full h-full object-cover group-hover:opacity-40 transition-all" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-700">
                    <ImageIcon size={40} />
                    <span className="text-[10px] font-black uppercase">Upload de Capa</span>
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  <Upload className="text-[#cfec0f]" />
                </div>
                <input type="file" ref={fileInputRef} onChange={(e) => {
                   const file = e.target.files?.[0];
                   if (file) {
                     const reader = new FileReader();
                     reader.onloadend = () => setArticleData({ ...articleData, image: reader.result as string });
                     reader.readAsDataURL(file);
                   }
                }} className="hidden" />
              </div>

              <div className="bg-zinc-900/30 p-8 rounded-[40px] border border-white/5 space-y-6">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest block">Categoria</label>
                  <select 
                    value={articleData.category} 
                    onChange={e => setArticleData({...articleData, category: e.target.value})}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 text-xs font-bold outline-none cursor-pointer focus:border-[#cfec0f]"
                  >
                    <option>Espiritualidade</option>
                    <option>Treino Pesado</option>
                    <option>Nutrição Sagrada</option>
                    <option>Mentalidade</option>
                  </select>
                </div>
              </div>

              {articleData.source && (
                <div className="flex items-center gap-3 p-4 bg-[#cfec0f]/5 border border-[#cfec0f]/10 rounded-2xl">
                  <Sparkles size={16} className="text-[#cfec0f]" />
                  <span className="text-[9px] font-black uppercase text-[#cfec0f] tracking-widest">{articleData.source}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="fixed bottom-10 right-10 bg-green-500 text-white px-8 py-5 rounded-3xl font-black uppercase tracking-widest shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-10 z-[100]">
          <CheckCircle2 /> Artigo Consagrado e Publicado!
        </div>
      )}
    </div>
  );
};

export default CreateBlog;
