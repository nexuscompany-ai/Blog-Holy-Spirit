
-- Execute este comando no SQL Editor do seu projeto Supabase para atualizar a tabela

-- Adicionando coluna status se não existir
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='posts' AND column_name='status') THEN
        ALTER TABLE posts ADD COLUMN status TEXT DEFAULT 'draft';
    END IF;
END $$;

-- Garantindo que publishedAt aceite nulo para rascunhos
ALTER TABLE posts ALTER COLUMN "publishedAt" DROP NOT NULL;
ALTER TABLE posts ALTER COLUMN "publishedAt" SET DEFAULT NULL;

-- Adicionando coluna updatedAt para controle de versão
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='posts' AND column_name='updatedAt') THEN
        ALTER TABLE posts ADD COLUMN "updatedAt" TIMESTAMPTZ DEFAULT now();
    END IF;
END $$;

-- Adicionando unicidade ao slug se não houver
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'posts_slug_key') THEN
        ALTER TABLE posts ADD CONSTRAINT posts_slug_key UNIQUE (slug);
    END IF;
EXCEPTION
    WHEN others THEN NULL;
END $$;
