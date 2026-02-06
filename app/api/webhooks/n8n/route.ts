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
  const requestId = Math.random().toString(36).substring(2, 11);
  const receivedAt = new Date().toISOString();

  try {
    // 1. Obter IP do cliente
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                     request.headers.get('x-real-ip') ||
                     'unknown';

    console.log(`📨 [${requestId}] Webhook recebido de ${clientIp} em ${receivedAt}`);
    logWebhookEvent('received', { clientIp });

    // 2. Verificar autenticação
    if (!verifyWebhookAuth(request)) {
      console.log(`🔒 [${requestId}] Autenticação falhou`);
      logWebhookEvent('rejected', {
        clientIp,
        error: 'Autenticação inválida ou ausente'
      });
      return new Response(
        JSON.stringify({ 
          error: 'Autenticação obrigatória',
          request_id: requestId
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. Verificar rate limit
    if (!checkRateLimit(clientIp)) {
      console.log(`⚠️ [${requestId}] Rate limit excedido para ${clientIp}`);
      logWebhookEvent('rejected', {
        clientIp,
        error: 'Rate limit excedido'
      });
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit excedido. Tente novamente em breve.',
          request_id: requestId
        }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 4. Parsear body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error(`❌ [${requestId}] Erro ao fazer parse do JSON`);
      return new Response(
        JSON.stringify({ 
          error: 'JSON inválido',
          request_id: requestId
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📦 [${requestId}] Payload recebido:`, { title: body.title, category: body.category });

    // 5. Validar payload
    const validation = validatePayload(body);
    if (!validation.valid) {
      console.log(`❌ [${requestId}] Validação falhou:`, validation.errors);
      logWebhookEvent('rejected', {
        clientIp,
        error: `Validação falhou: ${validation.errors.join(', ')}`
      });
      return new Response(
        JSON.stringify({ 
          error: 'Validação do payload falhou',
          details: validation.errors,
          request_id: requestId
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 6. Verificar assinatura (se configurado)
    const signature = request.headers.get('X-n8n-Signature') || '';
    const payloadString = JSON.stringify(body);
    if (!verifySignature(payloadString, signature)) {
      console.warn(`🔐 [${requestId}] Assinatura inválida`);
      logWebhookEvent('rejected', {
        clientIp,
        error: 'Assinatura inválida'
      });
      return new Response(
        JSON.stringify({ 
          error: 'Assinatura inválida',
          request_id: requestId
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 7. Criar o post com retry automático
    let newPost;
    let retryCount = 0;
    const MAX_RETRIES = 2;

    while (retryCount <= MAX_RETRIES) {
      try {
        console.log(`💾 [${requestId}] Salvando post no banco (tentativa ${retryCount + 1}/${MAX_RETRIES + 1})...`);
        
        // Determine published and publishedAt correctly
        const publishedFlag = body.published === true || body.published === 'true' || body.published === undefined && false;
        const publishedAtValue = (body.published === true || body.published === 'true')
          ? (body.publishedAt ? body.publishedAt : new Date().toISOString())
          : undefined;

        newPost = await PostsService.create({
          title: body.title,
          excerpt: body.excerpt,
          content: body.content,
          category: body.category,
          image: body.image || 'https://via.placeholder.com/800x400?text=Blog',
          source: 'ai',
          published: body.published !== false && body.published !== 'false',
          publishedAt: publishedAtValue,
        });

        console.log(`✅ [${requestId}] Post salvo com sucesso: ${newPost.id}`);
        break; // Saiu do loop de retry
      } catch (dbError: any) {
        retryCount++;
        if (retryCount <= MAX_RETRIES) {
          console.warn(`⚠️ [${requestId}] Erro no banco (${dbError.message}), retentando...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)); // Backoff
        } else {
          throw dbError; // Falhou após retries
        }
      }
    }

    if (!newPost) {
      throw new Error('Falha ao salvar post após múltiplas tentativas');
    }

    logWebhookEvent('success', {
      title: body.title,
      clientIp
    });

    console.log(`🎉 [${requestId}] Webhook processado com sucesso em ${(new Date().getTime() - new Date(receivedAt).getTime())}ms`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Blog criado com sucesso via n8n',
        post: newPost,
        request_id: requestId,
        processed_at: new Date().toISOString()
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    console.error(`❌ [${requestId}] Erro crítico: ${errorMessage}`);
    logWebhookEvent('error', {
      error: errorMessage
    });

    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Erro ao processar webhook',
        details: process.env.NODE_ENV === 'development' ? errorMessage : 'Erro no servidor',
        request_id: requestId
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * GET para testar a saúde do webhook
 */
export async function GET() {
  const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || "https://felipealmeida0777.app.n8n.cloud/webhook/receberblog";
  
  return new Response(
    JSON.stringify({
      status: 'ok',
      message: 'Webhook n8n está ativo e receptivo',
      endpoint: '/api/webhooks/n8n',
      method: 'POST',
      n8n_webhook: N8N_WEBHOOK_URL,
      documentation: 'Veja N8N_WEBHOOK_GUIDE.md para instruções completas',
      timestamp: new Date().toISOString()
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}

