# ✅ Guia Passo a Passo - Testar Integração n8n

Complete todos os passos abaixo para garantir que a integração está funcionando.

---

## 📋 PRÉ-REQUISITOS

- [ ] Node.js instalado
- [ ] Projeto clonado e dependências instaladas (`npm install`)
- [ ] `.env.local` configurado com `N8N_WEBHOOK_URL`
- [ ] n8n Cloud account ativo
- [ ] Workflow "Blog Generator" criado no n8n

---

## ✅ TESTE 1: Verificar Configuração

### Passo 1.1: Verificar .env.local
```bash
# Abra o arquivo .env.local e confirme:
N8N_WEBHOOK_URL=https://felipealmeida0777.app.n8n.cloud/webhook/receberblog
```
-[ ] Linha encontrada
- [ ] URL correta

### Passo 1.2: Iniciar servidor
```bash
npm run dev
```
- [ ] Output mostra: `VITE ... ready in ... ms`
- [ ] Sem erros no console

---

## ✅ TESTE 2: Health Check

### Passo 2.1: Testar endpoint de saúde
```bash
# Em outro terminal:
curl http://localhost:3000/api/health/n8n
```

**Esperado:**
```json
{
  "overall": "✅ SAUDÁVEL",
  "checks": [
    { "name": "Webhook URL Configurada", "status": "✅ OK" },
    { "name": "Conectividade n8n", "status": "✅ OK" },
    { "name": "Endpoint Receptor", "status": "✅ OK" }
  ]
}
```

- [ ] Status `✅ SAUDÁVEL`
- [ ] Todos os checks em `✅ OK`

### Se alguns checks falharem:
```bash
# Verifique conectividade com n8n:
ping felipealmeida0777.app.n8n.cloud

# Se não responder:
# ❌ n8n pode estar offline - tente novamente em alguns minutos
```

---

## ✅ TESTE 3: Webhook Receptor

### Passo 3.1: Testar POST direto
```bash
curl -X POST http://localhost:3000/api/webhooks/n8n \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Blog de Teste",
    "excerpt": "Este é um blog de teste para validação",
    "content": "<p>Este é o conteúdo do blog de teste.</p><p>Pode conter HTML.</p>",
    "category": "Teste",
    "image": "https://via.placeholder.com/800x400?text=Blog+Teste",
    "published": true
  }'
```

**Esperado:**
```json
{
  "success": true,
  "message": "Blog criado com sucesso via n8n",
  "post": {
    "id": "uuid-aqui",
    "title": "Blog de Teste",
    ...
  }
}
```

- [ ] Status HTTP: `201`
- [ ] Campo `success`: `true`
- [ ] Campo `post` contém dados

### Passo 3.2: Verificar no Supabase
```bash
# Acesse seu painel Supabase e verifique:
# Table "posts" → Deve ter a nova linha com o blog de teste
```

- [ ] Nova linha apareceu em posts
- [ ] Dados correspondem ao enviado

---

## ✅ TESTE 4: Gerador IA (API)

### Passo 4.1: Testar preview
```bash
curl -X POST http://localhost:3000/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Escreva sobre os benefícios da musculação regularizada",
    "category": "Musculação",
    "mode": "preview"
  }'
```

**Esperado:**
```json
{
  "success": true,
  "post": {
    "title": "...",
    "excerpt": "...",
    "content": "<p>...</p>"
  }
}
```

- [ ] Resposta dentro de 30 segundos
- [ ] Body contém `post` com `title`, `excerpt`, `content`
- [ ] Status HTTP: `200`

**Se receber timeout:**
- [ ] Aguarde 30+ segundos
- [ ] Verifique conexão de internet
- [ ] Confirme que n8n está online

---

## ✅ TESTE 5: Interface Admin (Interface Gráfica)

### Passo 5.1: Acessar Admin
```
Abra no navegador: http://localhost:3000/admin
```
- [ ] Página carrega sem erros
- [ ] Dois botões no topo: "Escritora n8n" e "Manual"

### Passo 5.2: Testar Preview
1. [ ] Clique em "Escritora n8n"
2. [ ] Digite um tema no campo "Briefing do Post":
   ```
   Escreva um artigo sobre como iniciar uma rotina de musculação para iniciantes
   ```
3. [ ] Clique botão "OBTER PREVIEW"
4. [ ] Aguarde 5-15 segundos
5. [ ] Verifique console (`F12` → Console) para logs:
   ```
   📤 Enviando para n8n: https://...
   ✅ n8n respondeu com sucesso
   ```

- [ ] Lo preview aparece no lado direito
- [ ] Contém título, resumo, conteúdo
- [ ] Sem erro vermelho

### Passo 5.3: Testar Publicação
1. [ ] Após preview exibido, clique "PUBLICAR AGORA"
2. [ ] Status carrega com spinner
3. [ ] Aguarde 5-10 segundos
4. [ ] Notificação verde: "Post Sincronizado!"
5. [ ] Automaticamente redireciona para "Meus Blogs"

- [ ] Blog novo aparece na lista
- [ ] Contém o título correto
- [ ] Data de criação é atual

**Se receber erro:**
1. Procure por `request_id` no console (F12)
2. Anote o ID
3. Continue para TESTE 6

---

## ✅ TESTE 6: Logging e Rastreamento

### Passo 6.1: Abrir console do navegador
```
Pressione: F12 ou Ctrl+Shift+I
Menu: Inspect → Console
```

### Passo 6.2: Criar novo blog e observar logs
Procure por mensagens com `request_id`:

```
📤 Enviando para n8n: https://... (abc123xyz)
✅ n8n respondeu com sucesso (abc123xyz)
```

- [ ] Logs aparecem em ordem correta
- [ ] Todos têm o mesmo `request_id`
- [ ] Sem mensagens de erro vermelhas

### Passo 6.3: Se houver erro
Procure por padrões:
```
⚠️ Tentativa 1 falhou, retentando (2/3)
⚠️ Tentativa 2 falhou, retentando (3/3)
✅ Sucesso na 3ª tentativa!
```

- [ ] Retries devem ser tentados automaticamente
- [ ] Eventualmente deve ter sucesso

---

## ✅ TESTE 7: Teste de Failover

### Passo 7.1: Simular timeout no n8n
```bash
# Pausa o workflow no n8n por 35+ segundos
# Ou desativa temporariamente
```

### Passo 7.2: Tentar criar blog enquanto n8n está down
1. [ ] Interface admin
2. [ ] "Escritora n8n"
3. [ ] Clique "OBTER PREVIEW"
4. [ ] Aguarde ~30 segundos
5. [ ] Veja erro com mensagem útil

**Esperado:**
```
❌ Workflow n8n Inativo ou URL Incorreta
Instruções de troubleshooting...
```

- [ ] Mensagem de erro é clara
- [ ] Botão "REFAZER TEXTO" aparece
- [ ] Sem crash na interface

### Passo 7.3: Reativar n8n
```bash
# Volta a ativar o workflow no n8n
```

1. [ ] Agarde 1-2 minutos
2. [ ] Tente novamente
3. [ ] Deve funcionar

- [ ] Preview carrega normalmente
- [ ] Sem erros anteriores

---

## ✅ TESTE 8: Teste Manual com cURL (Opcional)

### Passo 8.1: Teste completo da cadeia
```bash
# 1. Health check
curl http://localhost:3000/api/health/n8n

# 2. Preview IA
curl -X POST http://localhost:3000/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Teste","category":"Teste","mode":"preview"}'

# 3. Webhook direto
curl -X POST http://localhost:3000/api/webhooks/n8n \
  -H "Content-Type: application/json" \
  -d '{"title":"Teste","excerpt":"Teste","content":"<p>Teste</p>","category":"Teste"}'
```

- [ ] Todos os 3 requests retornam sucesso
- [ ] Status codes: 200, 200, 201

---

## 📊 Perfil de Teste

| Teste | Status | Problema? |
|-------|--------|-----------|
| 1. Configuração | ✅ ou ❌ | |
| 2. Health Check | ✅ ou ❌ | |
| 3. Webhook Receptor | ✅ ou ❌ | |
| 4. Gerador IA | ✅ ou ❌ | |
| 5. Interface Admin | ✅ ou ❌ | |
| 6. Logging | ✅ ou ❌ | |
| 7. Failover | ✅ ou ❌ | |
| 8. cURL Manual | ✅ ou ❌ | |

---

## 🎯 Resultado Esperado

Após completar todos os testes:

- ✅ Health check mostra "SAUDÁVEL"
- ✅ Preview funciona em ~10 segundos
- ✅ Blog é publicado e aparece em "Meus Blogs"
- ✅ Logs aparecem no console
- ✅ Erros têm mensagens úteis
- ✅ Retry automático funciona se timeout

---

## 🆘 Troubleshooting

### Se falhar no Teste 2 (Health Check)
```
❌ Webhook URL Configurada: ❌ FALHA
Solução: Edite .env.local e adicione N8N_WEBHOOK_URL=...
```

### Se falhar no Teste 4 (Gerador IA)
```
❌ Timeout na resposta
Solução: n8n pode estar down. Verifique:
https://felipealmeida0777.app.n8n.cloud
Botão "Active" deve estar VERDE
```

### Se falhar no Teste 5 (Admin Interface)
```
❌ "Workflow n8n Inativo"
Solução: Abra seu workflow no n8n e clique o botão "Active"
```

### Para qualquer outro erro:
1. Procure por `request_id` no console
2. Procure por mensagens com emoji ❌ ou ⚠️
3. Leia a mensagem de erro
4. Consulte: N8N_WEBHOOK_SETUP.md

---

## ✅ Checklist Final

Quando terminar todos os testes:

- [ ] Health check: ✅ OK
- [ ] Webhook receptor: ✅ OK
- [ ] Gerador IA: ✅ OK
- [ ] Interface admin: ✅ OK
- [ ] Preview funciona: ✅ OK
- [ ] Publicação funciona: ✅ OK
- [ ] Logging funciona: ✅ OK
- [ ] Retry automático: ✅ OK

**Se tudo marcado:** 🎉 **SISTEMA PRONTO PARA USO!**

---

**Tempo total de testes:** ~15-20 minutos  
**Data:** 2024-02-06  
**Status:** ✅ Todos os testes devem passar
