# 🔗 Integração n8n com Supabase - Guia Completo

## 📋 Sumário
1. [Visão Geral](#visão-geral)
2. [Configuração do Webhook](#configuração-do-webhook)
3. [Configuração do n8n](#configuração-do-n8n)
4. [Testes](#testes)
5. [Solução de Problemas](#solução-de-problemas)

---

## 🎯 Visão Geral

Sua aplicação agora possui integração completa com n8n para:
- ✅ Receber blogs gerados automaticamente pelo workflow do n8n
- ✅ Atualizar a página de "Meus Blogs" em tempo real (a cada 5 segundos)
- ✅ Exibir notificações quando novos blogs chegam
- ✅ Validar e processar dados automaticamente

### Arquitetura do Fluxo

```
n8n Workflow
    ↓
/api/webhooks/n8n (POST)
    ↓
Prisma → Supabase (posts table)
    ↓
/api/posts/sync (GET) ← Polling automático
    ↓
MyBlogs Component (atualiza a cada 5s)
```

---

## 🔌 URLs do Webhook

### Endpoint Principal (Recebe dados do n8n)
```
POST https://seudominio.com/api/webhooks/n8n
```

### Endpoint de Sincronização (Polling)
```
GET https://seudominio.com/api/posts/sync
```

### Verificação de Saúde
```
GET https://seudominio.com/api/webhooks/n8n
```

---

## ⚙️ Configuração do Webhook

### Estrutura do Payload Esperado

```json
{
  "title": "Título do Blog",
  "excerpt": "Um resumo breve do conteúdo",
  "content": "O conteúdo completo do artigo em markdown",
  "category": "Nome da Categoria",
  "image": "https://url-da-imagem.com/imagem.jpg",
  "published": true,
  "publishedAt": "2025-02-05T10:00:00Z"
}
```

### Campos Obrigatórios (Required)
- `title` - string
- `excerpt` - string
- `content` - string
- `category` - string

### Campos Opcionais (Optional)
- `image` - string (URL da imagem)
- `published` - boolean (padrão: true)
- `publishedAt` - string (ISO datetime, padrão: agora)

---

## 🔵 Configuração do n8n

### Passo 1: Criar um Webhook no n8n

1. Abra seu workspace do n8n
2. Crie um novo workflow ou abra um existente
3. Adicione um nó "HTTP Request"
4. Configure:
   - **Method**: POST
   - **URL**: `https://seudominio.com/api/webhooks/n8n`
   - **Authentication**: None (ou adicione se tiver)
   - **Headers**:
     ```
     Content-Type: application/json
     ```

### Passo 2: Mapear os Dados

No nó anterior ao HTTP Request, certifique-se que os dados estão estruturados como acima.

### Exemplo de Nó de Preparação de Dados:

Se estiver usando ChatGPT ou similar para gerar conteúdo:

```javascript
{
  "title": "{{ $node['GPT'].json.title }}",
  "excerpt": "{{ $node['GPT'].json.excerpt }}",
  "content": "{{ $node['GPT'].json.content }}",
  "category": "{{ $node['Config'].json.category }}",
  "image": "{{ $node['Image'].json.url }}",
  "published": true,
  "publishedAt": "{{ now().toISO() }}"
}
```

---

## 🧪 Testes

### Opção 1: Usando o Script de Teste (Node.js)

```bash
# Na raiz do projeto
node test-n8n-webhook.js
```

Saída esperada:
```
✅ SUCESSO! Blog criado com sucesso

📊 Resposta do servidor:
{
  "success": true,
  "message": "Blog criado com sucesso via n8n",
  "post": {
    "id": "uuid-aqui",
    "title": "A Importância da Oração...",
    ...
  }
}
```

### Opção 2: Usando cURL

```bash
curl -X POST https://seudominio.com/api/webhooks/n8n \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Teste de Blog",
    "excerpt": "Resumo do teste",
    "content": "Conteúdo do blog de teste",
    "category": "Teste",
    "image": "https://via.placeholder.com/800x400"
  }'
```

Resposta esperada:
```json
{
  "success": true,
  "message": "Blog criado com sucesso via n8n",
  "post": { ... }
}
```

### Opção 3: Usando Postman

1. Crie uma nova POST request
2. URL: `https://seudominio.com/api/webhooks/n8n`
3. Body (JSON raw):
   ```json
   {
     "title": "Teste Postman",
     "excerpt": "Teste da integração",
     "content": "Conteúdo de teste",
     "category": "Teste"
   }
   ```
4. Clique "Send"

---

## 📱 Checagem do Frontend

1. Acesse a página de **Administração → Meus Blogs**
2. A página fará polling automático a cada 5 segundos
3. Quando um novo blog chegar do n8n:
   - ✨ Aparecerá uma notificação verde: "X novo(s) blog(s) recebido(s) do n8n!"
   - 📊 O blog aparecerá na tabela
   - 🧠 Com um ícone de AI indicando que foi gerado automaticamente

---

## 🔍 Verificação da Sincronização

### Checagem Manual do Endpoint de Sincronização

```bash
curl https://seudominio.com/api/posts/sync
```

Resposta esperada:
```json
{
  "success": true,
  "count": 5,
  "posts": [
    {
      "id": "uuid",
      "title": "Blog Title",
      "source": "ai",
      "createdAt": "2025-02-05T10:00:00Z",
      ...
    }
  ],
  "timestamp": "2025-02-05T10:05:30Z"
}
```

---

## 🚨 Solução de Problemas

### Problema: "Blog não aparece na página"

**Solução:**
1. Verifique se a resposta do webhook retorna `success: true`
2. Confirme que o Supabase está conectado corretamente
3. Verifique se a tabela `posts` existe no Supabase
4. Clique em "Sincronizar Banco" manualmente

### Problema: "Erro ao conectar com Supabase"

**Solução:**
1. Verifique as variáveis de ambiente:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `DATABASE_URL` (para Prisma)
2. Certifique-se que as credenciais estão corretas
3. Verifique se o firewall permite conexões ao Supabase

### Problema: "Webhook retorna 400 - Campos faltando"

**Solução:**
1. Verifique se o payload JSON contém os 4 campos obrigatórios:
   - `title`
   - `excerpt`
   - `content`
   - `category`
2. Revise o mapeamento no nó HTTP Request do n8n

### Problema: "Polling não atualiza a página"

**Solução:**
1. Verifique se o endpoint `/api/posts/sync` está respondendo com HTTP 200
2. Abra o DevTools (F12) e veja a aba Network
3. Procure por requisições para `/api/posts/sync`
4. Se houver erros, verifique os logs do servidor

### Problema: "Webhook rejeita com 413"

**Solução:** O payload é muito grande. Reduza o tamanho do `content` ou imagens.

---

## 📊 Exemplo Completo de Workflow do n8n

```
┌─────────────────┐
│   Start Trigger │
│   (Schedule)    │
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│  ChatGPT/Claude     │
│  Generate Content   │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Format JSON Node   │
│  (Prepare Payload)  │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  HTTP Request POST  │
│  /api/webhooks/n8n  │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Response Handler   │
│  (Log Success/Error)│
└─────────────────────┘
```

---

## 🎯 Fluxo Completo do Usuário

1. **Admin entra na página "Meus Blogs"**
   - Componente faz polling a cada 5 segundos
   
2. **n8n executa o workflow automaticamente**
   - Gera novo blog com IA
   - Envia para `/api/webhooks/n8n`
   
3. **API recebe e valida o blog**
   - Cria registro no Supabase com source = "ai"
   - Retorna resposta de sucesso
   
4. **Frontend atualiza automaticamente**
   - Próxima requisição de polling traz o novo blog
   - Exibe notificação verde
   - Blog aparece na tabela com ícone de AI

---

## 📝 Logs e Debugging

### Ativar logs no Prisma

No arquivo `lib/prisma.ts`, os logs já estão configurados para modo development:

```typescript
log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
```

### Ver logs no browser

Abra DevTools (F12) → Console para ver mensagens do polling.

---

## 🔐 Segurança

Para produção, considere:

1. **Adicionar autenticação ao webhook**:
   ```typescript
   // Verificar API key
   const apiKey = request.headers.get('Authorization');
   if (apiKey !== `Bearer ${process.env.N8N_API_KEY}`) {
     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   }
   ```

2. **Rate limiting**
3. **Validação de schema JSON**
4. **CORS configurado**

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do servidor
2. Use o script de teste: `node test-n8n-webhook.js`
3. Valide o JSON do payload
4. Confirme que o Supabase está acessível

---

**Última atualização:** 2025-02-05
