# 📂 Estrutura do Projeto - Guia Completo

## 🌳 Hierarquia de Pastas

```
Blog-Holy-Spirit/
│
├── 📄 Arquivos de Configuração
│   ├── package.json              ← Dependências do projeto
│   ├── tsconfig.json             ← Configuração TypeScript
│   ├── vite.config.ts            ← Configuração Vite (build)
│   ├── tailwind.config.js        ← Estilos Tailwind
│   ├── postcss.config.js         ← PostCSS
│   └── .env.example              ← Variáveis de ambiente
│
├── 📚 Documentação (NOVOS ARQUIVOS)
│   ├── N8N_WEBHOOK_GUIDE.md      ✨ Guia completo da integração
│   ├── QUICKSTART_N8N.md         ✨ Quick start em 3 passos
│   ├── IMPLEMENTATION_SUMMARY.md ✨ Resumo da implementação
│   ├── N8N_WORKFLOW_EXAMPLE.md   ✨ Exemplo de workflow n8n
│   └── PROJECT_STRUCTURE.md      ← Você está aqui!
│
├── 🔧 Scripts
│   └── test-n8n-webhook.js       ✨ Teste do webhook
│
├── 📁 app/ (Backend Next.js)
│   ├── layout.tsx                ← Layout principal
│   ├── page.tsx                  ← Home page
│   └── api/                      ← Rotas API
│       ├── posts/
│       │   ├── route.ts          ← GET/POST /api/posts
│       │   ├── sync/
│       │   │   └── route.ts      ✨ GET /api/posts/sync (polling)
│       │   └── [slug]/
│       │       └── route.ts
│       ├── webhooks/             ✨ NOVA PASTA
│       │   └── n8n/
│       │       └── route.ts      ✨ POST /api/webhooks/n8n
│       ├── events/
│       │   └── route.ts
│       ├── health/
│       │   └── route.ts
│       ├── settings/
│       │   └── route.ts
│       └── upload/
│           └── route.ts
│
├── 📁 components/ (Componentes React)
│   ├── BlogCard.tsx              ← Card individual de blog
│   ├── BlogSection.tsx           ← Seção de blogs
│   ├── CTABanner.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── HowItWorks.tsx
│   ├── WhyUs.tsx
│   └── admin/                    ← Componentes Admin
│       ├── AdminLayout.tsx       ← Layout do admin
│       ├── CreateBlog.tsx        ← Criar novo blog
│       ├── DashboardHome.tsx     ← Dashboard
│       ├── Login.tsx             ← Login
│       ├── ManageAutomation.tsx  ← Gerenciar automação n8n
│       ├── ManageEvents.tsx      ← Gerenciar eventos
│       ├── MyBlogs.tsx           ✨ MODIFICADO - Agora com polling
│       └── SettingsPage.tsx      ← Configurações
│
├── 📁 lib/ (Utilitários e Configurações)
│   ├── prisma.ts                 ← Cliente Prisma (DB)
│   ├── usePollServer.ts          ✨ NOVO - Hook para polling
│   └── webhook-config.ts         ✨ NOVO - Config webhook
│
├── 📁 services/ (Lógica de Negócio)
│   └── posts.service.ts          ← Serviço de posts (CRUD)
│
├── 📁 types/ (TypeScript Types)
│   └── post.ts                   ← Interfaces de Post
│
├── 📁 blog-platform/ (Conteúdo estático?)
│
├── 📄 Arquivos Raiz
│   ├── index.html                ← HTML principal
│   ├── index.tsx                 ← Entrada React
│   ├── App.tsx                   ← App root
│   ├── db.ts                     ← Configuração Supabase
│   ├── globals.css               ← CSS global
│   ├── metadata.json             ← Metadados
│   └── README.md                 ← README original

```

---

## 🎯 Novos Arquivos Criados

### 📍 Rotas API

#### 1. **`app/api/webhooks/n8n/route.ts`** ✨ CRÍTICO
```typescript
POST /api/webhooks/n8n
```
- Recebe blogs do n8n
- Valida e salva no Supabase
- Com segurança (auth, rate limit, validação)

**Payload esperado:**
```json
{
  "title": "...",
  "excerpt": "...",
  "content": "...",
  "category": "...",
  "image": "...",
  "published": true
}
```

---

#### 2. **`app/api/posts/sync/route.ts`** ✨ NOVO
```typescript
GET /api/posts/sync
```
- Retorna todos os posts para polling
- Usado a cada 5 segundos no frontend
- Sincronização em tempo real

**Resposta:**
```json
{
  "success": true,
  "count": 5,
  "posts": [...],
  "timestamp": "2025-02-05T10:00:00Z"
}
```

---

#### 3. **`app/api/posts/route.ts`** (MELHORADO)
- Melhor tratamento de erros
- Validação completa
- Suporta source (manual/ai)

---

### 📁 Novos Utilitários

#### 1. **`lib/usePollServer.ts`** ✨ NOVO HOOK
```typescript
usePollServer({
  url: '/api/posts/sync',
  interval: 5000,
  onSuccess: (data) => { ... },
  onError: (error) => { ... }
})
```
- Hook customizado para polling
- Reutilizável
- Auto-cleanup

---

#### 2. **`lib/webhook-config.ts`** ✨ NOVO
Funções de segurança:
- `verifyWebhookAuth()` - Autenticação
- `checkRateLimit()` - Rate limiting
- `validatePayload()` - Validação
- `verifySignature()` - HMAC
- `logWebhookEvent()` - Logging

---

### 🎨 Componentes Modificados

#### **`components/admin/MyBlogs.tsx`** ✨ ATUALIZADO
**O que mudou:**
- ✅ Adicionado `usePollServer` hook
- ✅ Estado para `newBlogsCount`
- ✅ Estado para `syncError`
- ✅ Estado para `lastSyncTime`
- ✅ Notificação verde para novos blogs
- ✅ Erro handling visual
- ✅ Timestamp da sincronização

**Novo comportamento:**
```
Carrega blogs ao montar
↓
A cada 5 segundos: fetch /api/posts/sync
↓
Se houver novo blog: mostrar notificação verde
↓
Atualizar tabela automaticamente
```

---

### 📚 Documentação Completa

#### 1. **`N8N_WEBHOOK_GUIDE.md`** (15 KB)
- Visão geral completa
- Configuração passo-a-passo do webhook
- Testes com cURL, Postman, Node.js
- Troubleshooting detalhado
- Exemplos de workflow
- Security best practices

#### 2. **`QUICKSTART_N8N.md`** (2 KB)
- 3 passos principais
- Checklist de verificação
- Troubleshooting rápido
- Endpoints disponíveis

#### 3. **`IMPLEMENTATION_SUMMARY.md`** (8 KB)
- O que foi criado
- Fluxo completo
- Como usar
- Funcionalidades
- Próximos passos

#### 4. **`N8N_WORKFLOW_EXAMPLE.md`** (12 KB)
- Exemplo completo de workflow n8n
- Passo-a-passo de configuração
- Código de exemplo
- Debugging
- Customizações

#### 5. **`PROJECT_STRUCTURE.md`** (Você está aqui!)
- Hierarquia de pastas
- Explicação de cada arquivo novo
- Interconnexões

---

### ⚙️ Configurações

#### **`.env.example`** ✨ NOVO
```
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
DATABASE_URL=...
NODE_ENV=development
N8N_WEBHOOK_URL=...
N8N_API_KEY=...
```

Copie para `.env.local` e preencha com suas credenciais.

---

### 🧪 Scripts

#### **`test-n8n-webhook.js`** ✨ NOVO
```bash
node test-n8n-webhook.js
```

**O que faz:**
1. Testa saúde do webhook (GET)
2. Envia um blog de teste (POST)
3. Valida resposta
4. Mostra sucesso ou erro

**Output:**
```
✅ SUCESSO! Blog criado com sucesso
📊 Resposta: { success: true, post: {...} }
```

---

## 🔄 Como os Arquivos Trabalham Juntos

### Fluxo 1: n8n Envia Blog
```
n8n POST /api/webhooks/n8n
  ↓
route.ts valida com webhook-config.ts
  ↓
PostsService.create() salva no DB
  ↓
Retorna 201 + blog criado
```

### Fluxo 2: Frontend Polling
```
MyBlogs.tsx monta
  ↓
usePollServer hook inicia
  ↓
A cada 5s: GET /api/posts/sync
  ↓
route.ts POST retorna lista
  ↓
MyBlogs.tsx atualiza estado
  ↓
Tela renderiza novo blog + notificação
```

### Fluxo 3: Teste Local
```
test-n8n-webhook.js
  ↓
GET /api/webhooks/n8n (health check)
  ↓
POST com blog de teste
  ↓
Valida resposta
  ↓
Mostra resultado
```

---

## 📊 Modelo de Dados

### Post (Banco de Dados)
```typescript
{
  id: string;              // UUID
  title: string;           // Título do blog
  slug: string;            // URL slug (único)
  excerpt: string;         // Resumo
  content: string;         // Conteúdo completo em markdown
  category: string;        // Categoria
  image: string;           // URL da imagem
  createdAt: DateTime;     // Quando criado
  published: boolean;      // Publicado ou rascunho?
  publishedAt?: DateTime;  // Quando publicar
  source: 'manual' | 'ai'; // Origem (manual vs n8n)
}
```

---

## 🛡️ Segurança por Camada

```
┌─────────────────────────────────────────┐
│ 1. HTTP Header Validation               │
│    ✅ Content-Type, Authorization, etc  │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│ 2. Authentication (webhook-config.ts)   │
│    ✅ Bearer token verificação           │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│ 3. Rate Limiting (webhook-config.ts)    │
│    ✅ Por IP, máx 60 req/min             │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│ 4. Payload Validation (webhook-config) │
│    ✅ Campos, tipos, tamanho            │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│ 5. Signature Verification (HMAC)        │
│    ✅ Integridade da mensagem           │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│ 6. Database Save (Prisma + Supabase)   │
│    ✅ ORM protege contra SQL injection  │
└─────────────────────────────────────────┘
```

---

## 🚀 Fluxo de Deploy

### Local (Development)
```bash
npm install
npm run dev
# App roda em http://localhost:5173
# n8n pode testar em http://localhost:3000 (se proxy)
```

### Production
```bash
npm run build
npm run preview
# Deploy em plataforma (Vercel, Railway, etc)
# Webhook URL: https://seu-app.com/api/webhooks/n8n
```

---

## ✅ Checklist de Integração

1. **Backend**
   - [ ] Rotas criadas
   - [ ] Webhook respondendo
   - [ ] Supabase conectado
   - [ ] Prisma OK

2. **Frontend**
   - [ ] Hook de polling
   - [ ] MyBlogs atualizado
   - [ ] Notificações funcionando
   - [ ] Styling OK

3. **n8n**
   - [ ] Workflow criado
   - [ ] Gerando blogs com IA
   - [ ] Enviando POST correto
   - [ ] Recebendo 201 OK

4. **Teste**
   - [ ] `node test-n8n-webhook.js` passa
   - [ ] Blog aparece em "Meus Blogs"
   - [ ] Notificação verde aparece
   - [ ] Dashboard atualiza

---

## 📞 Estrutura de Acesso

```
Admin Panel
  ├── Dashboard → DashboardHome.tsx
  ├── Meus Blogs → MyBlogs.tsx (polling aqui) ✨
  ├── Criar Blog → CreateBlog.tsx
  ├── Eventos → ManageEvents.tsx
  ├── Automação → ManageAutomation.tsx
  └── Configurações → SettingsPage.tsx

API Endpoints
  ├── GET  /api/posts → lista publicados
  ├── POST /api/posts → criar manual
  ├── GET  /api/posts/sync → polling ✨
  ├── POST /api/webhooks/n8n → webhook n8n ✨
  ├── GET  /api/webhooks/n8n → health check ✨
  └── ... (outros endpoints)
```

---

**Última atualização:** 2025-02-05
**Status:** ✅ Documentação Completa
