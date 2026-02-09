
import React, { useEffect, useState, useRef } from 'react';
import { 
  Eye, Trash2, BrainCircuit, User, RefreshCw, 
  Globe, Database, Rocket, EyeOff, FileText, Edit3, X, Save, Camera
} from 'lucide-react';
import { dbService } from '../../db';

const MyBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastSync, setLastSync] = useState<string>('');
  
  // Estado para Edição
  const [editingBlog, setEditingBlog] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const freshData = await dbService.getBlogs();
      setBlogs(freshData);
      setLastSync(new Date().toLocaleTimeString('pt-BR'));
    } catch (err) {
      console.error("Erro ao sincronizar blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const deleteBlog = async (id: string) => {
    if (confirm('Deseja excluir este registro permanentemente do Templo?')) {
      await dbService.deleteBlog(id);
      fetchBlogs();
    }
  };

  const togglePublish = async (blog: any) => {
    const isPublished = !!blog.published_at;
    const newPublishedAt = isPublished ? null : new Date().toISOString();
    
    setLoading(true);
    try {
      await dbService.updateBlog(blog.id, { published_at: newPublishedAt });
      await fetchBlogs();
    } catch (err: any) {
      alert(`Erro ao alterar status: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingBlog) return;
    setLoading(true);
    try {
      await dbService.updateBlog(editingBlog.id, editingBlog);
      setEditingBlog(null);
      await fetchBlogs();
    } catch (err) {
      alert("Erro ao salvar alterações.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingBlog({ ...editingBlog, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* MODAL DE EDIÇÃO */}
      {editingBlog && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-zinc-950 border border-white/10 w-full max-w-5xl rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Edit3 className="text-neon" size={24} />
                <h2 className="text-xl font-black uppercase italic text-white">Refinar Postagem</h2>
              </div>
              <button onClick={() => setEditingBlog(null)} className="text-zinc-500 hover:text-white"><X size={28} /></button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-10 space-y-8 custom-scrollbar">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-2">Título do Post</label>
                    <input 
                      value={editingBlog.title}
                      onChange={e => setEditingBlog({...editingBlog, title: e.target.value})}
                      className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-neon text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-2">Categoria</label>
                    <select 
                      value={editingBlog.category}
                      onChange={e => setEditingBlog({...editingBlog, category: e.target.value})}
                      className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-neon"
                    >
                      <option>Musculação</option>
                      <option>Nutrição</option>
                      <option>Espiritualidade</option>
                      <option>Lifestyle</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-2">Resumo (Excerpt)</label>
                    <textarea 
                      value={editingBlog.excerpt}
                      onChange={e => setEditingBlog({...editingBlog, excerpt: e.target.value})}
                      rows={3}
                      className="w-full bg-black border border-white/10 rounded-2xl p-6 outline-none focus:border-neon resize-none text-sm text-zinc-400"
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
                        <div className="flex flex-col items-center text-zinc-700">
                          <Camera size={32} />
                          <span className="text-[8px] font-black uppercase mt-2">Adicionar Capa</span>
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <Camera className="text-neon" size={32} />
                      </div>
                      <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-2">Conteúdo HTML/Texto</label>
                <textarea 
                  value={editingBlog.content}
                  onChange={e => setEditingBlog({...editingBlog, content: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-2xl p-10 outline-none focus:border-neon text-sm min-h-[400px] leading-loose text-zinc-400 font-mono"
                />
              </div>
            </div>

            <div className="p-8 border-t border-white/5 flex justify-end gap-4 bg-black/40">
              <button onClick={() => setEditingBlog(null)} className="px-8 py-4 rounded-2xl text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-all">Descartar</button>
              <button 
                onClick={handleUpdate}
                disabled={loading}
                className="bg-neon text-black font-black px-12 py-4 rounded-2xl text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-neon/20"
              >
                {loading ? <RefreshCw className="animate-spin" size={14} /> : <Save size={14} />}
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center bg-zinc-900/30 p-8 rounded-[32px] border border-white/5">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
            <Database size={14} className="text-neon" /> 
            Meus Blogs Publicados
          </h3>
          <p className="text-[10px] text-zinc-600 font-bold uppercase mt-1">Sincronizado: {lastSync || 'Pendente'}</p>
        </div>
        <button onClick={fetchBlogs} className="p-3 bg-neon/10 text-neon rounded-xl hover:bg-neon hover:text-black transition-all">
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>
      
      <div className="bg-zinc-900/10 rounded-[40px] border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-black/40 border-b border-white/5 text-[10px] font-black uppercase text-zinc-600 tracking-widest">
            <tr>
              <th className="px-8 py-6">Postagem</th>
              <th className="px-8 py-6">Status</th>
              <th className="px-8 py-6">Origem</th>
              <th className="px-8 py-6 text-right">Gerenciar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {blogs.map((blog) => {
              const isPublished = !!blog.published_at;
              const hasImage = blog.image && blog.image.length > 20;
              
              return (
                <tr key={blog.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-black border border-white/5 shrink-0 flex items-center justify-center">
                        {hasImage ? (
                          <img src={blog.image} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <FileText size={16} className="text-zinc-800" />
                        )}
                      </div>
                      <div>
                        <p className="font-black italic text-white group-hover:text-neon transition-colors truncate max-w-[300px]">{blog.title}</p>
                        <p className="text-[9px] text-zinc-600 uppercase font-black">{blog.category} • /{blog.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {isPublished ? (
                      <span className="flex items-center gap-2 text-[9px] font-black uppercase px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/10 w-fit">
                        <Globe size={10} /> Público
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-[9px] font-black uppercase px-3 py-1 rounded-full bg-zinc-800 text-zinc-500 w-fit">
                        <EyeOff size={10} /> Rascunho
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500">
                      {blog.source === 'ai' ? <BrainCircuit size={14} className="text-neon" /> : <User size={14} />}
                      {blog.source === 'ai' ? 'IA' : 'Manual'}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditingBlog(blog)} className="p-3 bg-zinc-900 text-zinc-400 hover:text-white rounded-xl transition-all border border-white/5" title="Editar">
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => togglePublish(blog)}
                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase flex items-center gap-2 transition-all ${isPublished ? 'bg-zinc-800 text-zinc-500' : 'bg-neon text-black'}`}
                      >
                        {isPublished ? <EyeOff size={14} /> : <Rocket size={14} />}
                        {isPublished ? 'Ocultar' : 'Lançar'}
                      </button>
                      <button onClick={() => deleteBlog(blog.id)} className="p-3 bg-black text-zinc-700 hover:text-red-500 rounded-xl transition-all border border-white/5">
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
  );
};

export default MyBlogs;
