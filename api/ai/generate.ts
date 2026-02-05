
export const config = {
  runtime: 'edge',
};

/**
 * PROXY DE INTEGRAÇÃO HOLY SPIRIT -> N8N CLOUD
 * Este arquivo garante que o front-end não sofra com bloqueios de CORS 
 * e que os dados cheguem limpos ao seu webhook.
 */
export default async function handler(req: Request) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
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
    const { prompt, category } = body;

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'O briefing (tema) é obrigatório.' }), { status: 400, headers });
    }

    // URL DO SEU WEBHOOK N8N
    const N8N_WEBHOOK_URL = "https://felipealmeida0777.app.n8n.cloud/webhook/blog-generator";

    // Envio para o n8n
    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        tema: prompt,
        categoria: category || 'Musculação',
        origem: 'holy_spirit_admin',
        timestamp: new Date().toISOString()
      }),
    });

    // Captura a resposta do n8n (pode ser texto ou JSON)
    const responseText = await n8nResponse.text();
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { rawResponse: responseText };
    }

    if (!n8nResponse.ok) {
      return new Response(JSON.stringify({ 
        error: 'O n8n recusou a requisição.', 
        details: `Status ${n8nResponse.status}: ${responseText.slice(0, 100)}`
      }), { status: n8nResponse.status, headers });
    }

    return new Response(JSON.stringify({
      status: 'success',
      message: 'Workflow n8n acionado com sucesso!',
      data: responseData
    }), { status: 200, headers });

  } catch (error: any) {
    return new Response(JSON.stringify({ 
      error: 'Erro na ponte de comunicação Cloud.',
      details: error.message 
    }), { status: 500, headers });
  }
}
