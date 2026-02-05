# 📋 Exemplo de Workflow n8n Completo

## 🎯 Objetivo
Workflow que executa a cada 1 hora, gera um blog com ChatGPT/Claude, e envia para o webhook do seu app.

---

## 📊 Arquitetura do Workflow

```
Cron Trigger (a cada 1h)
    ↓
(Opcional) Defina Categoria e Tópicos
    ↓
ChatGPT / Claude - Gera Content
    ↓
Estruture o Payload JSON
    ↓
HTTP Request POST → /api/webhooks/n8n
    ↓
Verifique Response e Registre
```

---

## 🔧 Configuração Passo-a-Passo

### 1. Nó CRON (Trigger)

**Tipo:** Cron
**Configuração:**
```
Todos os dias às 14:30:00
// OU
A cada 1 hora
// OU
A cada dia útil às 9:00 AM
```

**Output:**
```json
{
  "timestamp": "2025-02-05T14:30:00Z",
  "executionTime": 1707149400000
}
```

---

### 2. Nó VARIÁVEIS (Opcional mas Recomendado)

**Tipo:** Set
**Dados a definir:**
```json
{
  "category": "Espiritualidade",
  "topics": [
    "Oração diária",
    "Fé em Deus",
    "Vida espiritual",
    "Meditação cristã"
  ],
  "websiteUrl": "https://seu-app.com"
}
```

---

### 3. Nó CHATGPT (Gera Conteúdo)

**Tipo:** OpenAI / Claude / Similar
**Prompt:**
```
Crie um artigo de blog completo sobre {{$node["Set"].json.topics[0]}}

Siga rigorosamente este formato JSON:
{
  "title": "Um título atrativo (máx 60 caracteres)",
  "excerpt": "Um resumo de 1 parágrafo (máx 150 caracteres)",
  "content": "Artigo completo em markdown com várias seções, citações inspiracionais e insights. Mínimo 500 palavras.",
}

Deixe a saída APENAS em JSON válido.
```

**Configuração:**
- Model: gpt-4 ou claude-3-opus
- Temperature: 0.7 (criativo mas não alucinante)
- Max tokens: 2000

**Output esperado:**
```json
{
  "title": "A Importância da Oração Diária",
  "excerpt": "Descubra como a oração diária...",
  "content": "# A Importância da Oração Diária\n\n## Introdução..."
}
```

---

### 4. Nó ESTRUTURA (Prepara Payload)

**Tipo:** Function ou Inject Data

Se usar JavaScript:
```javascript
return {
  "title": {{$node["ChatGPT"].json.title}},
  "excerpt": {{$node["ChatGPT"].json.excerpt}},
  "content": {{$node["ChatGPT"].json.content}},
  "category": "{{$node["Set"].json.category}}",
  "image": "https://picsum.photos/800/400?random={{$executionId}}",
  "published": true,
  "publishedAt": {{now().toISO()}},
  "source": "n8n-ai"
}
```

Se usar Set:
```json
{
  "title": "Use: {{ $node['ChatGPT'].json.title }}"
  "excerpt": "{{ $node['ChatGPT'].json.excerpt }}"
  "content": "{{ $node['ChatGPT'].json.content }}"
  "category": "{{ $node['Set'].json.category }}"
  "image": "https://picsum.photos/800/400?random={{ $executionId }}"
  "published": true
  "publishedAt": "{{ now().toISO() }}"
}
```

---

### 5. Nó HTTP REQUEST (Envia para Webhook)

**Tipo:** HTTP Request

**Configuração:**
- **Method:** POST
- **URL:** `https://seu-app.com/api/webhooks/n8n`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer sua_api_key_opcional
X-n8n-Signature: (opcional - HMAC256)
```

**Body (Raw JSON):**
```
{{$node["Estrutura"].json}}
```

**Authentication:** OAuth2 (opcional)
**Keep Credentials in Body:** true
**Timeout:** 30s

**Response:**
```json
{
  "success": true,
  "message": "Blog criado com sucesso via n8n",
  "post": {
    "id": "uuid-aqui",
    "title": "A Importância da Oração Diária",
    "slug": "a-importancia-da-oracao-diaria-1234",
    "createdAt": "2025-02-05T14:30:05Z"
  }
}
```

---

### 6. Nó RESPOSTADOR (Opcional - Logging)

**Tipo:** Log

**Configuração:**
```
Log Level: Info
Message: Blog enviado com sucesso: {{ $node["HTTP"].json.post.title }}
```

**OU**

**Tipo:** Send Email (Notificação)

```
To: seu-email@gmail.com
Subject: Blog Criado: {{ $node["HTTP"].json.post.title }}
Body: Blog enviado com sucesso para o seu site!
```

---

## 🧪 Teste do Workflow

### Opção 1: Executar Manualmente
1. Clique em "Execute Workflow"
2. Verifique:
   - [ ] Output do ChatGPT é JSON válido
   - [ ] HTTP retorna 201 (Created)
   - [ ] response.success === true

### Opção 2: Testar Webhook
```bash
# No seu terminal
node test-n8n-webhook.js
```

### Opção 3: Verificar no Admin
1. Acesse seu app em Admin → Meus Blogs
2. Clique "Sincronizar Banco"
3. O novo blog deve aparecer

---

## 🔒 Segurança (Produção)

### Adicione Autenticação
```javascript
// No seu n8n, no nó HTTP Request:

headers: {
  "Authorization": "Bearer " + process.env.N8N_WEBHOOK_API_KEY,
  "Content-Type": "application/json",
  "X-Webhook-Source": "n8n"
}
```

### Gere Signature HMAC (Opcional)
```javascript
const crypto = require('crypto');
const payload = JSON.stringify(body);
const signature = crypto
  .createHmac('sha256', 'seu-secret-key')
  .update(payload)
  .digest('hex');

headers["X-n8n-Signature"] = signature;
```

---

## 📊 Monitoramento

### Verificar Execuções
1. Vá em n8n → Executions
2. Procure por falhas (vermelho)
3. Clique para ver detalhes do erro

### Logs da API
```bash
# Ver logs no seu app
tail -f logs/webhook.log

# Ou verificar Supabase
# Tabela: posts
# Filtre por: source = 'ai'
```

---

## 🐛 Debugging

### Erro: "400 - Campos faltando"
**Causa:** Payload não tem title, excerpt, content, category
**Solução:** Revise o mapeamento no nó Estrutura

### Erro: "500 - Erro ao processar"
**Causa:** Supabase não acessível ou DATABASE_URL inválida
**Solução:** Verifique credenciais no `.env`

### Erro: "401 - Autenticação inválida"
**Causa:** Token/API Key incorreto
**Solução:** Verifique Authorization header

### Erro: "429 - Rate limit"
**Causa:** Muitas requisições do mesmo IP
**Solução:** Aguarde alguns minutos ou aumente limite

---

## 📈 Customizações

### Gerar Imagem Dinâmica
```
URL: https://api.unsplash.com/photos/random?query={{$node["Set"].json.category}}&client_id=YOUR_KEY
```

### Múltiplas Categorias Aleatórias
```javascript
const categories = ["Espiritualidade", "Fé", "Oração", "Vida Cristã"];
return {
  category: categories[Math.floor(Math.random() * categories.length)]
}
```

### Agendar para Horas Específicas
```
Trigger: Cron
Schedule: 0 9,14,18 * * * (9h, 14h, 18h todos os dias)
```

### Enviar Notificação ao Admin
```
Adicione nó Send Email após sucesso
To: admin@seu-app.com
Subject: Novo Blog Criado: {{$node["ChatGPT"].json.title}}
```

---

## ✅ Checklist de Configuração

- [ ] Nó Cron configurado com horário
- [ ] ChatGPT/Claude com credenciais válidas
- [ ] Payload estruturado corretamente
- [ ] URL do webhook correta
- [ ] HTTP Request respondendo 201
- [ ] response.success === true
- [ ] Blog aparecendo em "Meus Blogs"
- [ ] Notificação funcionando (opcional)

---

## 📞 Referências

- **Documentação n8n:** https://docs.n8n.io/
- **OpenAI API:** https://platform.openai.com/docs
- **Seu webhook:** https://seu-app.com/api/webhooks/n8n
- **Admin:** https://seu-app.com/admin/my-blogs

---

**Criado em:** 2025-02-05
**Última atualização:** 2025-02-05
