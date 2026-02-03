
-- Execute este comando no SQL Editor do seu projeto Supabase

-- Tabela de Perfis para gerenciar Admin
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  full_name TEXT
);

-- Tabela de Posts do Blog
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  category TEXT,
  image TEXT,
  source TEXT DEFAULT 'manual',
  published BOOLEAN DEFAULT true,
  publishedAt TIMESTAMPTZ DEFAULT now(),
  createdAt TIMESTAMPTZ DEFAULT now()
);

-- Tabela de Eventos
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE,
  time TIME,
  location TEXT,
  description TEXT,
  category TEXT,
  status TEXT DEFAULT 'active',
  image TEXT
);

-- Tabela de Configurações da Academia
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY DEFAULT 'config',
  gymName TEXT,
  phone TEXT,
  instagram TEXT,
  address TEXT,
  website TEXT
);

-- Tabela de Automação IA
CREATE TABLE IF NOT EXISTS automation_settings (
  id TEXT PRIMARY KEY DEFAULT 'config',
  enabled BOOLEAN DEFAULT false,
  frequency_days INTEGER DEFAULT 3,
  topics TEXT,
  target_category TEXT,
  last_run TIMESTAMPTZ,
  next_run TIMESTAMPTZ
);

-- Habilitar RLS (Segurança)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Políticas de Leitura Pública
CREATE POLICY "Leitura pública de posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Leitura pública de eventos" ON events FOR SELECT USING (true);

-- Política de Escrita (Somente Admins)
-- Nota: Você deve adicionar o ID do seu usuário na tabela 'profiles' com a role 'admin'
