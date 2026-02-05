
export const config = {
  runtime: 'edge',
};

/**
 * PROXY HOLY SPIRIT -> N8N CLOUD
 * Este proxy aguarda a resposta final do n8n contendo o artigo gerado.
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
    const { prompt, category } = body;

    // URL DE PRODUÇÃO DO WEBHOOK
    // Certifique-se que o Workflow está "ACTIVE" no n8n Cloud
    const N8N_WEBHOOK_URL = "https://felipealmeida0777.app.n8n.cloud/webhook/blog-generator";

    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        tema: prompt,
        categoria: category || 'Musculação',
        origem: 'holy_spirit_admin',
        timestamp: new Date().toISOString()
      }),
    });

    const responseText = await n8nResponse.text();
    
    // Tratamento específico para o erro de Webhook não registrado
    if (n8nResponse.status === 404) {
      return new Response(JSON.stringify({ 
        error: 'Webhook n8n não registrado.', 
        details: 'O workflow no n8n Cloud não está ATIVO ou o path "blog-generator" está incorreto no nó Webhook.' 
      }), { status: 404, headers });
    }

    let responseData;
    try {
      responseData = JSON.parse(responseText);
      if (Array.isArray(responseData)) responseData = responseData[0];
    } catch {
      responseData = { message: responseText };
    }

    if (!n8nResponse.ok) {
      return new Response(JSON.stringify({ 
        error: 'Erro no processamento do n8n.', 
        details: responseData.error || responseData.message || `Status ${n8nResponse.status}`
      }), { status: n8nResponse.status, headers });
    }

    // Retorna exatamente o formato que o seu workflow n8n produz
    return new Response(JSON.stringify(responseData), { status: 200, headers });

  } catch (error: any) {
    return new Response(JSON.stringify({ 
      error: 'Falha de conexão com a Cloud.',
      details: error.message 
    }), { status: 500, headers });
  }
}
