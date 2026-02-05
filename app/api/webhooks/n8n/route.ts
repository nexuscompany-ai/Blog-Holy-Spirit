import { PostsService } from '../../../../services/posts.service';
import { 
  verifyWebhookAuth, 
  checkRateLimit, 
  validatePayload, 
  verifySignature,
  logWebhookEvent,
  WebhookPayload 
} from '../../../../lib/webhook-config';

/**
 * Webhook do n8n para receber blogs gerados automaticamente
 * 
 * Expected payload:
 * {
 *   title: string;
 *   excerpt: string;
 *   content: string;
 *   category: string;
 *   image?: string;
 *   publishedAt?: string;
 *   published?: boolean;
 * }
 * 
 * Headers opcionais:
 *   Authorization: Bearer YOUR_API_KEY
 *   X-n8n-Signature: HMAC_SIGNATURE
 */

export async function POST(request: Request) {
  try {
    // 1. Obter IP do cliente
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                     request.headers.get('x-real-ip') ||
                     'unknown';

    logWebhookEvent('received', { clientIp });

    // 2. Verificar autenticação
    if (!verifyWebhookAuth(request)) {
      logWebhookEvent('rejected', {
        clientIp,
        error: 'Autenticação inválida ou ausente'
      });
      return new Response(
        JSON.stringify({ error: 'Autenticação obrigatória' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. Verificar rate limit
    if (!checkRateLimit(clientIp)) {
      logWebhookEvent('rejected', {
        clientIp,
        error: 'Rate limit excedido'
      });
      return new Response(
        JSON.stringify({ error: 'Rate limit excedido. Tente novamente em breve.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 4. Parsear body
    const body = await request.json();

    // 5. Validar payload
    const validation = validatePayload(body);
    if (!validation.valid) {
      logWebhookEvent('rejected', {
        clientIp,
        error: `Validação falhou: ${validation.errors.join(', ')}`
      });
      return new Response(
        JSON.stringify({ 
          error: 'Validação do payload falhou',
          details: validation.errors
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 6. Verificar assinatura (se configurado)
    const signature = request.headers.get('X-n8n-Signature') || '';
    const payloadString = JSON.stringify(body);
    if (!verifySignature(payloadString, signature)) {
      logWebhookEvent('rejected', {
        clientIp,
        error: 'Assinatura inválida'
      });
      return new Response(
        JSON.stringify({ error: 'Assinatura inválida' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 7. Criar o post
    const newPost = await PostsService.create({
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      category: body.category,
      image: body.image || 'https://via.placeholder.com/800x400?text=Blog',
      source: 'ai',
      published: body.published !== false,
      publishedAt: body.publishedAt || new Date().toISOString(),
    });

    logWebhookEvent('success', {
      title: body.title,
      clientIp
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Blog criado com sucesso via n8n',
        post: newPost
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    logWebhookEvent('error', {
      error: errorMessage
    });

    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Erro ao processar webhook',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * GET para testar a saúde do webhook
 */
export async function GET() {
  return new Response(
    JSON.stringify({
      status: 'ok',
      message: 'Webhook n8n está ativo e receptivo',
      endpoint: '/api/webhooks/n8n',
      method: 'POST',
      documentation: 'Veja N8N_WEBHOOK_GUIDE.md para instruções completas',
      timestamp: new Date().toISOString()
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}

