
import React, { useEffect, useState, useRef } from 'react';
import { 
  Eye, Trash2, BrainCircuit, User, RefreshCw, 
  Globe, Database, Search, Rocket, EyeOff, FileText, Edit3, X, Save, Camera
} from 'lucide-react';
import { dbService } from '../../db';

const MyBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success'>('idle');
  const [lastSync, setLastSync] = useState<string>('');
  
  // Edit State
  const [editingBlog, setEditingBlog] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const performDeepSync = async () => {
    setLoading(true);
    setSyncStatus('syncing');
    
    try {
      const freshData = await dbService.getBlogs();
      setBlogs(freshData);
      
      setLastSync(new Date().toLocaleTimeString('pt-BR'));
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (err) {
      console.error("Erro na sincronização:", err);
      setSyncStatus('idle');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performDeepSync();
  }, []);

  const deleteBlog = async (id: string) => {
    if (confirm('Deseja excluir este registro permanentemente?')) {
      await dbService.deleteBlog(id);
      performDeepSync();
    }
  };

  const togglePublish = async (blog: any) => {
    if (!blog.id) return;
    const isCurrentlyPublished = blog.published_at !== null && blog.published_at !== undefined;
    const newPublishedAt = isCurrentlyPublished ? null : new Date().toISOString();
    
    setLoading(true);
    try {
      await dbService.updateBlog(blog.id, { published_at: newPublishedAt });
      await performDeepSync();
    } catch (err: any) {
      console.error("Toggle Publish Error:", err);
      alert(`Erro ao alterar status: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBlog = async () => {
    if (!editingBlog) return;
    setLoading(true);
    try {
      await dbService.updateBlog(editingBlog.id, {
        title: editingBlog.title,
        excerpt: editingBlog.excerpt,
        content: editingBlog.content,
        category: editingBlog.category,
        image: editingBlog.image
      });
      setEditingBlog(null);
      await performDeepSync();
    } catch (err) {
      console.error("Update Error:", err);
      alert("Erro ao salvar alterações.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditingBlog({ ...editingBlog, image: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Editor Modal Overlay */}
      {editingBlog && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-zinc-950 border border-white/10 w-full max-w-5xl rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="bg-[#cfec0f]/10 p-3 rounded-xl text-[#cfec0f]"><Edit3 size={20} /></div>
                 <h2 className="text-xl font-black uppercase italic text-white">Consertar Palavra Sagrada</h2>
              </div>
              <button onClick={() => setEditingBlog(null)} className="text-zinc-500 hover:text-white p-2 transition-colors"><X size={24} /></button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-10 space-y-8 custom-scrollbar">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-2">Título do Post</label>
                    <input 
                      value={editingBlog.title}
                      onChange={e => setEditingBlog({...editingBlog, title: e.target.value})}
                      className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-neon text-lg font-black italic"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-2">Resumo (Excerpt)</label>
                    <textarea 
                      value={editingBlog.excerpt}
                      onChange={e => setEditingBlog({...editingBlog, excerpt: e.target.value})}
                      className="w-full bg-black border border-white/10 rounded-2xl p-6 outline-none focus:border-neon text-sm resize-none"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-2">Conteúdo HTML</label>
                    <textarea 
                      value={editingBlog.content}
                      onChange={e => setEditingBlog({...editingBlog, content: e.target.value})}
                      className="w-full bg-black border border-white/10 rounded-2xl p-8 outline-none focus:border-neon text-sm min-h-[400px] leading-relaxed font-mono"
                    />
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-2">Capa do Blog</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-video bg-black border border-white/10 rounded-3xl overflow-hidden cursor-pointer group relative flex items-center justify-center"
                    >
                      {editingBlog.image ? (
                        <img src={editingBlog.image} className="w-full h-full object-cover group-hover:opacity-40 transition-all" alt="Preview" />
                      ) : (
                        <div className="text-zinc-700 flex flex-col items-center gap-2">
                          <Camera size={32} />
                          <span className="text-[8px] font-black uppercase">Adicionar Imagem</span>
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <Camera className="text-[#cfec0f]" size={32} />
                      </div>
                      <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-2">Categoria</label>
                    <select 
                      value={editingBlog.category}
                      onChange={e => setEditingBlog({...editingBlog, category: e.target.value})}
                      className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-neon text-sm"
                    >
                      <option>Musculação</option>
                      <option>Nutrição</option>
                      <option>Espiritualidade</option>
                      <option>Lifestyle</option>
                    </select>
                  </div>
                  
                  <div className="p-6 bg-[#cfec0f]/5 border border-[#cfec0f]/10 rounded-3xl space-y-4">
                    <p className="text-[10px] text-zinc-400 leading-relaxed font-medium">As alterações serão refletidas instantaneamente para todos os fiéis no feed público.</p>
                    <button 
                      onClick={handleUpdateBlog}
                      disabled={loading}
                      className="w-full bg-[#cfec0f] text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] shadow-xl shadow-[#cfec0f]/20 disabled:opacity-50"
                    >
                      {loading ? <RefreshCw className="animate-spin" /> : <Save size={18} />}
                      {loading ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-zinc-900/30 p-8 rounded-[32px] border border-white/5 gap-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-neon/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-neon/10 transition-all duration-1000"></div>
        
        <div className="relative z-10">
          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
            <Database size={14} className="text-[#cfec0f]" /> 
            Consagração de Conteúdo
          </h3>
          <p className="text-[10px] text-zinc-600 font-bold uppercase mt-1">
            {lastSync ? `Última atualização: ${lastSync}` : 'Sincronize para ver as revelações mais recentes'}
          </p>
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <button 
            onClick={performDeepSync} 
            disabled={loading}
            className="flex items-center gap-3 text-[10px] font-black uppercase px-8 py-4 rounded-2xl bg-[#cfec0f] text-black hover:scale-105 shadow-xl shadow-[#cfec0f]/10 transition-all"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> 
            {loading ? 'Escaneando o Templo...' : 'Sincronizar Banco'}
          </button>
        </div>
      </div>
      
      <div className="bg-zinc-900/10 rounded-[40px] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/40 border-b border-white/5">
                <th className="px-8 py-6 text-[10px] font-black uppercase text-zinc-600 tracking-widest">Postagem</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase text-zinc-600 tracking-widest">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase text-zinc-600 tracking-widest">Origem</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase text-zinc-600 tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {blogs.map((blog) => {
                const isPublished = blog.published_at !== null && blog.published_at !== undefined;
                const hasImage = blog.image && blog.image.length > 10;
                
                return (
                  <tr key={blog.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-xl overflow-hidden bg-black border border-white/5 shrink-0 flex items-center justify-center ${!hasImage ? 'border-dashed' : ''}`}>
                          {hasImage ? (
                            <img src={blog.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="" />
                          ) : (
                            <FileText size={16} className="text-zinc-800" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-black italic text-base group-hover:text-[#cfec0f] transition-colors leading-tight truncate max-w-[300px]">
                            {blog.title || "Sem Título"}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                             <span className="text-[9px] text-zinc-600 uppercase font-black tracking-widest">{blog.category}</span>
                             <span className="text-zinc-800 text-[8px]">•</span>
                             <span className="text-[8px] text-zinc-700 font-bold uppercase tracking-tighter">/{blog.slug}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {isPublished ? (
                        <span className="flex items-center gap-2 text-[9px] font-black uppercase px-4 py-1.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/10 w-fit">
                          <Globe size={10} /> Publicado
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-[9px] font-black uppercase px-4 py-1.5 rounded-full bg-zinc-800 text-zinc-500 border border-white/5 w-fit">
                          <FileText size={10} /> Rascunho
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <div className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-widest ${blog.source === 'ai' ? 'text-[#cfec0f]' : 'text-zinc-500'}`}>
                        {blog.source === 'ai' ? <BrainCircuit size={14} /> : <User size={14} />}
                        {blog.source === 'ai' ? 'IA' : 'Manual'}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setEditingBlog(blog)}
                          className="p-3 bg-zinc-900 border border-white/5 hover:border-white/20 rounded-xl text-zinc-400 hover:text-white transition-all"
                          title="Editar Post"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => togglePublish(blog)}
                          disabled={loading}
                          className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                            !isPublished ? 'bg-neon text-black hover:scale-105' : 'bg-zinc-900 text-zinc-400'
                          }`}
                        >
                          {isPublished ? <EyeOff size={14} /> : <Rocket size={14} />}
                          {isPublished ? 'Ocultar' : 'Lançar'}
                        </button>
                        <button 
                          onClick={() => deleteBlog(blog.id)} 
                          className="p-3 bg-black border border-white/5 hover:border-red-500/50 rounded-xl text-zinc-600 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyBlogs;
