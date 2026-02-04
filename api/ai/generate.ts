
export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método não permitido' }), { status: 405, headers });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { prompt, category, source } = body;

    // URL DE PRODUÇÃO DO SEU N8N
    const n8nWebhookUrl = "https://felipealmeida0777.app.n8n.cloud/webhook/blog-generator";

    console.log(`[n8n] Iniciando disparo para: ${n8nWebhookUrl}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 segundos de timeout

    try {
      const n8nResponse = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          tema: prompt,
          categoria: category || 'Geral',
          origem: source || 'admin_panel',
          timestamp: new Date().toISOString()
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      // Trata erro 404 especificamente (Workflow desativado no n8n)
      if (n8nResponse.status === 404) {
        return new Response(JSON.stringify({ 
          error: 'Workflow n8n Não Encontrado.',
          details: 'A URL de produção retornou 404. Certifique-se de que o workflow no n8n está ATIVADO (botão ON no canto superior direito).'
        }), { status: 404, headers });
      }

      if (!n8nResponse.ok) {
        const errorText = await n8nResponse.text();
        return new Response(JSON.stringify({ 
          error: 'O n8n recusou a conexão.',
          details: `Status: ${n8nResponse.status}. Resposta: ${errorText.slice(0, 100)}`
        }), { status: n8nResponse.status, headers });
      }

      return new Response(JSON.stringify({ 
        status: "success", 
        message: "Conexão estabelecida. O n8n iniciou o processamento." 
      }), { status: 200, headers });

    } catch (fetchError: any) {
      if (fetchError.name === 'AbortError') {
        return new Response(JSON.stringify({ 
          status: "success", 
          message: "O n8n recebeu o comando e está processando em background." 
        }), { status: 200, headers });
      }
      throw fetchError;
    }

  } catch (error: any) {
    console.error("[n8n Connection Error]:", error.message);
    return new Response(JSON.stringify({ 
      error: 'Falha na ponte de comunicação com o n8n.',
      details: error.message
    }), { status: 500, headers });
  }
}
