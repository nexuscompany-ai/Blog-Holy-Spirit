# 🚀 Guia Rápido - n8n + Supabase

## 📍 3 Passos Principais

### 1️⃣ Configurar Variáveis de Ambiente

Copie `.env.example` para `.env.local` e preencha:

```bash
# No seu projeto
cp .env.example .env.local
```

Edite `.env.local`:
```
SUPABASE_URL=seu_url
SUPABASE_ANON_KEY=sua_chave
DATABASE_URL=postgresql://...
```

### 2️⃣ Configurar o Webhook no n8n

**URL do Webhook:**
```
POST https://seu-app.com/api/webhooks/n8n
```

**Body JSON esperado:**
```json
{
  "title": "Título do Blog",
  "excerpt": "Resumo breve",
  "content": "Conteúdo completo em markdown",
  "category": "Nome Categoria",
  "image": "https://url-imagem.com/img.jpg",
  "published": true,
  "publishedAt": "2025-02-05T10:00:00Z"
}
```

### 3️⃣ Testar a Integração

```bash
# Executar teste
node test-n8n-webhook.js
```

Resposta esperada: `✅ SUCESSO! Blog criado com sucesso`

---

## ✅ Checklist de Verificação

- [ ] `.env.local` configurado com credenciais do Supabase
- [ ] Webhook POST `/api/webhooks/n8n` respondendo com HTTP 200 no teste
- [ ] Tabela `posts` existe no Supabase
- [ ] n8n enviando payload com os 4 campos obrigatórios
- [ ] Frontend mostrando novos blogs em "Meus Blogs"
- [ ] Notificação verde aparecendo quando blog chega

---

## 🔄 Fluxo Atualização em Tempo Real

```
n8n envia blog
       ↓
GET /api/posts/sync (poll a cada 5s)
       ↓
Novo blog aparece na tabela
       ↓
Notificação verde "Blog recebido!"
```

---

## 🐛 Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| 400 - Campos faltando | Verifique se payload tem: title, excerpt, content, category |
| 500 - Erro no servidor | Verifique credenciais Supabase no `.env.local` |
| Webhook reza HTTP 100 | Teste com `node test-n8n-webhook.js` |
| Blog não aparece | Clique "Sincronizar Banco" manualmente |

---

## 📊 Endpoints Disponíveis

| Método | URL | Descrição |
|--------|-----|-----------|
| POST | `/api/webhooks/n8n` | Recebe blog do n8n |
| GET | `/api/webhooks/n8n` | Verifica saúde |
| GET | `/api/posts/sync` | Sincroniza todos os blogs |
| GET | `/api/posts` | Lista posts publicados |
| POST | `/api/posts` | Criar post manualmente |

---

## 📱 Interface Admin

Página: **Admin → Meus Blogs**

- ✨ Mostra badge verde quando novo blog chega
- 🧠 Ícone de AI em blogs do n8n
- 🔄 Sincronização automática a cada 5 segundos
- ⏰ Mostra quanto tempo faz da última sincronização

---

**Precisa de help?** Veja `N8N_WEBHOOK_GUIDE.md` para guia completo.
