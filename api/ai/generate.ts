
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

    const N8N_WEBHOOK_URL = "https://felipealmeida0777.app.n8n.cloud/webhook/receberblog";

    // SHAPE DE DADOS EXPLICITO PARA O N8N
    const payload = {
      mode: mode || 'preview',
      tema: prompt,
      categoria: category || 'Musculação',
      origem: 'holy_spirit_admin',
      timestamp: new Date().toISOString(),
      status: 'draft', // FORÇA IA A SER SEMPRE DRAFT INICIAL
      source: 'ai',
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

    const responseText = await n8nResponse.text();
    
    if (n8nResponse.status === 404) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Workflow n8n Inativo', 
        details: 'O workflow no n8n Cloud não está ATIVO.' 
      }), { status: 404, headers });
    }

    let responseData;
    try {
      responseData = JSON.parse(responseText);
      if (Array.isArray(responseData)) responseData = responseData[0];
    } catch {
      responseData = { success: false, error: 'Erro no JSON do n8n', raw: responseText };
    }

    if (!n8nResponse.ok) {
      return new Response(JSON.stringify({ 
        success: false,
        error: responseData.error || 'Erro na Automação', 
        details: responseData.message || `Status ${n8nResponse.status}`
      }), { status: n8nResponse.status, headers });
    }

    return new Response(JSON.stringify(responseData), { status: 200, headers });

  } catch (error: any) {
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Falha Crítica de Conexão',
      details: error.message 
    }), { status: 500, headers });
  }
}
