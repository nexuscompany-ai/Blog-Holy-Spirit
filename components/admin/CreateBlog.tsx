
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, Loader2, CheckCircle2, 
  Upload, PenTool, Edit3, Clock, Calendar, 
  ShieldAlert, Zap, BrainCircuit, Globe, EyeOff, Camera
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { BlogPost } from '../BlogSection';
import { dbService } from '../../db';

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
  
  const [iaPrompt, setIaPrompt] = useState('');
  const [articleData, setArticleData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Musculação',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
    slug: '',
    metaTitle: '',
    metaDescription: '',
    keywords: ''
  });

  const loadingMessages = [
    "Identificando palavras-chave de alta conversão...",
    "Sintonizando Mentalidade de Guerreiro e Fé...",
    "Redigindo estrutura SEO avançada (H1, H2, H3)...",
    "Garantindo autoridade E-E-A-T no conteúdo...",
    "Finalizando CTA estratégico para o WhatsApp..."
  ];

  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep(prev => (prev < 4 ? prev + 1 : prev));
      }, 1800);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const generateWithIA = async () => {
    if (!iaPrompt) return;
    setLoading(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Gere um artigo completo e otimizado para blog sobre: ${iaPrompt}`,
        config: {
          systemInstruction: `FUNÇÃO: Criador de Conteúdo Profissional para Blog de Academia Holy Spirit.
          ESPECIALIDADE: Marketing de conteúdo, SEO avançado, copywriting persuasivo e fitness cristão.
          MENTALIDADE: Especialista em fitness, musculação, saúde e lifestyle ativo. Foco em autoridade E-E-A-T.
          OBJETIVOS: Gerar tráfego orgânico qualificado, educar iniciantes e estimular conversão (WhatsApp).
          
          ESTRUTURA OBRIGATÓRIA:
          1. Título H1 magnético com palavra-chave.
          2. Introdução conectando com a dor/desejo.
          3. Subtítulos H2/H3 escaneáveis.
          4. Conteúdo aprofundado com bullet points.
          5. Bloco de autoridade: Mitos e Verdades, Erros Comuns.
          6. Chamada para Ação (CTA) estratégica.
          
          RETORNO: JSON estrito.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              excerpt: { type: Type.STRING },
              content: { type: Type.STRING },
              category: { type: Type.STRING },
              slug: { type: Type.STRING },
              metaTitle: { type: Type.STRING },
              metaDescription: { type: Type.STRING },
              keywords: { type: Type.STRING },
              cta: { type: Type.STRING }
            },
            required: ["title", "excerpt", "content", "category", "slug", "metaTitle", "metaDescription", "keywords", "cta"]
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      setArticleData({
        ...articleData,
        title: result.title,
        excerpt: result.excerpt,
        content: result.content + "\n\n" + result.cta,
        category: result.category,
        slug: result.slug,
        metaTitle: result.metaTitle,
        metaDescription: result.metaDescription,
        keywords: result.keywords
      });
      setStep('editing');
    } catch (error: any) {
      console.error(error);
      alert("Erro ao processar IA. Verifique sua chave API.");
    } finally {
      setLoading(false);
    }
  };

  const publishArticle = async () => {
    const newPost: BlogPost = {
      id: Date.now().toString(),
      title: articleData.title,
      excerpt: articleData.excerpt,
      content: articleData.content,
      category: articleData.category,
      image: articleData.image,
      slug: articleData.slug || articleData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    await dbService.saveBlog(newPost);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col min-h-[85vh]">
      <div className="flex p-1 bg-zinc-900/40 rounded-2xl border border-white/5 w-fit mb-12">
        <button 
          onClick={() => { setActiveSubTab('ia'); setStep('input'); }}
          className={`flex items-center gap-3 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'ia' ? 'bg-[#cfec0f] text-black shadow-lg shadow-[#cfec0f]/20' : 'text-gray-500 hover:text-white'}`}
        >
          <Sparkles size={14} /> Escritora IA Holy Spirit
        </button>
        <button 
          onClick={() => { setActiveSubTab('manual'); setStep('editing'); }}
          className={`flex items-center gap-3 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'manual' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
        >
          <PenTool size={14} /> Escrita Manual
        </button>
      </div>

      <div className="flex-grow">
        {step === 'input' && (
          <div className="grid lg:grid-cols-2 gap-12 animate-in fade-in duration-700">
            <div className="bg-zinc-900/10 p-12 rounded-[40px] border border-white/5 space-y-10">
              <div className="space-y-3">
                <h2 className="text-4xl font-black uppercase italic tracking-tighter text-[#cfec0f]">Estrategista de SEO</h2>
                <p className="text-gray-500 text-sm font-medium">Transforme temas em artigos de alto desempenho que atraem e convertem.</p>
              </div>
              
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Qual o tema ou palavra-chave?</label>
                <textarea
                  value={iaPrompt}
                  onChange={(e) => setIaPrompt(e.target.value)}
                  placeholder="Ex: Benefícios do agachamento livre para a postura e disciplina..."
                  className="w-full bg-black border border-white/10 rounded-3xl px-8 py-8 outline-none focus:border-[#cfec0f] transition-all text-xl min-h-[220px] resize-none placeholder:text-zinc-800"
                />
              </div>

              <button
                onClick={generateWithIA}
                disabled={loading || !iaPrompt}
                className="w-full bg-[#cfec0f] text-black font-black py-6 rounded-2xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 shadow-[0_15px_40px_rgba(207,236,15,0.2)]"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Zap size={18} />}
                {loading ? "REDIGINDO ESTRATÉGIA..." : "GERAR ARTIGO COMPLETO"}
              </button>
            </div>

            <div className="flex flex-col justify-center items-center text-center p-12 border border-dashed border-white/10 rounded-[40px] bg-black/10">
              {!loading ? (
                <div className="space-y-8 max-w-sm">
                  <div className="w-24 h-24 bg-[#cfec0f]/5 rounded-[32px] flex items-center justify-center text-[#cfec0f] mx-auto">
                    <BrainCircuit size={48} />
                  </div>
                  <h3 className="text-2xl font-black uppercase italic">Padrão Holy Spirit</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">Artigos originais, confiáveis e alinhados às boas práticas do Google (E-E-A-T).</p>
                </div>
              ) : (
                <div className="w-full space-y-12 animate-in zoom-in duration-500">
                  <div className="relative w-32 h-32 mx-auto">
                    <div className="absolute inset-0 border-[6px] border-[#cfec0f] rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-[#cfec0f]">
                       <Sparkles size={32} />
                    </div>
                  </div>
                  <p className="text-[#cfec0f] font-black uppercase tracking-[0.3em] text-sm animate-pulse">{loadingMessages[loadingStep]}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 'editing' && (
          <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-700">
            <div className="flex flex-col lg:flex-row justify-between items-center bg-zinc-900/40 p-8 rounded-[32px] border border-white/5 gap-6">
              <div className="flex items-center gap-5">
                <div className="bg-[#cfec0f]/10 p-4 rounded-2xl text-[#cfec0f]"><Edit3 size={24} /></div>
                <div>
                  <h3 className="text-xl font-black uppercase italic tracking-tight">Revisão e Otimização</h3>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">A IA estruturou os dados SEO. Verifique antes de publicar.</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <button onClick={() => setStep('input')} className="text-[10px] font-black uppercase text-gray-500 hover:text-white transition-all">Descartar</button>
                <button onClick={publishArticle} className="bg-[#cfec0f] text-black px-12 py-5 rounded-2xl text-xs font-black uppercase hover:scale-105 transition-all shadow-lg">Publicar no Blog</button>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-4">H1 - Título Otimizado</label>
                  <input value={articleData.title} onChange={e => setArticleData({...articleData, title: e.target.value})} className="w-full bg-zinc-900/20 border border-white/5 rounded-2xl px-8 py-6 text-2xl font-black italic outline-none focus:border-[#cfec0f]" />
                </div>
                
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-4">Conteúdo do Artigo</label>
                   <textarea value={articleData.content} onChange={e => setArticleData({...articleData, content: e.target.value})} className="w-full bg-zinc-900/20 border border-white/5 rounded-3xl p-10 text-sm leading-relaxed min-h-[600px] outline-none focus:border-[#cfec0f]" />
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-zinc-900/20 p-8 rounded-[40px] border border-white/5 space-y-6">
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-[#cfec0f]">Metadata & SEO</h4>
                   
                   <div className="space-y-2">
                     <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Slug da URL</label>
                     <input value={articleData.slug} readOnly className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-zinc-400" />
                   </div>

                   <div className="space-y-2">
                     <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Keywords Sugeridas</label>
                     <p className="text-[10px] bg-black/40 p-3 rounded-xl text-zinc-500 border border-white/5">{articleData.keywords}</p>
                   </div>
                   
                   <div className="aspect-video bg-black border border-white/5 rounded-3xl overflow-hidden cursor-pointer group relative flex items-center justify-center mt-6" onClick={() => fileInputRef.current?.click()}>
                        <img src={articleData.image} className="w-full h-full object-cover group-hover:opacity-40 transition-all" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                          <Camera className="text-[#cfec0f]" />
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
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {success && (
        <div className="fixed bottom-12 right-12 bg-green-600 text-white px-10 py-6 rounded-3xl font-black uppercase tracking-widest shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-12 z-[100]">
          <CheckCircle2 size={24} /> Templo Atualizado!
        </div>
      )}
    </div>
  );
};

export default CreateBlog;
