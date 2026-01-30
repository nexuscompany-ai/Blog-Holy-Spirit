
import React, { useState } from 'react';
import { ShieldCheck, Loader2, ArrowRight, Mail, Lock, AlertCircle } from 'lucide-react';
import { dbService } from '../../db';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await dbService.login(email, password);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Falha na autenticação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 selection:bg-neon selection:text-black">
      <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center">
          <div className="inline-block p-4 bg-neon/10 rounded-3xl mb-6 shadow-[0_0_30px_rgba(207,236,15,0.1)]">
            <ShieldCheck className="text-neon" size={40} />
          </div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">
            HOLY<span className="text-neon">ADMIN</span>
          </h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">
            Autenticação Segura • Supabase Auth
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-neon transition-colors" size={18} />
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email do administrador"
                className="w-full bg-zinc-900 border border-white/5 rounded-2xl pl-16 pr-6 py-5 text-white outline-none focus:border-neon/50 transition-all placeholder:text-zinc-700"
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-neon transition-colors" size={18} />
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha de acesso"
                className="w-full bg-zinc-900 border border-white/5 rounded-2xl pl-16 pr-6 py-5 text-white outline-none focus:border-neon/50 transition-all placeholder:text-zinc-700"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
              <AlertCircle className="text-red-500 shrink-0" size={16} />
              <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">{error}</p>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-neon text-black font-black py-5 rounded-2xl uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-neon/20 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck size={18} />}
            {loading ? 'VALIDANDO SESSÃO...' : 'ENTRAR NO PAINEL'}
          </button>
        </form>

        <a 
          href="/"
          className="w-full text-zinc-600 hover:text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
        >
          Voltar para o Templo <ArrowRight size={12} />
        </a>
      </div>
    </div>
  );
};

export default Login;
