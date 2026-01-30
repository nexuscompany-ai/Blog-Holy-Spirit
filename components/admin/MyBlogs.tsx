
import React, { useEffect, useState } from 'react';
import { Eye, Trash2, BrainCircuit, User, RefreshCw, Clock, Globe } from 'lucide-react';
import { BlogPost } from '../BlogSection';
import { dbService } from '../../db';

const MyBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const saved = await dbService.getBlogs();
      setBlogs(saved);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const deleteBlog = async (id: string) => {
    if (confirm('Deseja excluir este registro permanentemente?')) {
      await dbService.deleteBlog(id);
      loadBlogs();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-zinc-900/20 p-6 rounded-[32px] border border-white/5">
        <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500">Gestão de Conteúdo</h3>
        <button 
          onClick={loadBlogs} 
          disabled={loading}
          className="flex items-center gap-3 text-[10px] font-black uppercase text-[#cfec0f] hover:bg-[#cfec0f]/10 px-6 py-3 rounded-xl transition-all"
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> 
          Sincronizar Banco
        </button>
      </div>
      
      <div className="bg-zinc-900/10 rounded-[40px] border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-black/40 border-b border-white/5">
              <th className="px-8 py-6 text-[10px] font-black uppercase text-zinc-600 tracking-widest">Título / Origem</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase text-zinc-600 tracking-widest">Status</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase text-zinc-600 tracking-widest">Data Publicação</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase text-zinc-600 tracking-widest text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {blogs.map((blog) => {
              const isScheduled = new Date(blog.publishedAt) > new Date();
              return (
                <tr key={blog.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-black rounded-lg">
                        {blog.source === 'ai' ? <BrainCircuit size={14} className="text-[#cfec0f]" /> : <User size={14} className="text-zinc-500" />}
                      </div>
                      <div>
                        <p className="font-bold text-sm group-hover:text-[#cfec0f] transition-colors">{blog.title}</p>
                        <p className="text-[9px] text-zinc-600 uppercase font-black">{blog.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      {isScheduled ? (
                        <span className="flex items-center gap-2 text-[9px] font-black uppercase px-3 py-1 rounded-full bg-blue-500/10 text-blue-400">
                          <Clock size={10} /> Agendado
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-[9px] font-black uppercase px-3 py-1 rounded-full bg-green-500/10 text-green-400">
                          <Globe size={10} /> Publicado
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                    {new Date(blog.publishedAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3">
                      <button className="p-2.5 hover:bg-black rounded-xl text-zinc-500 transition-all"><Eye size={16} /></button>
                      <button onClick={() => deleteBlog(blog.id)} className="p-2.5 hover:bg-red-500/10 rounded-xl text-zinc-600 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {blogs.length === 0 && !loading && (
              <tr>
                <td colSpan={4} className="px-8 py-24 text-center">
                  <p className="text-zinc-700 font-black uppercase text-xs tracking-[0.3em]">O Templo ainda não possui registros.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyBlogs;
