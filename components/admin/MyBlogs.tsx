
import React, { useEffect, useState } from 'react';
import { 
  Eye, Trash2, BrainCircuit, User, RefreshCw, 
  Clock, Globe, AlertCircle, CheckCircle, Database 
} from 'lucide-react';
import { dbService } from '../../db';
import { usePollServer } from '../../lib/usePollServer';

const MyBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [lastSync, setLastSync] = useState<string>('');
  const [showArchived, setShowArchived] = useState(false);

  const loadBlogs = async (isManual = false) => {
    setLoading(true);
    try {
      // Pequeno delay para permitir que o Supabase/n8n termine a escrita se for um clique logo após publicar
      if (isManual) await new Promise(resolve => setTimeout(resolve, 800));
      
      const saved = await dbService.getBlogs();
      // Por padrão exibimos apenas posts não arquivados
      const filtered = showArchived ? saved : saved.filter((b: any) => !b.archived);
      setBlogs(filtered);
      setLastSync(new Date().toLocaleTimeString('pt-BR'));
      
      if (isManual) {
        setSyncSuccess(true);
        setTimeout(() => setSyncSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Erro ao sincronizar:", err);
    } finally {
      setLoading(false);
    }
  };

  // Usar polling automático para sincronizar com o servidor
  usePollServer({
    url: '/api/posts/sync',
    interval: 5000, // A cada 5 segundos
    enabled: true,
    onSuccess: (data) => {
      if (data.posts && Array.isArray(data.posts)) {
        const filtered = showArchived ? data.posts : data.posts.filter((b: any) => !b.archived);
        setBlogs(filtered);
        setLastSync(new Date().toLocaleTimeString('pt-BR'));
      }
    },
    onError: (error) => {
      console.error('Erro ao sincronizar:', error);
    }
  });

  useEffect(() => {
    loadBlogs();
  }, []);

  // Recarrega quando mudar o filtro de arquivados
  useEffect(() => {
    loadBlogs();
  }, [showArchived]);

  const deleteBlog = async (id: string) => {
    if (confirm('Deseja excluir este registro permanentemente?')) {
      await dbService.deleteBlog(id);
      loadBlogs();
    }
  };

  const toggleArchive = async (id: string, archived: boolean) => {
    const verb = archived ? 'desarquivar' : 'arquivar';
    if (!confirm(`Deseja ${verb} este post?`)) return;
    await dbService.updateBlog(id, { archived: !archived });
    loadBlogs();
  };

  const togglePublish = async (id: string, published: boolean) => {
    const verb = published ? 'despublicar' : 'publicar';
    if (!confirm(`Deseja ${verb} este post?`)) return;
    const updates: any = { published: !published };
    if (!published) updates.publishedAt = new Date().toISOString();
    await dbService.updateBlog(id, updates);
    loadBlogs();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-zinc-900/20 p-8 rounded-[32px] border border-white/5 gap-6">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
            <Database size={14} className="text-[#cfec0f]" /> 
            Consagração de Conteúdo
          </h3>
          <p className="text-[10px] text-zinc-600 font-bold uppercase mt-1">
            {lastSync ? `Última sincronização: ${lastSync}` : 'Sincronize para buscar posts do n8n'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {syncSuccess && (
            <div className="flex items-center gap-2 text-[#cfec0f] text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-right-2">
              <CheckCircle size={14} /> Banco Atualizado
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => loadBlogs(true)} 
              disabled={loading}
              className={`flex items-center gap-3 text-[10px] font-black uppercase px-8 py-4 rounded-2xl transition-all ${
                loading 
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                : 'bg-[#cfec0f] text-black hover:scale-105 shadow-xl shadow-[#cfec0f]/10'
              }`}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> 
              {loading ? 'Sincronizando Templo...' : 'Sincronizar com Banco'}
            </button>

            <button
              onClick={() => setShowArchived(s => !s)}
              title={showArchived ? 'Ocultar Arquivados' : 'Mostrar Arquivados'}
              className="text-[10px] font-black uppercase px-4 py-3 rounded-2xl border border-white/5 bg-black/20 hover:bg-black/30"
            >
              {showArchived ? 'Arquivados: ON' : 'Arquivados: OFF'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-zinc-900/10 rounded-[40px] border border-white/5 overflow-hidden relative">
        {loading && blogs.length > 0 && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10 flex items-center justify-center rounded-[40px]">
            <div className="flex flex-col items-center gap-4">
              <RefreshCw className="animate-spin text-[#cfec0f]" size={32} />
              <p className="text-[#cfec0f] text-[10px] font-black uppercase tracking-[0.3em]">Buscando Novos Registros...</p>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/40 border-b border-white/5">
                <th className="px-8 py-6 text-[10px] font-black uppercase text-zinc-600 tracking-widest">Post / Inteligência</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase text-zinc-600 tracking-widest">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase text-zinc-600 tracking-widest">Publicação</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase text-zinc-600 tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {blogs.map((blog) => {
                const isScheduled = new Date(blog.publishedAt) > new Date();
                return (
                  <tr key={blog.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className={`p-3 rounded-xl border ${blog.source === 'ai' ? 'bg-[#cfec0f]/5 border-[#cfec0f]/20' : 'bg-zinc-800/50 border-white/5'}`}>
                          {blog.source === 'ai' ? (
                            <BrainCircuit size={18} className="text-[#cfec0f]" />
                          ) : (
                            <User size={18} className="text-zinc-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-black italic text-base group-hover:text-[#cfec0f] transition-colors leading-tight">
                            {blog.title || "Sem Título"}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] text-zinc-600 uppercase font-black tracking-widest">{blog.category}</span>
                            <span className="text-zinc-800 text-[8px]">•</span>
                            <span className="text-[9px] text-zinc-700 font-bold italic">{blog.source === 'ai' ? 'n8n Cloud' : 'Manual'}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        {blog.archived ? (
                          <span className="flex items-center gap-2 text-[9px] font-black uppercase px-4 py-1.5 rounded-full bg-zinc-800/10 text-zinc-400 border border-zinc-700/20">
                            <AlertCircle size={10} /> Arquivado
                          </span>
                        ) : isScheduled ? (
                          <span className="flex items-center gap-2 text-[9px] font-black uppercase px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            <Clock size={10} /> Agendado
                          </span>
                        ) : (
                          <span className="flex items-center gap-2 text-[9px] font-black uppercase px-4 py-1.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                            <Globe size={10} /> No Templo
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">
                          {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                        <span className="text-[8px] text-zinc-600 font-bold uppercase">
                          {/* Fix: Changed invalid '2xl' to '2-digit' for hour formatting to satisfy DateTimeFormatOptions */}
                          {new Date(blog.publishedAt || blog.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setShowArchived(s => !s)}
                          title={showArchived ? 'Ocultar Arquivados' : 'Mostrar Arquivados'}
                          className="p-3 bg-black border border-white/5 rounded-xl text-zinc-500 hover:text-[#cfec0f] transition-all mr-2"
                        >
                          {showArchived ? 'Arquivados: ON' : 'Arquivados: OFF'}
                        </button>
                        <button 
                          title="Visualizar no Site"
                          className="p-3 bg-black border border-white/5 hover:border-[#cfec0f]/50 rounded-xl text-zinc-500 hover:text-[#cfec0f] transition-all"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => togglePublish(blog.id, blog.published)}
                          title={blog.published ? 'Despublicar' : 'Publicar'}
                          className={`p-3 bg-black border border-white/5 rounded-xl text-zinc-500 hover:text-${blog.published ? 'red' : 'green'}-500 transition-all`}
                        >
                          {blog.published ? 'Despublicar' : 'Publicar'}
                        </button>

                        <button
                          onClick={() => toggleArchive(blog.id, !!blog.archived)}
                          title={blog.archived ? 'Desarquivar' : 'Arquivar'}
                          className={`p-3 bg-black border border-white/5 rounded-xl text-zinc-500 hover:text-${blog.archived ? 'green' : 'yellow'}-400 transition-all`}
                        >
                          {blog.archived ? 'Desarquivar' : 'Arquivar'}
                        </button>

                        <button 
                          onClick={() => deleteBlog(blog.id)} 
                          title="Excluir Permanentemente"
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
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-6 bg-zinc-900/50 rounded-full border border-dashed border-white/10">
                        <AlertCircle size={40} className="text-zinc-800" />
                      </div>
                      <p className="text-zinc-700 font-black uppercase text-xs tracking-[0.3em] max-w-xs leading-relaxed">
                        Nenhum registro encontrado. Se você acabou de publicar via n8n, aguarde alguns segundos e clique em sincronizar.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-8 bg-blue-500/5 border border-blue-500/10 rounded-[32px] flex items-start gap-4">
        <AlertCircle size={18} className="text-blue-500 shrink-0 mt-1" />
        <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
          <strong>Dica do Templo:</strong> O botão de sincronização limpa o cache local e força uma revalidação direta com o Supabase. Utilize-o sempre que uma automação externa (n8n) finalizar um processamento para garantir que os dados estejam 100% atualizados.
        </p>
      </div>
    </div>
  );
};

export default MyBlogs;
