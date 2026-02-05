
export const config = {
  runtime: 'edge',
};

/**
 * PROXY HOLY SPIRIT -> N8N CLOUD (ORCHESTRATOR)
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

  try {
    const body = await req.json().catch(() => ({}));
    const { prompt, category, mode, postData } = body;

    const N8N_WEBHOOK_URL = "https://felipealmeida0777.app.n8n.cloud/webhook/blog-generator";

    // Prepara o payload para o n8n conforme o modo
    const payload = {
      mode: mode || 'preview',
      tema: prompt,
      categoria: category || 'Musculação',
      origem: 'holy_spirit_admin',
      timestamp: new Date().toISOString(),
      ...(mode === 'publish' ? { ...postData } : {})
    };

    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (n8nResponse.status === 404) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Webhook n8n não registrado.', 
        details: 'Verifique se o workflow está ATIVO (botão superior direito no n8n) e se a URL termina em /webhook/blog-generator' 
      }), { status: 404, headers });
    }

    const responseText = await n8nResponse.text();
    let responseData;
    
    try {
      responseData = JSON.parse(responseText);
      // Se n8n retornar array, pega o primeiro
      if (Array.isArray(responseData)) responseData = responseData[0];
    } catch {
      responseData = { success: false, error: 'Resposta inválida do n8n', raw: responseText };
    }

    if (!n8nResponse.ok) {
      return new Response(JSON.stringify({ 
        success: false,
        error: responseData.error || 'Erro no n8n',
        details: responseData.message || `Status ${n8nResponse.status}`
      }), { status: n8nResponse.status, headers });
    }

    return new Response(JSON.stringify(responseData), { status: 200, headers });

  } catch (error: any) {
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Falha de conexão Cloud.',
      details: error.message 
    }), { status: 500, headers });
  }
}
