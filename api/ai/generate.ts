
export const config = {
  runtime: 'edge',
};

/**
 * PROXY DE INTEGRAÇÃO HOLY SPIRIT -> N8N CLOUD
 * Este arquivo faz a ponte entre o site e sua automação no n8n.
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
      return new Response(JSON.stringify({ error: 'O tema é obrigatório.' }), { status: 400, headers });
    }

    const N8N_WEBHOOK_URL = "https://felipealmeida0777.app.n8n.cloud/webhook/blog-generator";

    // Envio para o n8n
    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Connection': 'keep-alive'
      },
      body: JSON.stringify({
        tema: prompt,
        categoria: category || 'Musculação',
        origem: 'holy_spirit_admin',
        timestamp: new Date().toISOString()
      }),
    });

    const responseText = await n8nResponse.text();
    let responseData;

    try {
      responseData = JSON.parse(responseText);
      
      // n8n retorna frequentemente um array [ { ... } ]. 
      // Se for o caso, pegamos o primeiro item.
      if (Array.isArray(responseData) && responseData.length > 0) {
        responseData = responseData[0];
      }
    } catch (e) {
      responseData = { message: responseText };
    }

    if (!n8nResponse.ok) {
      return new Response(JSON.stringify({ 
        error: 'O n8n retornou um erro.', 
        details: responseData.error || responseData.message || `Status ${n8nResponse.status}`
      }), { status: n8nResponse.status, headers });
    }

    // Retorna para o front-end o sucesso vindo do n8n
    return new Response(JSON.stringify({
      success: responseData.success || responseData.status === 'success' || true,
      message: responseData.message || 'Workflow acionado!',
      post: responseData.post || null
    }), { status: 200, headers });

  } catch (error: any) {
    console.error("[Proxy Error]:", error);
    return new Response(JSON.stringify({ 
      error: 'Falha na comunicação com o Hub n8n.',
      details: error.message 
    }), { status: 500, headers });
  }
}
