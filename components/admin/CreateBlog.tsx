
import React, { useState, useRef } from 'react';
import { 
  Sparkles, Loader2, PenTool, Zap, BrainCircuit, 
  ShieldCheck, CheckCircle, AlertCircle, RefreshCw, ArrowRight
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
  const [iaPrompt, setIaPrompt] = useState('');
  const [targetCategory, setTargetCategory] = useState('Musculação');
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

  const triggerN8nAutomation = async () => {
    if (!iaPrompt) return;
    
    setLoading(true);
    setErrorMsg('');
    
    try {
      // Chama o serviço que por sua vez chama o Proxy de API
      await aiService.generatePost(iaPrompt, {
        category: targetCategory
      });
      
      setSuccess(true);
      setIaPrompt('');
      
      // Feedback visual e redirecionamento
      setTimeout(() => {
        setSuccess(false);
        onSuccess(); // Vai para a lista de posts
      }, 3500);

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
          onClick={() => { setActiveMode('ia'); setErrorMsg(''); }}
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
          <div className="bg-zinc-900/10 p-12 rounded-[40px] border border-white/5 space-y-8">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-[#cfec0f]">Gerador Cloud</h2>
            
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
                <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-1">Briefing para o n8n</label>
                <textarea
                  value={iaPrompt}
                  onChange={(e) => setIaPrompt(e.target.value)}
                  placeholder="Ex: 5 dicas para melhorar o agachamento..."
                  className="w-full bg-black border border-white/10 rounded-3xl p-8 outline-none focus:border-[#cfec0f] text-lg min-h-[220px] resize-none leading-relaxed transition-all"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 animate-in shake">
                <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
                <p className="text-red-500 text-[10px] font-bold uppercase leading-relaxed">{errorMsg}</p>
              </div>
            )}

            <button
              onClick={triggerN8nAutomation}
              disabled={loading || !iaPrompt}
              className="w-full bg-[#cfec0f] text-black font-black py-6 rounded-2xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#cfec0f]/20 disabled:opacity-30"
            >
              {loading ? <RefreshCw className="animate-spin" size={20} /> : <Zap size={20} />}
              {loading ? "SINCROZINANDO COM n8n..." : "DISPARAR AUTOMAÇÃO"}
            </button>
          </div>

          <div className="flex flex-col justify-center gap-10 p-12 border border-dashed border-white/10 rounded-[40px] bg-zinc-900/5">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-neon/10 rounded-2xl flex items-center justify-center text-neon">
                <BrainCircuit size={32} />
              </div>
              <h3 className="text-white font-black uppercase text-sm italic">Como acompanhar:</h3>
              <p className="text-zinc-500 text-xs font-medium leading-relaxed">
                1. O comando é enviado para o seu n8n Cloud.<br/>
                2. O workflow valida o tema e gera o conteúdo.<br/>
                3. O n8n salva o post no Supabase automaticamente.<br/>
                4. Atualize a página de 'Meus Blogs' em 1-2 minutos para ver o resultado.
              </p>
              <div className="pt-6 border-t border-white/5 space-y-4">
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                  <CheckCircle size={14} className="text-neon" /> Webhook: /blog-generator
                </div>
              </div>
            </div>
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
            <span className="text-sm">Sucesso na Nuvem!</span>
          </div>
          <p className="text-[8px] font-bold text-black/60 uppercase tracking-widest">O n8n confirmou o recebimento.</p>
        </div>
      )}
    </div>
  );
};

export default CreateBlog;
