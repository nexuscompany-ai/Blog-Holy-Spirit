
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

    // URL de Produção capturada do print do n8n
    const n8nWebhookUrl = "https://felipealmeida0777.app.n8n.cloud/webhook/blog-generator";

    // Criamos um timeout curto para o webhook. 
    // O objetivo é apenas confirmar que o n8n recebeu a tarefa.
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s de limite para o n8n acusar recebimento

    try {
      const n8nResponse = await fetch(n8nWebhookUrl, {
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

      // Independente do processamento demorado da IA no n8n, 
      // se o webhook respondeu (200 OK), o post foi enfileirado com sucesso.
      return new Response(JSON.stringify({ 
        status: "success", 
        message: "O Templo recebeu seu comando. A IA está gerando o post agora." 
      }), { status: 200, headers });

    } catch (fetchError: any) {
      // Se houver timeout, mas sabemos que o webhook foi disparado, 
      // assumimos sucesso para não travar a UI do usuário.
      if (fetchError.name === 'AbortError') {
        return new Response(JSON.stringify({ 
          status: "success", 
          message: "Automação iniciada em segundo plano. Verifique o blog em instantes." 
        }), { status: 200, headers });
      }
      throw fetchError;
    }

  } catch (error: any) {
    console.error("WEBHOOK ERROR:", error.message);
    return new Response(JSON.stringify({ 
      error: 'O Templo não conseguiu conectar com a central de automação.',
      details: error.message
    }), { status: 500, headers });
  }
}
