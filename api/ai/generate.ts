export const config = {
  runtime: 'edge',
};

const DEFAULT_N8N_WEBHOOK_URL =
  'https://felipealmeida0777.app.n8n.cloud/webhook/blog-generator';

const corsHeaders: HeadersInit = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
  'Content-Type': 'application/json',
};

export default async function handler(req: Request): Promise<Response> {
  // Preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: corsHeaders }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'JSON inválido' }),
      { status: 400, headers: corsHeaders }
    );
  }

  const { prompt, category, source } = body;

  if (!prompt || typeof prompt !== 'string') {
    return new Response(
      JSON.stringify({ error: 'Campo "prompt" é obrigatório' }),
      { status: 400, headers: corsHeaders }
    );
  }

  const webhookUrl =
    process.env.N8N_WEBHOOK_URL || DEFAULT_N8N_WEBHOOK_URL;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        tema: prompt,
        categoria: category ?? 'Geral',
        origem: source ?? 'admin_panel',
        created_at: new Date().toISOString(),
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`n8n respondeu ${res.status}: ${text}`);
    }

    return new Response(
      JSON.stringify({
        status: 'ok',
        message: 'Automação enviada para o n8n',
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      return new Response(
        JSON.stringify({
          status: 'ok',
          message: 'Workflow disparado. Processando em segundo plano.',
        }),
        { status: 200, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({
        error: 'Erro ao conectar com o n8n',
        details: err?.message || 'Erro desconhecido',
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}
