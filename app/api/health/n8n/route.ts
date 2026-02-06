import { NextResponse } from 'next/server';

/**
 * Health Check Endpoint
 * Verifica a saúde da integração n8n
 * 
 * GET /api/health/n8n
 */

export async function GET() {
  const checks: any = {
    timestamp: new Date().toISOString(),
    checks: []
  };

  // 1. Verificar variável de ambiente
  const webhookUrl = process.env.N8N_WEBHOOK_URL || "https://felipealmeida0777.app.n8n.cloud/webhook/receberblog";
  checks.checks.push({
    name: 'Webhook URL Configurada',
    status: webhookUrl ? '✅ OK' : '❌ FALHA',
    value: webhookUrl
  });

  // 2. Testar conectividade com n8n webhook
  try {
    const healthResponse = await fetch(webhookUrl, {
      method: 'OPTIONS',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(5000)
    }).catch(() => null);

    checks.checks.push({
      name: 'Conectividade n8n',
      status: healthResponse ? '✅ OK' : '⚠️ TIMEOUT',
      statusCode: healthResponse?.status || 'timeout'
    });
  } catch (error: any) {
    checks.checks.push({
      name: 'Conectividade n8n',
      status: '❌ ERRO',
      error: error.message
    });
  }

  // 3. Testar endpoint receptor
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';
    
    const receiverResponse = await fetch(`${baseUrl}/api/webhooks/n8n`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(5000)
    }).catch(() => null);

    checks.checks.push({
      name: 'Endpoint Receptor',
      status: receiverResponse?.ok ? '✅ OK' : '⚠️ ERRO',
      statusCode: receiverResponse?.status
    });
  } catch (error: any) {
    checks.checks.push({
      name: 'Endpoint Receptor',
      status: '❌ ERRO',
      error: error.message
    });
  }

  // 4. Teste de integração completa
  try {
    const testPayload = {
      prompt: 'TEST',
      category: 'System Test',
      mode: 'preview'
    };

    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';

    const aiResponse = await fetch(`${baseUrl}/api/ai/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload),
      signal: AbortSignal.timeout(35000) // 35s (30s do n8n + 5s buffer)
    }).catch(err => ({ ok: false, error: err.message }));

    checks.checks.push({
      name: 'Integração Completa',
      status: (aiResponse as any).ok ? '✅ OK' : '⚠️ TESTADO',
      note: (aiResponse as any).error ? `Timeout esperado: ${(aiResponse as any).error}` : 'Conexão funcionando'
    });
  } catch (error: any) {
    checks.checks.push({
      name: 'Integração Completa',
      status: '❌ ERRO',
      error: error.message
    });
  }

  // Calcular status geral
  const failureCount = checks.checks.filter((c: any) => c.status.includes('❌')).length;
  checks.overall = failureCount === 0 ? '✅ SAUDÁVEL' : `⚠️ ${failureCount} PROBLEMAS`;

  return NextResponse.json(checks, { 
    status: failureCount > 1 ? 500 : 200 
  });
}

/**
 * POST para teste manual
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { webhook_url, test_payload } = body;

    const url = webhook_url || process.env.N8N_WEBHOOK_URL || 
      "https://felipealmeida0777.app.n8n.cloud/webhook/receberblog";

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(test_payload || { test: true }),
      signal: AbortSignal.timeout(10000)
    });

    const responseText = await response.text();
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { raw: responseText };
    }

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      webhook_url: url,
      response: responseData
    }, { status: response.status });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
