
export const config = {
  runtime: 'edge',
};

/**
 * PROXY DE AUTOMAÇÃO (N8N BRIDGE)
 * Este endpoint não processa IA. Ele apenas encaminha a requisição 
 * de forma segura para o cérebro da operação: o n8n.
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

    // Teste de conexão simples (Ping)
    if (prompt === 'PING') {
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Hub de Automação Online" 
      }), { status: 200, headers });
    }

    // A URL do Webhook do n8n deve ser configurada nas variáveis de ambiente do servidor
    const N8N_WEBHOOK_URL = process.env.VITE_N8N_WEBHOOK_URL || 'https://felipealmeida0777.app.n8n.cloud/webhook/blog-generator';

    // Encaminha os dados para o n8n
    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        category,
        mode,
        postData,
        timestamp: new Date().toISOString()
      }),
    });

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      throw new Error(`Erro no n8n: ${n8nResponse.status} - ${errorText}`);
    }

    const result = await n8nResponse.json();

    // Retorna a resposta processada pelo n8n para o frontend
    return new Response(JSON.stringify({
      success: true,
      ...result
    }), { status: 200, headers });

  } catch (error: any) {
    console.error("Automation Bridge Error:", error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Falha na Automação Editorial',
      details: error.message 
    }), { status: 500, headers });
  }
}
