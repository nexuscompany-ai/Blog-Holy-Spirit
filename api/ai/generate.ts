
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
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { prompt, category, source } = body;

    // URL DE PRODUÇÃO DO SEU PRINT
    const n8nWebhookUrl = "https://felipealmeida0777.app.n8n.cloud/webhook/blog-generator";

    // Estratégia de Time-out Curto: Se o n8n não responder em 5s, 
    // liberamos o frontend pois o n8n processa em background.
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      await fetch(n8nWebhookUrl, {
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

      return new Response(JSON.stringify({ 
        status: "success", 
        message: "Comando enviado com sucesso ao n8n." 
      }), { status: 200, headers });

    } catch (e: any) {
      // Se der timeout (AbortError), ainda consideramos sucesso no envio
      if (e.name === 'AbortError') {
        return new Response(JSON.stringify({ 
          status: "success", 
          message: "Automação disparada. O n8n está processando em segundo plano." 
        }), { status: 200, headers });
      }
      throw e;
    }

  } catch (error: any) {
    return new Response(JSON.stringify({ 
      error: 'Erro na conexão com n8n.',
      details: error.message
    }), { status: 500, headers });
  }
}
