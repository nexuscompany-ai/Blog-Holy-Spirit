
import React, { useState, useRef } from 'react';
import { 
  Sparkles, Loader2, CheckCircle2, 
  PenTool, Zap, BrainCircuit, Camera, 
  Calendar, ShieldCheck
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
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
  const [articleData, setArticleData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Musculação',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
    publishedAt: new Date().toISOString().split('T')[0],
    published: true,
    source: 'ia' as 'manual' | 'ai'
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.url) {
        setArticleData(prev => ({ ...prev, image: data.url }));
      }
    } catch (error) {
      alert("Falha no upload da imagem para o Supabase.");
    } finally {
      setUploading(false);
    }
  };

  const generateWithIA = async () => {
    if (!iaPrompt) return;
    setLoading(true);
    
    try {
      // Initialize GoogleGenAI client with the required process.env.API_KEY format
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Gere um artigo de alta performance sobre: ${iaPrompt}`,
        config: {
          // Incorporating the specified professional blog content creator system prompt rules
          systemInstruction: `Você é um Criador de Conteúdo Profissional para Blog de Academia, especialista em marketing, SEO e mentalidade.
          Objetivo: Gerar artigos que atraiam tráfego e posicionem a Holy Spirit como referência.
          
          ESTRUTURA OBRIGATÓRIA:
          1. Título SEO (H1)
          2. Introdução envolvente (dor/desejo)
          3. Subtítulos (H2/H3) escaneáveis
          4. Conteúdo técnico e prático
          5. CTA (Chamada para ação) final
          
          TOM: Profissional, motivador e inspirador.
          REGRAS: Parágrafos curtos, linguagem humana e autoridade.
          
          Retorne obrigatoriamente um JSON com: title, excerpt, content, category.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              excerpt: { type: Type.STRING },
              content: { type: Type.STRING },
              category: { type: Type.STRING }
            },
            required: ["title", "excerpt", "content", "category"]
          }
        }
      });

      // Properly extract the text property from GenerateContentResponse
      const result = JSON.parse(response.text || '{}');
      setArticleData(prev => ({ ...prev, ...result, source: 'ai' }));
      setStep('editing');
    } catch (error) {
      console.error("Gemini Generation Error:", error);
      alert("Falha na conexão com a Inteligência Holy Spirit.");
    } finally {
      setLoading(false);
    }
  };

  const publishArticle = async () => {
    setLoading(true);
    try {
      await dbService.saveBlog({
        ...articleData,
        source: activeMode === 'ia' ? 'ai' : 'manual'
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSuccess();
      }, 2000);
    } catch (error) {
      alert("Erro ao salvar no banco de dados.");
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
          <Sparkles size={14} /> IA Orchestrator
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
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-[#cfec0f]">Briefing IA</h2>
            <textarea
              value={iaPrompt}
              onChange={(e) => setIaPrompt(e.target.value)}
              placeholder="Descreva o tema do artigo..."
              className="w-full bg-black border border-white/10 rounded-3xl p-8 outline-none focus:border-[#cfec0f] text-lg min-h-[250px] resize-none"
            />
            <button
              onClick={generateWithIA}
              disabled={loading || !iaPrompt}
              className="w-full bg-[#cfec0f] text-black font-black py-6 rounded-2xl flex items-center justify-center gap-4 hover:scale-[1.02] shadow-xl disabled:opacity-30"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Zap size={18} />}
              {loading ? "PROCESSANDO..." : "GERAR ARTIGO"}
            </button>
          </div>
          <div className="flex flex-col justify-center items-center text-center p-12 border border-dashed border-white/10 rounded-[40px]">
            <BrainCircuit size={64} className="text-[#cfec0f]/20 mb-6" />
            <p className="text-gray-500 uppercase font-black text-xs tracking-widest">IA conectada ao Templo de Conhecimento Holy.</p>
          </div>
        </div>
      )}

      {step === 'editing' && (
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <input 
              value={articleData.title} 
              onChange={e => setArticleData({...articleData, title: e.target.value})} 
              className="w-full bg-zinc-900/20 border border-white/5 rounded-2xl px-8 py-6 text-2xl font-black italic outline-none focus:border-[#cfec0f]"
            />
            <textarea 
              value={articleData.content} 
              onChange={e => setArticleData({...articleData, content: e.target.value})} 
              className="w-full bg-zinc-900/20 border border-white/5 rounded-3xl p-10 text-sm leading-relaxed min-h-[500px] outline-none focus:border-[#cfec0f]"
            />
          </div>

          <div className="space-y-8">
            <div className="bg-zinc-900/20 p-8 rounded-[40px] border border-white/5 space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#cfec0f]">Metadados & Capa</h4>
              
              <div className="aspect-video bg-black border border-white/5 rounded-3xl overflow-hidden cursor-pointer group relative flex items-center justify-center" onClick={() => fileInputRef.current?.click()}>
                {uploading ? <Loader2 className="animate-spin text-[#cfec0f]" /> : (
                  <>
                    <img src={articleData.image} className="w-full h-full object-cover group-hover:opacity-40 transition-all" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      <Camera className="text-[#cfec0f]" />
                    </div>
                  </>
                )}
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
              </div>

              <div className="space-y-4">
                <input type="date" value={articleData.publishedAt} onChange={e => setArticleData({...articleData, publishedAt: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs outline-none" />
                <select value={articleData.category} onChange={e => setArticleData({...articleData, category: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs outline-none">
                  <option>Musculação</option>
                  <option>Nutrição</option>
                  <option>Espiritualidade</option>
                  <option>Lifestyle</option>
                </select>
              </div>

              <button 
                onClick={publishArticle}
                disabled={loading || uploading}
                className="w-full bg-[#cfec0f] text-black font-black py-5 rounded-2xl text-[10px] uppercase tracking-widest hover:scale-[1.02] shadow-xl disabled:opacity-30"
              >
                {loading ? "SALVANDO..." : "PUBLICAR NO BLOG"}
              </button>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="fixed bottom-12 right-12 bg-green-600 text-white px-10 py-6 rounded-3xl font-black uppercase tracking-widest shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-12 z-[100]">
          <ShieldCheck size={24} /> Registrado no Templo!
        </div>
      )}
    </div>
  );
};

export default CreateBlog;
