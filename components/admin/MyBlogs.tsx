
import React, { useEffect, useState } from 'react';
import { 
  Eye, Trash2, BrainCircuit, User, RefreshCw, 
  Globe, Database, Search, Rocket, EyeOff, FileText
} from 'lucide-react';
import { dbService } from '../../db';

const MyBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success'>('idle');
  const [lastSync, setLastSync] = useState<string>('');

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
    
    // A única fonte da verdade para publicação agora é published_at
    const isCurrentlyPublished = blog.published_at !== null && blog.published_at !== undefined;
    const newPublishedAt = isCurrentlyPublished ? null : new Date().toISOString();
    
    setLoading(true);
    try {
      // Isola a ação de publicação apenas na tabela posts usando o campo de data
      await dbService.updateBlog(blog.id, { 
        published_at: newPublishedAt 
      });
      await performDeepSync();
    } catch (err: any) {
      console.error("Toggle Publish Error (published_at):", err);
      alert(`Erro ao alterar status: ${err.message || 'Verifique o console para detalhes.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
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
            className={`flex items-center gap-3 text-[10px] font-black uppercase px-8 py-4 rounded-2xl transition-all relative overflow-hidden group/btn ${
              loading 
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5' 
              : 'bg-[#cfec0f] text-black hover:scale-105 shadow-xl shadow-[#cfec0f]/10'
            }`}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : 'group-hover/btn:rotate-180 transition-transform duration-500'} /> 
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
                <th className="px-8 py-6 text-[10px] font-black uppercase text-zinc-600 tracking-widest">Status de Publicação</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase text-zinc-600 tracking-widest">Origem</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase text-zinc-600 tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {blogs.map((blog) => {
                // Verificação estrita pelo campo de data
                const isPublished = blog.published_at !== null && blog.published_at !== undefined;
                const pDate = blog.published_at;
                
                return (
                  <tr key={blog.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-black border border-white/5 shrink-0">
                          <img src={blog.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="" />
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
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center gap-2 text-[9px] font-black uppercase px-4 py-1.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/10 w-fit">
                            <Globe size={10} /> Publicado
                          </span>
                          <span className="text-[8px] text-zinc-600 font-bold uppercase ml-2 italic">
                            Desde {new Date(pDate).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      ) : (
                        <span className="flex items-center gap-2 text-[9px] font-black uppercase px-4 py-1.5 rounded-full bg-zinc-800 text-zinc-500 border border-white/5 w-fit">
                          <FileText size={10} /> Rascunho Interno
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
                          onClick={() => togglePublish(blog)}
                          disabled={loading}
                          className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg ${
                            !isPublished 
                              ? 'bg-[#cfec0f] text-black hover:scale-105 shadow-[#cfec0f]/10' 
                              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/5'
                          }`}
                        >
                          {isPublished ? <EyeOff size={14} /> : <Rocket size={14} />}
                          {isPublished ? 'Despublicar' : 'Lançar no Templo'}
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
              {blogs.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-40">
                      <Search size={48} className="text-zinc-700" />
                      <p className="text-zinc-600 font-black uppercase text-xs tracking-[0.3em]">Nenhuma palavra sagrada encontrada.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyBlogs;
