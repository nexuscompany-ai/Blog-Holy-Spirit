
-- Execute este comando no SQL Editor do seu projeto Supabase para criar as tabelas corretamente

-- Tabela de Posts
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    category TEXT DEFAULT 'Geral',
    image TEXT,
    source TEXT DEFAULT 'manual',
    status TEXT DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    published_at TIMESTAMPTZ,
    -- Fallbacks para camelCase se necessário
    "createdAt" TIMESTAMPTZ DEFAULT now(),
    "updatedAt" TIMESTAMPTZ DEFAULT now(),
    "publishedAt" TIMESTAMPTZ
);

-- Tabela de Eventos
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT,
    location TEXT,
    description TEXT,
    category TEXT DEFAULT 'Workshop',
    status TEXT DEFAULT 'active',
    image TEXT,
    "whatsappEnabled" BOOLEAN DEFAULT false,
    "whatsappNumber" TEXT,
    "whatsappMessage" TEXT
);

-- Tabela de Configurações
CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY DEFAULT 'config',
    "gymName" TEXT,
    phone TEXT,
    instagram TEXT,
    address TEXT,
    website TEXT
);

-- Tabela de Automação
CREATE TABLE IF NOT EXISTS automation_settings (
    id TEXT PRIMARY KEY DEFAULT 'config',
    enabled BOOLEAN DEFAULT false,
    frequency_days INTEGER DEFAULT 3,
    topics TEXT,
    target_category TEXT DEFAULT 'Musculação'
);

-- Tabela de Perfis/Roles
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    role TEXT DEFAULT 'user',
    full_name TEXT
);

-- Ativar RLS se desejar, ou manter desativado para facilitar o teste inicial
-- ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
