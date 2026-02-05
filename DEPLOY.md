
# 🚀 Guia de Lançamento Holy Spirit Gym

Para colocar este site no ar em produção, siga estes passos:

### 1. Supabase (Banco de Dados e Auth)
- Crie um projeto em [supabase.com](https://supabase.com).
- No **SQL Editor**, cole e execute o conteúdo do arquivo `supabase_schema.sql`.
- Em **Authentication > Users**, crie seu usuário admin.
- No **Table Editor**, na tabela `profiles`, mude o campo `role` do seu usuário para `admin`.

### 2. Hosting (Vercel / Netlify / Cloudflare)
Conecte seu repositório Git e adicione as seguintes **Environment Variables**:

| Variável | Valor |
| :--- | :--- |
| `VITE_SUPABASE_URL` | Sua URL do Supabase (Project Settings > API) |
| `VITE_SUPABASE_ANON_KEY` | Sua Anon Key do Supabase (Project Settings > API) |
| `API_KEY` | Sua chave do Google Gemini (para a Escritora IA) |

### 3. DNS
Aponte seu domínio `holyspiritgym.com.br` para o provedor de hosting escolhido.

### 4. Automação (Auto-Pilot)
Para que os blogs sejam gerados sozinhos de madrugada:
- Configure um **GitHub Action** ou um **Supabase Edge Function** com um cron job que chame um script de geração usando a mesma lógica do `CreateBlog.tsx`.

---
*Treine o Templo. Para a Glória do Criador.*
