
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, List, Calendar, Sparkles, 
  Settings as SettingsIcon, LogOut, Lock, 
  ShieldCheck, ArrowRight, Loader2 
} from 'lucide-react';
import DashboardHome from './DashboardHome';
import CreateBlog from './CreateBlog';
import MyBlogs from './MyBlogs';
import ManageEvents from './ManageEvents';
import SettingsPage from './SettingsPage';

interface AdminLayoutProps {
  exitAdmin: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ exitAdmin }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'create' | 'list' | 'event' | 'settings'>('dashboard');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Em produção, isso seria validado via API/JWT
    // A senha padrão para o projeto Holy Spirit (conforme contexto)
    setTimeout(() => {
      if (password === 'holy0777') {
        setIsAuthenticated(true);
        sessionStorage.setItem('hs_admin_session', 'active');
      } else {
        setError('Acesso negado. Senha incorreta.');
      }
      setIsLoading(false);
    }, 800);
  };

  useEffect(() => {
    if (sessionStorage.getItem('hs_admin_session') === 'active') {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 selection:bg-neon selection:text-black">
        <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="text-center">
            <div className="inline-block p-4 bg-neon/10 rounded-3xl mb-6">
              <Lock className="text-neon" size={40} />
            </div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">
              HOLY<span className="text-neon">GATE</span>
            </h1>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">
              Acesso Restrito • Administradores
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative group">
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a chave do templo"
                className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-5 text-center text-white outline-none focus:border-neon/50 transition-all placeholder:text-zinc-700"
                autoFocus
              />
              {error && <p className="text-red-500 text-[9px] font-black uppercase mt-2 text-center tracking-widest">{error}</p>}
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-neon text-black font-black py-5 rounded-2xl uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-neon/20"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <ShieldCheck size={18} />}
              {isLoading ? 'VALIDANDO...' : 'ENTRAR NO PAINEL'}
            </button>
          </form>

          <button 
            onClick={exitAdmin}
            className="w-full text-zinc-600 hover:text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
          >
            Voltar para o Site <ArrowRight size={12} />
          </button>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard', label: 'Início', icon: <LayoutDashboard size={20} /> },
    { id: 'create', label: 'Escritora IA', icon: <Sparkles size={20} /> },
    { id: 'list', label: 'Meus Blogs', icon: <List size={20} /> },
    { id: 'event', label: 'Eventos', icon: <Calendar size={20} /> },
    { id: 'settings', label: 'Configurações', icon: <SettingsIcon size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#050505] text-white selection:bg-[#cfec0f] selection:text-black">
      <aside className="w-64 border-r border-white/5 bg-black p-6 flex flex-col fixed h-full z-20">
        <div className="flex items-center gap-2 mb-12">
          <div className="w-6 h-6 bg-[#cfec0f] rounded-sm rotate-45"></div>
          <span className="text-xl font-black tracking-tighter uppercase">
            Holy<span className="text-[#cfec0f]">Admin</span>
          </span>
        </div>

        <nav className="flex-grow space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 group ${
                activeTab === item.id 
                  ? 'bg-[#cfec0f] text-black' 
                  : 'text-gray-500 hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <button 
          onClick={() => {
            sessionStorage.removeItem('hs_admin_session');
            exitAdmin();
          }}
          className="flex items-center gap-4 px-4 py-3 text-gray-500 hover:text-red-500 transition-colors text-sm font-bold border-t border-white/5 pt-6"
        >
          <LogOut size={20} />
          Encerrar Sessão
        </button>
      </aside>

      <main className="flex-grow ml-64 p-10 min-h-screen">
        <header className="flex justify-between items-center mb-10 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">
              {menuItems.find(i => i.id === activeTab)?.label}
            </h1>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">
              Templo Holy Spirit • Gestão Editorial
            </p>
          </div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {activeTab === 'dashboard' && <DashboardHome />}
          {activeTab === 'create' && <CreateBlog onSuccess={() => setActiveTab('list')} />}
          {activeTab === 'list' && <MyBlogs />}
          {activeTab === 'event' && <ManageEvents />}
          {activeTab === 'settings' && <SettingsPage />}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
