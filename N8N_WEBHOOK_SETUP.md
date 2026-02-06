# 🔗 Guia Completo: Integração n8n - Webhook Receber Blog

## 📋 Status Atual

- **Webhook URL**: `https://felipealmeida0777.app.n8n.cloud/webhook/receberblog`
- **Endpoint Receptor**: `/api/webhooks/n8n`
- **Gerador IA**: `/api/ai/generate`
- **Status**: ✅ Configurado e pronto

---

## 🚀 Quick Start (3 Minutos)

### 1️⃣ Verificar Variáveis de Ambiente

Certifique-se de que seu `.env.local` contém:

```env
# ===== n8n Integration =====
N8N_WEBHOOK_URL=https://felipealmeida0777.app.n8n.cloud/webhook/receberblog
N8N_WEBHOOK_AUTH=false
```

### 2️⃣ Verificar Status do Workflow no n8n

```bash
# Abra no navegador:
https://felipealmeida0777.app.n8n.cloud/workflows
```

**Checklist:**
- [ ] Workflow "Blog Generator" está VISÍVEL
- [ ] Botão "Active" (canto superior direito) está **LIGADO** (verde)
- [ ] Nó "Webhook" está configurado
- [ ] URL do webhook: `https://felipealmeida0777.app.n8n.cloud/webhook/receberblog`

### 3️⃣ Testar a Integração

```bash
# No terminal do seu projeto:
npm run dev

# Depois acesse:
http://localhost:3000/admin
# → Clique em "Escritora n8n"
# → Digite um tema
# → Clique em "OBTER PREVIEW"
```

---

## 🔍 Fluxo de Funcionamento

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Admin clica "Escritora n8n"                             │
│    → /components/admin/CreateBlog.tsx                       │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Envia requisição POST                                    │
│    → /api/ai/generate (Frontend)                           │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Validação e Retry                                        │
│    • Timeout: 30 segundos                                  │
│    • Retry: até 3 tentativas com backoff                   │
│    • Adiciona request_id para rastreamento                 │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. POST para n8n Webhook                                   │
│    https://felipealmeida0777.app.n8n.cloud/webhook/...    │
│    Payload: { mode, tema, categoria, origem, timestamp }   │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Processamento no n8n                                     │
│    • Recebe dados via Webhook                              │
│    • Gera blog com IA                                      │
│    • Prepara resposta com preview                          │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Admin aprova e publica                                   │
│    → Envia novamente com mode: 'publish'                    │
│    → n8n salva no Supabase                                  │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. Blog aparece em tempo real                               │
│    → Admin vê notificação "Post Sincronizado!"              │
│    → Polling atualiza lista de blogs                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🐛 Troubleshooting

### ❌ Erro: "Workflow n8n Inativo"

**Mensagem no navegador:**
```json
{
  "error": "Workflow n8n Inativo ou URL Incorreta",
  "details": "Verifique se o workflow está ATIVO na URL..."
}
```

**Soluções:**

1. **Verifique o botão "Active" no n8n:**
   - Acesse: https://felipealmeida0777.app.n8n.cloud/workflows
   - Abra o workflow "Blog Generator"
   - No canto superior direito, verifique se há um botão verde "Active"
   - Se estiver cinza (desativado), **clique para ligar**

2. **Confirme a URL do webhook:**
   - No workflow, clique no nó "Webhook"
   - A URL deve ser: `https://felipealmeida0777.app.n8n.cloud/webhook/receberblog`
   - Se estiver diferente, **atualize o n8n_config.ts ou .env.local**

3. **Publique o workflow:**
   - Menu superior → "Save"
   - Se houver um botão "Publish", clique

### ⏱️ Erro: "Timeout" ou "Sem resposta"

**Causas comuns:**

- [ ] n8n está offline ou sobrecarregado
- [ ] Conexão de internet instável
- [ ] Firewall bloqueando requisições

**Soluções:**

```bash
# 1. Teste a URL manualmente no terminal:
curl -X GET https://felipealmeida0777.app.n8n.cloud/health

# 2. Se falhar, n8n pode estar down. Aguarde alguns minutos

# 3. Verifique os logs do n8n:
# Dashboard n8n → Executions → Veja erros recentes
```

### 📨 Erro: "JSON inválido" ou "Payload inválido"

**Soluções:**

1. Verifique que o payload contém todos os campos obrigatórios:
   ```json
   {
     "title": "Título do Blog",
     "excerpt": "Resumo breve",
     "content": "<p>Conteúdo do blog...</p>",
     "category": "Musculação"
   }
   ```

2. Campos opcionais:
   ```json
   {
     "image": "https://...",
     "published": true,
     "publishedAt": "2024-02-06T10:00:00Z"
   }
   ```

### 🔐 Erro 401: "Autenticação inválida"

Se seu webhook requer autenticação, configure:

```env
N8N_WEBHOOK_AUTH=true
N8N_WEBHOOK_API_KEY=sua_chave_aqui
```

E no n8n, configure o header:
```
Authorization: Bearer <sua_chave>
```

---

## 🧪 Teste Manual com cURL

```bash
# 1. Testar status do webhook (GET)
curl https://seu-app.com/api/webhooks/n8n

# 2. Enviar blog de teste (POST)
curl -X POST https://seu-app.com/api/webhooks/n8n \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Teste Blog",
    "excerpt": "Este é um blog de teste",
    "content": "<p>Conteúdo de teste</p>",
    "category": "Estudo",
    "image": "https://via.placeholder.com/800x400"
  }'

# 3. Testar gerador IA
curl -X POST https://seu-app.com/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Escreva sobre musculação",
    "category": "Musculação",
    "mode": "preview"
  }'
```

---

## 📊 Monitoramento

### Logs Importantes

Procure por estas mensagens no console:

✅ **Sucesso:**
```
✅ n8n respondeu com sucesso (abc123def456)
💾 Salvando post no banco (tentativa 1/3)
✅ Post salvo com sucesso: uuid-12345
```

⚠️ **Aviso:**
```
⚠️ Tentativa 1 falhou, retentando (2/3)
🔒 Autenticação falhou
```

❌ **Erro:**
```
❌ Webhook não encontrado: https://...
❌ Erro n8n (500): ...
❌ Falha Crítica: ...
```

### Request ID para Rastreamento

Toda requisição tem um `request_id` único. Use para rastrear o fluxo:

```json
{
  "success": true,
  "request_id": "abc123xyz789",
  "post": { ... }
}
```

Procure por este ID nos logs para ver o fluxo completo.

---

## 🔒 Segurança Recomendada

### Para Produção:

1. **Habilite autenticação:**
   ```env
   N8N_WEBHOOK_AUTH=true
   N8N_WEBHOOK_API_KEY=gerar_chave_aleatoria_forte
   ```

2. **Use HMAC signature:**
   ```env
   N8N_REQUIRE_SIGNATURE=true
   N8N_WEBHOOK_SECRET=seu_secret_256_bits
   ```

3. **Monitore rate limiting:**
   - Máximo: 60 requisições por minuto por IP
   - Payload máximo: 10 MB

4. **Use HTTPS sempre:**
   - Produção deve usar `https://felipealmeida0777.app.n8n.cloud`

---

## 📝 Configuração no n8n

### Nó Webhook

```
Type: Webhook
Method: POST
Authentication: (configurar se necessário)
Valid Paths: /receberblog
Test: Ligar para ver URL
Active: DEVE ESTAR LIGADO
```

### Nó Response

```
Code: 200
Headers: Content-Type: application/json
Response Body: { "success": true, "post": data }
```

---

## 🆘 Contacto & Suporte

Se o webhook ainda não funciona:

1. Verifique os **3 passos do Quick Start** acima
2. Procure pela mensagem de erro no console (`F12` → Console)
3. Compartilhe o `request_id` ao solicitar suporte
4. Verifique os logs do n8n em: https://felipealmeida0777.app.n8n.cloud

---

**Última atualização:** 2024-02-06  
**Status do Webhook:** ✅ Testado e Ativo  
**Versão:** 1.0 Robusta com Retry Automático
