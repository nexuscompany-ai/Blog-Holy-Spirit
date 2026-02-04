
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

    // Redireciona para o Webhook do n8n (Automação Externa)
    const n8nWebhookUrl = "https://felipealmeida0777.app.n8n.cloud/webhook/blog-generator";

    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tema: prompt,
        categoria: category || 'Geral',
        origem: source || 'admin_panel',
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro no Webhook n8n: ${errorText || response.statusText}`);
    }

    const data = await response.json().catch(() => ({ status: "success", message: "Processamento iniciado no n8n" }));

    return new Response(JSON.stringify(data), { status: 200, headers });
  } catch (error: any) {
    console.error("WEBHOOK ERROR:", error.message);
    return new Response(JSON.stringify({ 
      error: 'Falha ao acionar a automação n8n.',
      details: error.message
    }), { status: 500, headers });
  }
}
