
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
  
  const [includeImage, setIncludeImage] = useState(true);
  
  const [autoConfig, setAutoConfig] = useState({
    enabled: false,
    frequency: 'daily',
    days: ['Seg', 'Qua', 'Sex'],
    time: '09:00',
    lastRun: null
  });

  const [iaPrompt, setIaPrompt] = useState('');
  const [articleData, setArticleData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Espiritualidade',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
    source: ''
  });

  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const loadingMessages = [
    "Escritora IA analisando tendências de alta performance...",
    "Sintonizando com os valores da Holy Spirit...",
    "Redigindo conteúdo com autoridade e profundidade...",
    "Otimizando estrutura para máxima legibilidade...",
    "Finalizando revisão de tom de voz e SEO..."
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

  const toggleDay = (day: string) => {
    setAutoConfig({
      ...autoConfig,
      days: autoConfig.days.includes(day) 
        ? autoConfig.days.filter((d: string) => d !== day) 
        : [...autoConfig.days, day]
    });
  };

  const generateWithIA = async () => {
    if (!iaPrompt) return;
    setLoading(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Você é a Escritora Editorial Senior da Holy Spirit Gym. 
        Seu objetivo é criar um artigo de blog de altíssima qualidade que conecte musculação de elite e espiritualidade cristã.
        Tema: ${iaPrompt}. 
        Diretrizes: Tom inspirador, autoritário, parágrafos curtos, bullet points, e conclusão com CTA motivador para falar no WhatsApp.
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

      const result = JSON.parse(response.text || '{}');
      setArticleData({
        ...articleData,
        title: result.title,
        excerpt: result.excerpt,
        content: result.content,
        category: result.category,
        source: 'ESCRITORA IA PILOTO'
      });
      setStep('editing');
    } catch (error: any) {
      console.error(error);
      alert("Houve um pequeno desvio na conexão com a Escritora IA. Verifique se a sua conexão está ativa.");
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
      image: includeImage ? articleData.image : '',
      slug: articleData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
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
          <Sparkles size={14} /> Escritora IA
        </button>
        <button 
          onClick={() => { setActiveSubTab('auto'); setStep('input'); }}
          className={`flex items-center gap-3 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'auto' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
        >
          <Clock size={14} /> Postagens Automáticas
        </button>
        <button 
          onClick={() => { setActiveSubTab('manual'); setStep('editing'); }}
          className={`flex items-center gap-3 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'manual' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
        >
          <PenTool size={14} /> Escrita Manual
        </button>
      </div>

      <div className="flex-grow">
        {step === 'input' && activeSubTab === 'ia' && (
          <div className="grid lg:grid-cols-2 gap-12 animate-in fade-in duration-700">
            <div className="bg-zinc-900/10 p-12 rounded-[40px] border border-white/5 space-y-10">
              <div className="space-y-3">
                <h2 className="text-4xl font-black uppercase italic tracking-tighter">Piloto Editorial</h2>
                <p className="text-gray-500 text-sm font-medium">Defina o rumo do conteúdo e a nossa Escritora IA cuidará de toda a complexidade.</p>
              </div>
              
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Qual o tema do próximo blog?</label>
                <textarea
                  value={iaPrompt}
                  onChange={(e) => setIaPrompt(e.target.value)}
                  placeholder="Ex: A importância do descanso dominical para hipertrofia máxima..."
                  className="w-full bg-black border border-white/10 rounded-3xl px-8 py-8 outline-none focus:border-[#cfec0f] transition-all text-xl min-h-[220px] resize-none placeholder:text-zinc-800"
                />
              </div>

              <button
                onClick={generateWithIA}
                disabled={loading || !iaPrompt}
                className="w-full bg-[#cfec0f] text-black font-black py-6 rounded-2xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 shadow-[0_15px_40px_rgba(207,236,15,0.2)] group"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Send size={18} className="group-hover:translate-x-1 transition-transform" />}
                {loading ? "ESCULPINDO TEXTO..." : "SOLICITAR REDAÇÃO"}
              </button>
            </div>

            <div className="flex flex-col justify-center items-center text-center p-12 border border-dashed border-white/10 rounded-[40px] bg-black/10">
              {!loading ? (
                <div className="space-y-8 max-w-sm">
                  <div className="w-24 h-24 bg-[#cfec0f]/5 rounded-[32px] flex items-center justify-center text-[#cfec0f] mx-auto shadow-inner">
                    <BrainCircuit size={48} />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black uppercase italic tracking-tight">Escritora Editorial</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">Nossa IA não apenas escreve, ela entende a cultura Holy Spirit: o equilíbrio entre o ferro e a fé.</p>
                  </div>
                  <div className="flex justify-center gap-3">
                    {['Refinada', 'SEO', 'Veloz'].map(tag => (
                      <span key={tag} className="px-4 py-2 bg-zinc-900 border border-white/5 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="w-full space-y-12 animate-in zoom-in duration-500">
                  <div className="relative w-32 h-32 mx-auto">
                    <div className="absolute inset-0 border-[6px] border-[#cfec0f]/10 rounded-full"></div>
                    <div className="absolute inset-0 border-[6px] border-[#cfec0f] rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-[#cfec0f]">
                       <Sparkles size={32} className="animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <p className="text-[#cfec0f] font-black uppercase tracking-[0.3em] text-sm animate-pulse">{loadingMessages[loadingStep]}</p>
                    <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden max-w-xs mx-auto">
                      <div className="bg-[#cfec0f] h-full transition-all duration-[1500ms] ease-in-out" style={{ width: `${(loadingStep + 1) * 20}%` }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeSubTab === 'auto' && (
          <div className="bg-zinc-900/10 p-16 rounded-[50px] border border-white/5 space-y-16 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-white/5 pb-10">
              <div className="space-y-2">
                <h2 className="text-4xl font-black uppercase italic tracking-tighter text-blue-500">Fluxo Automático</h2>
                <p className="text-gray-500 text-sm font-medium">A IA assume o comando total da sua estratégia de conteúdo.</p>
              </div>
              <button 
                onClick={() => setAutoConfig({...autoConfig, enabled: !autoConfig.enabled})}
                className={`px-10 py-5 rounded-3xl font-black uppercase tracking-widest text-[11px] transition-all flex items-center gap-4 ${autoConfig.enabled ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30' : 'bg-zinc-800 text-gray-500'}`}
              >
                <div className={`w-3 h-3 rounded-full ${autoConfig.enabled ? 'bg-white animate-pulse' : 'bg-gray-600'}`}></div>
                {autoConfig.enabled ? 'POSTAGENS ATIVAS' : 'INICIAR AUTOMAÇÃO'}
              </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-16">
              <div className="space-y-8">
                <div className="flex items-center gap-3 text-white">
                  <Calendar size={20} className="text-blue-500" />
                  <span className="text-xs font-black uppercase tracking-widest">Frequência Base</span>
                </div>
                <div className="space-y-3">
                  {['daily', 'weekly', 'monthly'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setAutoConfig({...autoConfig, frequency: f})}
                      className={`w-full px-8 py-5 rounded-2xl text-[11px] font-black uppercase text-left transition-all border ${autoConfig.frequency === f ? 'bg-blue-600/10 border-blue-600 text-blue-500' : 'bg-black border-white/5 text-gray-500 hover:border-white/20'}`}
                    >
                      {f === 'daily' ? 'Diariamente' : f === 'weekly' ? 'Semanalmente' : 'Mensalmente'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-3 text-white">
                  <Globe size={20} className="text-blue-500" />
                  <span className="text-xs font-black uppercase tracking-widest">Dias da Semana</span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`h-14 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center border ${autoConfig.days.includes(day) ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-black border-white/5 text-gray-500 hover:border-white/20'}`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-8 text-center lg:text-left">
                <div className="flex items-center gap-3 text-white justify-center lg:justify-start">
                  <Clock size={20} className="text-blue-500" />
                  <span className="text-xs font-black uppercase tracking-widest">Horário de Envio</span>
                </div>
                <input 
                  type="time" 
                  value={autoConfig.time}
                  onChange={(e) => setAutoConfig({...autoConfig, time: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-3xl px-8 py-7 text-4xl font-black text-center text-blue-500 outline-none focus:border-blue-600 transition-all shadow-inner"
                />
              </div>
            </div>
          </div>
        )}

        {step === 'editing' && (
          <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-700">
            <div className="flex flex-col lg:flex-row justify-between items-center bg-zinc-900/40 p-8 rounded-[32px] border border-white/5 gap-6">
              <div className="flex items-center gap-5">
                <div className="bg-[#cfec0f]/10 p-4 rounded-2xl text-[#cfec0f]"><Edit3 size={24} /></div>
                <div>
                  <h3 className="text-xl font-black uppercase italic tracking-tight">Consagração Final</h3>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">O artigo piloto foi gerado. Refine o que desejar.</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <button onClick={() => setStep('input')} className="text-[10px] font-black uppercase text-gray-500 hover:text-white transition-all">Descartar</button>
                <button onClick={publishArticle} className="bg-[#cfec0f] text-black px-12 py-5 rounded-2xl text-xs font-black uppercase hover:scale-105 transition-all shadow-2xl shadow-[#cfec0f]/20">Publicar Agora</button>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Título do Post</label>
                  <input value={articleData.title} onChange={e => setArticleData({...articleData, title: e.target.value})} className="w-full bg-zinc-900/20 border border-white/5 rounded-2xl px-8 py-6 text-2xl font-black italic outline-none focus:border-[#cfec0f] transition-all" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Corpo Editorial</label>
                  <textarea value={articleData.content} onChange={e => setArticleData({...articleData, content: e.target.value})} className="w-full bg-zinc-900/20 border border-white/5 rounded-3xl p-10 text-sm leading-relaxed min-h-[600px] outline-none focus:border-[#cfec0f] transition-all" />
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-zinc-900/20 p-8 rounded-[40px] border border-white/5 space-y-8">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <Camera size={18} className="text-[#cfec0f]" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Imagem de Capa</span>
                     </div>
                     <button 
                       onClick={() => setIncludeImage(!includeImage)}
                       className={`w-12 h-6 rounded-full transition-all relative ${includeImage ? 'bg-[#cfec0f]' : 'bg-zinc-800'}`}
                     >
                       <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${includeImage ? 'right-1 bg-black' : 'left-1 bg-gray-600'}`}></div>
                     </button>
                   </div>

                   {includeImage ? (
                     <div onClick={() => fileInputRef.current?.click()} className="aspect-video bg-black border border-white/5 rounded-3xl overflow-hidden cursor-pointer group relative flex items-center justify-center">
                        <img src={articleData.image} className="w-full h-full object-cover group-hover:opacity-40 transition-all" />
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
                   ) : (
                     <div className="aspect-video bg-black/50 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-3 text-gray-700">
                       <EyeOff size={32} />
                       <span className="text-[9px] font-black uppercase">Post sem imagem</span>
                     </div>
                   )}
                </div>

                <div className="bg-zinc-900/20 p-8 rounded-[40px] border border-white/5 space-y-8">
                   <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block">Categoria Holy</label>
                     <select value={articleData.category} onChange={e => setArticleData({...articleData, category: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-5 py-5 text-xs font-bold outline-none cursor-pointer focus:border-[#cfec0f]">
                       <option>Espiritualidade</option>
                       <option>Treino de Elite</option>
                       <option>Nutrição Sagrada</option>
                       <option>Mentalidade</option>
                     </select>
                   </div>
                   {articleData.source && (
                     <div className="flex items-center gap-3 p-4 bg-[#cfec0f]/5 border border-[#cfec0f]/10 rounded-2xl">
                       <Zap size={16} className="text-[#cfec0f]" />
                       <span className="text-[9px] font-black uppercase text-[#cfec0f] tracking-widest">{articleData.source}</span>
                     </div>
                   )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="mt-20 pt-10 border-t border-white/5 pb-10 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-4 text-gray-700 opacity-60 hover:opacity-100 transition-opacity">
          <ShieldAlert size={14} />
          <p className="text-[9px] font-black uppercase tracking-[0.2em]">
            Tecnologia IA: <span className="text-gray-500 font-bold">Conteúdos gerados artificialmente via Gemini 3. Revise sempre.</span>
          </p>
        </div>
      </footer>

      {success && (
        <div className="fixed bottom-12 right-12 bg-green-600 text-white px-10 py-6 rounded-3xl font-black uppercase tracking-widest shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex items-center gap-4 animate-in slide-in-from-right-12 z-[100]">
          <CheckCircle2 size={24} /> Publicado com Sucesso!
        </div>
      )}
    </div>
  );
};

export default CreateBlog;
