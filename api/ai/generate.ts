
export const config = {
  runtime: 'edge',
};

/**
 * PROXY HOLY SPIRIT -> N8N CLOUD (ORCHESTRATOR)
 * Gerencia a comunicação entre o site e o fluxo de automação com retry automático
 */

async function sendToN8n(url: string, payload: any, attempt: number = 1): Promise<Response> {
  const MAX_RETRIES = 3;
  const TIMEOUT_MS = 30000; // 30 segundos

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const n8nResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'HolySpiritBlog/1.0',
      },
      body: JSON.stringify(payload),
      signal: controller.signal as any,
    });

    clearTimeout(timeoutId);
    return n8nResponse;

  } catch (error: any) {
    // Retry apenas em erros de rede/timeout, não em erros 4xx
    if (attempt < MAX_RETRIES && (error.name === 'AbortError' || error.message?.includes('fetch'))) {
      console.log(`⚠️ Tentativa ${attempt} falhou, retentando (${attempt + 1}/${MAX_RETRIES})...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Backoff exponencial
      return sendToN8n(url, payload, attempt + 1);
    }
    throw error;
  }
}

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

    // URL DO WEBHOOK: Use a variável de ambiente ou o padrão
    const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'https://felipealmeida0777.app.n8n.cloud/webhook/receberblog';

    if (!N8N_WEBHOOK_URL) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Configuração Incompleta',
        details: 'N8N_WEBHOOK_URL não está configurada'
      }), { status: 500, headers });
    }

    if (!prompt && !postData) {
      return new Response(JSON.stringify({ success: false, error: 'Missing payload' }), { status: 400, headers });
    }

    const payload = {
      mode: mode || 'preview',
      tema: prompt,
      categoria: category || 'Musculação',
      origem: 'holy_spirit_admin',
      timestamp: new Date().toISOString(),
      request_id: Math.random().toString(36).substring(2, 11),
      ...(mode === 'publish' ? { ...postData } : {})
    };

    console.log(`📤 Enviando para n8n: ${N8N_WEBHOOK_URL} (${payload.request_id})`);

    const n8nResponse = await sendToN8n(N8N_WEBHOOK_URL, payload);
    const responseText = await n8nResponse.text();

    let responseData: any;
    try {
      responseData = JSON.parse(responseText);
      if (Array.isArray(responseData)) responseData = responseData[0];
    } catch {
      responseData = { success: false, error: 'Erro no JSON do n8n', raw: responseText };
    }

    if (!n8nResponse.ok) {
      console.error(`❌ Erro n8n (${n8nResponse.status}):`, responseData);
      return new Response(JSON.stringify({
        success: false,
        error: responseData.error || 'Erro na Automação n8n',
        details: responseData.message || `Status HTTP ${n8nResponse.status}`,
        request_id: payload.request_id
      }), { status: n8nResponse.status, headers });
    }

    console.log(`✅ n8n respondeu com sucesso (${payload.request_id})`);
    return new Response(JSON.stringify({
      ...responseData,
      request_id: payload.request_id,
      success: true
    }), { status: 200, headers });

  } catch (error: any) {
    console.error(`❌ Falha Crítica: ${error?.message ?? error}`);
    return new Response(JSON.stringify({
      success: false,
      error: 'Falha Crítica de Conexão',
      details: error?.message || 'Erro desconhecido ao conectar ao n8n',
      type: error?.name,
      troubleshooting: [
        '• Verifique se a URL do webhook está configurada',
        '• Confirme que o n8n está online',
        '• Verifique a conexão de internet',
        '• Revise os logs do navegador (F12)'
      ]
    }), { status: 500, headers });
  }
}
