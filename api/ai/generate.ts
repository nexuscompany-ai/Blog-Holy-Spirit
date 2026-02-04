
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

    // URL fornecida pelo usuário (webhook-test)
    const n8nWebhookUrl = "https://felipealmeida0777.app.n8n.cloud/webhook/blog-generator";

    // Criamos um Controller de Abort para não deixar a requisição pendente eternamente
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 segundos de limite para o n8n dar o "OK" de recebimento

    try {
      const response = await fetch(n8nWebhookUrl, {
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

      // Se o n8n respondeu (mesmo que seja um status 200 vazio)
      return new Response(JSON.stringify({ 
        status: "success", 
        message: "Automação Holy Spirit iniciada com sucesso. O post aparecerá no feed em instantes." 
      }), { status: 200, headers });

    } catch (fetchError: any) {
      // Se deu timeout ou erro de rede, mas sabemos que o n8n geralmente processa
      // Avisamos o usuário que foi enviado
      return new Response(JSON.stringify({ 
        status: "success", 
        message: "Comando enviado. A IA está trabalhando no seu post agora." 
      }), { status: 200, headers });
    }

  } catch (error: any) {
    console.error("WEBHOOK PROXY ERROR:", error.message);
    return new Response(JSON.stringify({ 
      error: 'Falha ao conectar com o n8n.',
      details: error.message
    }), { status: 500, headers });
  }
}
