# ⚡ Referência Rápida - Testes e URLs

## 🔗 URLs do Webhook

### Local (Development)
```
POST http://localhost:3000/api/webhooks/n8n
GET  http://localhost:3000/api/webhooks/n8n
GET  http://localhost:3000/api/posts/sync
```

### Produção
```
POST https://seu-app.com/api/webhooks/n8n
GET  https://seu-app.com/api/webhooks/n8n
GET  https://seu-app.com/api/posts/sync
```

---

## 🧪 Teste Rápido (1 minuto)

### 1. Terminal
```bash
cd c:\Users\Note01\Documents\GitHub\Blog-Holy-Spirit
node test-n8n-webhook.js
```

**Esperado:**
```
✅ SUCESSO! Blog criado com sucesso
```

### 2. Browser
Abra: `http://localhost:3000/api/webhooks/n8n`

**Esperado:**
```json
{
  "status": "ok",
  "message": "Webhook n8n está ativo e receptivo",
  "endpoint": "/api/webhooks/n8n",
  "timestamp": "2025-02-05T..."
}
```

### 3. Admin Panel
Vá para: `http://localhost:3000/admin/my-blogs`

**Esperado:**
- Página carrega blogs
- Notificação de sincronização
- Novos blogs aparecem em tempo real

---

## 📊 Payloads de Teste

### cURL
```bash
curl -X POST http://localhost:3000/api/webhooks/n8n \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Teste Blog",
    "excerpt": "Um teste rápido",
    "content": "# Conteúdo de teste\n\nEste é um blog de teste.",
    "category": "Teste",
    "image": "https://via.placeholder.com/800x400"
  }'
```

### JavaScript (Node.js)
```javascript
fetch('http://localhost:3000/api/webhooks/n8n', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Teste Blog',
    excerpt: 'Um teste rápido',
    content: '# Conteúdo de teste\n\nEste é um blog de teste.',
    category: 'Teste'
  })
})
.then(r => r.json())
.then(console.log)
```

### Python (Requests)
```python
import requests

data = {
    "title": "Teste Blog",
    "excerpt": "Um teste rápido",
    "content": "# Conteúdo de teste\n\nEste é um blog de teste.",
    "category": "Teste"
}

response = requests.post(
    'http://localhost:3000/api/webhooks/n8n',
    json=data
)

print(response.status_code)
print(response.json())
```

---

## 📱 Status Codes

| Código | Significado | Ação |
|--------|-------------|------|
| **201** | Blog criado com sucesso | ✅ Tudo OK |
| **400** | Campos faltando | ❌ Verificar payload |
| **401** | Autenticação inválida | ❌ Verificar token |
| **429** | Rate limit excedido | ⏳ Aguarde 60s |
| **500** | Erro no servidor | ❌ Verificar DB |

---

## 🔍 Debugging

### Ver Polling no Browser
```javascript
// DevTools Console
// Coloque no console:
fetch('/api/posts/sync')
  .then(r => r.json())
  .then(d => console.log(`${d.count} blogs`, d.posts))
```

### Ver Logs do Webhook
No arquivo de rota: `app/api/webhooks/n8n/route.ts`

Procurar por mensagens:
```
✅ Success
❌ Rejected
📍 Received
```

### Verificar Banco Supabase
1. Abra https://app.supabase.com
2. Projeto: Blog-Holy-Spirit
3. Tabela: `posts`
4. Procure por `source = 'ai'`

---

## 🎯 Checklist Rápido

```bash
# 1. Configurar
cp .env.example .env.local
# Editar com credenciais

# 2. Testar
node test-n8n-webhook.js

# 3. Verificar saúde
curl http://localhost:3000/api/webhooks/n8n

# 4. Sincronizar
curl http://localhost:3000/api/posts/sync

# 5. Admin
# Ir para: http://localhost:3000/admin/my-blogs
# Clicar: Sincronizar Banco?
```

---

## 🚀 n8n Quick Setup

### URL Webhook
```
https://seu-app.com/api/webhooks/n8n
```

### Payload (JSON)
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

### Headers
```
Content-Type: application/json
Authorization: Bearer (opcional)
```

---

## 📈 Monitoramento

### Logs do Webhook
```bash
# Ver histórico no Supabase
SELECT * FROM posts WHERE source = 'ai' ORDER BY createdAt DESC;
```

### Ping Endpoint
```bash
# A cada 5 segundos
curl -I http://localhost:3000/api/posts/sync
# HTTP/1.1 200 OK
```

### DevTools Network
1. Abra DevTools (F12)
2. Aba Network
3. Procure por `/api/posts/sync`
4. Verifique response

---

## 🛠️ Comandos Úteis

```bash
# Iniciar app
npm run dev

# Build
npm run build

# Test webhook
node test-n8n-webhook.js

# Ver estrutura
ls -la app/api/webhooks/
```

---

## 📞 Links Importantes

| Item | Link |
|------|------|
| **n8n Dashboard** | https://seu-n8n.com |
| **Supabase** | https://app.supabase.com |
| **Admin Panel** | http://localhost:3000/admin |
| **Webhook Docs** | [N8N_WEBHOOK_GUIDE.md](N8N_WEBHOOK_GUIDE.md) |
| **Quick Start** | [QUICKSTART_N8N.md](QUICKSTART_N8N.md) |

---

## ✅ Confirmar Funcionamento

- [ ] `node test-n8n-webhook.js` → ✅ SUCESSO
- [ ] GET `/api/webhooks/n8n` → 200 OK
- [ ] GET `/api/posts/sync` → 200 OK com blogs
- [ ] Admin Meus Blogs carrega
- [ ] Notificação de sincronização aparece
- [ ] Novo blog do n8n aparece em tempo real

---

**Last Updated:** 2025-02-05
**Quick Use:** 3-5 minutos para testar tudo!
