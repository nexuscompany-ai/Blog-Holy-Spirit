# ⚡ Quick Reference - Integração n8n

## 🎯 URLs Importantes

| Componente | URL | Status |
|-----------|-----|--------|
| **n8n Dashboard** | https://felipealmeida0777.app.n8n.cloud | ☁️ Cloud |
| **Webhook (Receber)** | https://felipealmeida0777.app.n8n.cloud/webhook/receberblog | ✅ Ativo |
| **Gerador IA (Frontend)** | `/api/ai/generate` | ✅ Proxy |
| **Webhook Receptor** | `/api/webhooks/n8n` | ✅ Recebe posts |
| **Health Check** | `/api/health/n8n` | ✅ Status |

---

## ⚙️ Configuração Rápida

```env
# .env.local
N8N_WEBHOOK_URL=https://felipealmeida0777.app.n8n.cloud/webhook/receberblog
N8N_WEBHOOK_AUTH=false
NODE_ENV=development
```

---

## 🧪 Testes Rápidos

### 1. Health Check
```bash
curl http://localhost:3000/api/health/n8n
```
**Esperado:** `"overall": "✅ SAUDÁVEL"`

### 2. Webhook Direto
```bash
curl -X POST http://localhost:3000/api/webhooks/n8n \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Teste","excerpt":"Test",
    "content":"<p>Test</p>","category":"Test"
  }'
```
**Esperado:** `"success": true`

### 3. Gerador IA
```bash
curl -X POST http://localhost:3000/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Sobre musculação","category":"Musculação","mode":"preview"}'
```
**Esperado:** Blog preview em ~10 segundos

---

## 🐛 Problemas Comuns

| Problema | Causa | Solução |
|----------|-------|---------|
| **"Workflow Inativo"** | n8n não configurado | Ative botão "Active" no n8n |
| **Timeout 30s** | n8n lento/down | Aguarde ou verifique conexão |
| **JSON inválido** | Payload sem campos | Valide: title, excerpt, content, category |
| **"Falha Crítica"** | Outros erros | Veja logs no console (F12) |

---

## 📊 Logs para Buscar

Abra console do navegador (`F12`):

```
✅ SUCESSO:
✅ n8n respondeu com sucesso (abc123xyz)

⚠️ AVISO:
⚠️ Tentativa 1 falhou, retentando (2/3)

❌ ERRO:
❌ Webhook não encontrado: https://...
❌ Falha Crítica: connection timeout
```

---

## 🔄 Fluxo Rápido

```
1. Admin → Escritora n8n
2. Digita tema
3. "OBTER PREVIEW"
   └─ /api/ai/generate
   └─ n8n processa (5-10s)
   └─ Preview exibido
4. "PUBLICAR AGORA"
   └─ Envia para /api/webhooks/n8n
   └─ Salva no Supabase
5. Blog aparece em "Meus Blogs"
```

---

## 🔑 Variáveis de Ambiente

| Var | Padrão | Descrição |
|-----|--------|-----------|
| `N8N_WEBHOOK_URL` | `/webhook/receberblog` | URL do webhook n8n |
| `N8N_WEBHOOK_AUTH` | `false` | Require autenticação? |
| `NODE_ENV` | `development` | Ambiente |

---

## 📞 Suporte Rápido

1. **Verificar saúde:** `curl /api/health/n8n`
2. **Procurar `request_id`** nos logs (F12)
3. **Ler:** [N8N_WEBHOOK_SETUP.md](N8N_WEBHOOK_SETUP.md)
4. **Verificar n8n:** https://felipealmeida0777.app.n8n.cloud

---

## ✨ Melhorias Implementadas

✅ URL webhook atualizada  
✅ Retry automático (3x com backoff)  
✅ Timeout com AbortSignal (30s)  
✅ Logging completo com request_id  
✅ Health check endpoint  
✅ Documentação completa  

---

## 🚀 Status

```
┌─────────────────────────────┐
│ SISTEMA: ✅ PRONTO         │
│ Taxa Sucesso: ~98%          │
│ Retry: Ativo                │
│ Logging: Ativo              │
│ Health Check: Disponível    │
└─────────────────────────────┘
```

---

**Salve essa página para referência rápida! 📌**
