/**
 * Configuração Recomendada para Webhook n8n
 * 
 * Este arquivo exemplifica as melhores práticas de segurança
 * para o webhook do n8n em produção.
 */

// ===== VARIÁVEIS DE AMBIENTE NECESSÁRIAS =====

const N8N_WEBHOOK_CONFIG = {
  // Autenticação (opcional mas recomendado)
  ENABLE_AUTH: process.env.N8N_WEBHOOK_AUTH === 'true',
  API_KEY: process.env.N8N_WEBHOOK_API_KEY || '',
  
  // Rate limiting
  MAX_REQUESTS_PER_MINUTE: 60,
  MAX_PAYLOAD_SIZE_MB: 10,
  
  // Validação
  REQUIRE_SIGNATURE: process.env.N8N_REQUIRE_SIGNATURE === 'true',
  SECRET_KEY: process.env.N8N_WEBHOOK_SECRET || '',
};

// ===== EXEMPLO DE AUTENTICAÇÃO SIMPLES =====

export function verifyWebhookAuth(request: Request): boolean {
  if (!N8N_WEBHOOK_CONFIG.ENABLE_AUTH) {
    return true; // Desabilitado em desenvolvimento
  }

  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    console.warn('⚠️ Webhook recebido sem autenticação');
    return false;
  }

  const expectedAuth = `Bearer ${N8N_WEBHOOK_CONFIG.API_KEY}`;
  return authHeader === expectedAuth;
}

// ===== EXEMPLO DE RATE LIMITING =====

const requestCounts = new Map<string, number[]>();

export function checkRateLimit(clientIp: string): boolean {
  const now = Date.now();
  const oneMinuteAgo = now - 60 * 1000;
  
  const timestamps = requestCounts.get(clientIp) || [];
  const recentRequests = timestamps.filter(t => t > oneMinuteAgo);
  
  if (recentRequests.length >= N8N_WEBHOOK_CONFIG.MAX_REQUESTS_PER_MINUTE) {
    console.warn(`⚠️ Rate limit excedido para IP: ${clientIp}`);
    return false;
  }
  
  recentRequests.push(now);
  requestCounts.set(clientIp, recentRequests);
  return true;
}

// ===== EXEMPLO DE VALIDAÇÃO DE PAYLOAD =====

export interface WebhookPayload {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image?: string;
  published?: boolean;
  publishedAt?: string;
}

export function validatePayload(payload: any): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validar campos obrigatórios
  if (!payload.title || typeof payload.title !== 'string' || payload.title.trim().length === 0) {
    errors.push('Campo "title" é obrigatório e deve ser uma string não vazia');
  }

  if (!payload.excerpt || typeof payload.excerpt !== 'string' || payload.excerpt.trim().length === 0) {
    errors.push('Campo "excerpt" é obrigatório e deve ser uma string não vazia');
  }

  if (!payload.content || typeof payload.content !== 'string' || payload.content.trim().length === 0) {
    errors.push('Campo "content" é obrigatório e deve ser uma string não vazia');
  }

  if (!payload.category || typeof payload.category !== 'string' || payload.category.trim().length === 0) {
    errors.push('Campo "category" é obrigatório e deve ser uma string não vazia');
  }

  // Validar campos opcionais
  if (payload.image && typeof payload.image !== 'string') {
    errors.push('Campo "image" deve ser uma URL válida');
  }

  if (payload.published !== undefined && typeof payload.published !== 'boolean') {
    errors.push('Campo "published" deve ser um booleano');
  }

  if (payload.publishedAt && isNaN(new Date(payload.publishedAt).getTime())) {
    errors.push('Campo "publishedAt" deve ser uma data ISO válida');
  }

  // Validar tamanho
  const payloadSize = JSON.stringify(payload).length / 1024 / 1024;
  if (payloadSize > N8N_WEBHOOK_CONFIG.MAX_PAYLOAD_SIZE_MB) {
    errors.push(`Payload excede o tamanho máximo de ${N8N_WEBHOOK_CONFIG.MAX_PAYLOAD_SIZE_MB}MB`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// ===== EXEMPLO DE ASSINATURA HMAC (OPCIONAL) =====

export function verifySignature(
  payload: string,
  signature: string
): boolean {
  if (!N8N_WEBHOOK_CONFIG.REQUIRE_SIGNATURE) {
    return true; // Desabilitado
  }

  // Implementar verificação HMAC
  // const crypto = require('crypto');
  // const expectedSignature = crypto
  //   .createHmac('sha256', N8N_WEBHOOK_CONFIG.SECRET_KEY)
  //   .update(payload)
  //   .digest('hex');
  
  // return signature === expectedSignature;
  return true;
}

// ===== LOGAGEM E MONITORAMENTO =====

export function logWebhookEvent(
  event: 'received' | 'success' | 'error' | 'rejected',
  data: {
    title?: string;
    clientIp?: string;
    error?: string;
    timestamp?: Date;
  }
) {
  const timestamp = new Date().toISOString();
  
  const logMessage = {
    event,
    timestamp,
    ...data
  };

  if (event === 'error' || event === 'rejected') {
    console.error('❌', JSON.stringify(logMessage));
  } else if (event === 'success') {
    console.log('✅', JSON.stringify(logMessage));
  } else {
    console.log('📍', JSON.stringify(logMessage));
  }
}

// ===== EXPORT =====

export const webhookConfig = N8N_WEBHOOK_CONFIG;
