
import React, { useEffect, useState, useRef } from 'react';
import { 
  Trash2, RefreshCw, 
  Globe, Database, Rocket, EyeOff, FileText, Edit3, X, Save, Camera
} from 'lucide-react';
import { dbService } from '../../db';

const MyBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Estado para Edição
  const [editingBlog, setEditingBlog] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const freshData = await dbService.getBlogs();
      setBlogs(freshData);
    } catch (err) {
      console.error("Erro ao sincronizar artigos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const deleteBlog = async (id: string) => {
    if (confirm('Deseja excluir este artigo permanentemente?')) {
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
      alert(`Erro: ${err.message}`);
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
      alert("Falha ao salvar alterações. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingBlog({ ...editingBlog, image_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {editingBlog && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-zinc-950 border border-white/10 w-full max-w-5xl rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-xl font-black uppercase italic text-white flex items-center gap-3">
                <Edit3 className="text-neon" size={20} /> Editar Artigo Selecionado
              </h2>
              <button onClick={() => setEditingBlog(null)} className="text-zinc-500 hover:text-white"><X size={28} /></button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-10 space-y-8 custom-scrollbar">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-2">Título do Artigo</label>
                    <input 
                      value={editingBlog.title}
                      onChange={e => setEditingBlog({...editingBlog, title: e.target.value})}
                      className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-2">Foto de Capa</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-video bg-black border border-white/10 rounded-3xl overflow-hidden cursor-pointer relative flex items-center justify-center"
                    >
                      {editingBlog.image_url ? (
                        <img src={editingBlog.image_url} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <Camera className="text-zinc-700" size={32} />
                      )}
                      <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-2">Conteúdo</label>
                    <textarea 
                      value={editingBlog.content}
                      onChange={e => setEditingBlog({...editingBlog, content: e.target.value})}
                      className="w-full bg-black border border-white/10 rounded-2xl p-6 outline-none text-sm min-h-[300px] leading-relaxed text-zinc-400 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-white/5 flex justify-end gap-4">
              <button onClick={() => setEditingBlog(null)} className="px-8 py-4 rounded-2xl text-[10px] font-black uppercase text-zinc-500">Descartar</button>
              <button 
                onClick={handleUpdate}
                disabled={loading}
                className="bg-neon text-black font-black px-12 py-4 rounded-2xl text-[10px] uppercase shadow-xl shadow-neon/20"
              >
                {loading ? "SALVANDO..." : "ATUALIZAR ARTIGO"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center bg-zinc-900/30 p-8 rounded-[32px] border border-white/5">
        <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
          <Database size={14} className="text-neon" /> Gerenciar Feed do Site
        </h3>
        <button onClick={fetchBlogs} className="p-3 bg-neon/10 text-neon rounded-xl hover:bg-neon hover:text-black transition-all">
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>
      
      <div className="bg-zinc-900/10 rounded-[40px] border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-black/40 border-b border-white/5 text-[10px] font-black uppercase text-zinc-600 tracking-widest">
            <tr>
              <th className="px-8 py-6">Título do Artigo</th>
              <th className="px-8 py-6">Status no Site</th>
              <th className="px-8 py-6 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {blogs.map((blog) => {
              const isPublished = !!blog.published_at;
              return (
                <tr key={blog.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-black border border-white/5">
                        {blog.image_url ? <img src={blog.image_url} className="w-full h-full object-cover" /> : <FileText className="p-3 text-zinc-800" />}
                      </div>
                      <div>
                        <p className="font-black italic text-white group-hover:text-neon transition-colors truncate max-w-[300px]">{blog.title}</p>
                        <p className="text-[9px] text-zinc-600 uppercase font-black">{blog.source === 'ai' ? 'Criado pelo Sistema' : 'Escrita Manual'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {isPublished ? (
                      <span className="text-[9px] font-black uppercase px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/10">Público</span>
                    ) : (
                      <span className="text-[9px] font-black uppercase px-3 py-1 rounded-full bg-zinc-800 text-zinc-500">Rascunho Interno</span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right flex justify-end gap-2">
                    <button onClick={() => setEditingBlog(blog)} className="p-3 bg-zinc-900 text-zinc-400 hover:text-white rounded-xl"><Edit3 size={16} /></button>
                    <button onClick={() => togglePublish(blog)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase ${isPublished ? 'bg-zinc-800' : 'bg-neon text-black'}`}>
                      {isPublished ? <EyeOff size={14} /> : <Rocket size={14} />}
                    </button>
                    <button onClick={() => deleteBlog(blog.id)} className="p-3 bg-black text-zinc-700 hover:text-red-500 rounded-xl"><Trash2 size={16} /></button>
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
