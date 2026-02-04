export const config = {
  runtime: 'edge',
};

const DEFAULT_N8N_WEBHOOK_URL =
  'https://felipealmeida0777.app.n8n.cloud/webhook/blog-generator';

export default async function handler(req: Request) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  // Apenas POST
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { prompt, category, source } = body;

    if (typeof prompt !== 'string' || !prompt.trim()) {
      return new Response(
        JSON.stringify({ error: 'Campo "prompt" é obrigatório.' }),
        { status: 400, headers }
      );
    }

    const n8nWebhookUrl =
      process.env.N8N_WEBHOOK_URL || DEFAULT_N8N_WEBHOOK_URL;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          tema: prompt,
          categoria: category || 'Geral',
          origem: source || 'admin_panel',
          timestamp: new Date().toISOString(),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(
          `Webhook n8n respondeu ${response.status}: ${errorText}`
        );
      }

      return new Response(
        JSON.stringify({
          status: 'success',
          message: 'Comando enviado com sucesso ao n8n.',
        }),
        { status: 200, headers }
      );
    } catch (err: any) {
      // Timeout proposital (processamento em background)
      if (err.name === 'AbortError') {
        return new Response(
          JSON.stringify({
            status: 'success',
            message:
              'Automação disparada. O n8n está processando em segundo plano.',
          }),
          { status: 200, headers }
        );
      }

      throw err;
    }
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: 'Erro na conexão com n8n.',
        details: error?.message || 'Erro desconhecido',
      }),
      { status: 500, headers }
    );
  }
}
