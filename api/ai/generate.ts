
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

  // Resposta para Preflight OPTIONS (CORS)
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Apenas POST é permitido' }), { status: 405, headers });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { prompt, category, source } = body;

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'O prompt (briefing) é obrigatório.' }), { status: 400, headers });
    }

    // URL DE PRODUÇÃO DO SEU WEBHOOK N8N
    const N8N_WEBHOOK_URL = "https://felipealmeida0777.app.n8n.cloud/webhook/blog-generator";

    console.log(`[Proxy n8n] Enviando para: ${N8N_WEBHOOK_URL}`);

    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        tema: prompt,
        categoria: category || 'Geral',
        origem: source || 'holy_spirit_web',
        timestamp: new Date().toISOString()
      }),
    });

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      return new Response(JSON.stringify({ 
        error: 'O n8n retornou um erro.', 
        details: `Status: ${n8nResponse.status} - ${errorText.slice(0, 100)}` 
      }), { status: n8nResponse.status, headers });
    }

    // O n8n costuma retornar um JSON ou apenas um status 200/201
    const n8nData = await n8nResponse.json().catch(() => ({ status: 'success' }));

    return new Response(JSON.stringify({
      status: 'success',
      message: 'Briefing enviado com sucesso para o n8n!',
      n8n_response: n8nData
    }), { status: 200, headers });

  } catch (error: any) {
    console.error("[Fatal Error Proxy]:", error);
    return new Response(JSON.stringify({ 
      error: 'Falha crítica na comunicação com a nuvem.',
      details: error.message 
    }), { status: 500, headers });
  }
}
