
-- Execute este comando no SQL Editor do seu projeto Supabase

-- Tabela de Posts (Refatorada)
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    category TEXT DEFAULT 'Geral',
    image TEXT,
    source TEXT DEFAULT 'manual',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    -- A coluna published_at é o ÚNICO indicador de publicação (NULL = rascunho, TIMESTAMP = público)
    published_at TIMESTAMPTZ DEFAULT NULL
);

-- Tabela de Eventos (Snake Case Fix)
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
    whatsapp_enabled BOOLEAN DEFAULT false,
    whatsapp_number TEXT,
    whatsapp_message TEXT
);

-- Tabela de Configurações
CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY DEFAULT 'config',
    gymName TEXT,
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

-- Perfis de Acesso
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    role TEXT DEFAULT 'user',
    full_name TEXT
);
