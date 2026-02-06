/**
 * Configuração Centralizada do n8n
 * IMPORTANTE: Mantenha a URL atualizada aqui
 */

export const N8N_CONFIG = {
  /**
   * URL do webhook do n8n
   * ATUAL: https://felipealmeida0777.app.n8n.cloud/webhook/receberblog
   * 
   * Como obter:
   * 1. Acesse seu fluxo no n8n Cloud
   * 2. Procure o nó "Webhook" 
   * 3. Copie a URL completa
   * 4. Certifique-se de que o botão "Active" está LIGADO
   */
  WEBHOOK_URL: process.env.N8N_WEBHOOK_URL || "https://felipealmeida0777.app.n8n.cloud/webhook/receberblog",

  /**
   * Configurações de autenticação
   */
  AUTH: {
    ENABLED: process.env.N8N_WEBHOOK_AUTH === 'true',
    API_KEY: process.env.N8N_WEBHOOK_API_KEY || '',
    REQUIRE_SIGNATURE: process.env.N8N_REQUIRE_SIGNATURE === 'true',
    SECRET_KEY: process.env.N8N_WEBHOOK_SECRET || '',
  },

  /**
   * Configurações de requisição
   */
  REQUEST: {
    TIMEOUT_MS: 30 * 1000, // 30 segundos
    MAX_RETRIES: 3,
    RETRY_DELAY_MS: 1000,
    MAX_PAYLOAD_SIZE_MB: 10,
  },

  /**
   * Validação de payload
   */
  PAYLOAD: {
    REQUIRED_FIELDS: ['title', 'excerpt', 'content', 'category'],
    OPTIONAL_FIELDS: ['image', 'published', 'publishedAt', 'source'],
    MAX_TITLE_LENGTH: 200,
    MAX_EXCERPT_LENGTH: 500,
    MAX_CONTENT_LENGTH: 50000,
  },

  /**
   * Erros comuns e soluções
   */
  TROUBLESHOOTING: {
    404: {
      message: 'Webhook não encontrado',
      solutions: [
        '✓ Verifique se a URL está correta',
        '✓ Confirme que o botão "Active" está LIGADO no n8n',
        '✓ Certifique-se de que o fluxo está publicado',
      ],
    },
    500: {
      message: 'Erro no servidor n8n',
      solutions: [
        '✓ Verifique o console do n8n para erros',
        '✓ Confirme que todas as variáveis de ambiente estão configuradas',
        '✓ Teste a automação manualmente no n8n',
      ],
    },
    TIMEOUT: {
      message: 'Timeout na resposta do n8n',
      solutions: [
        '✓ Verifique a conexão de internet',
        '✓ Confirme que o n8n está respondendo',
        '✓ Reduza o tamanho do payload se muy grande',
      ],
    },
  }
};

/**
 * Função auxiliar para validar se a URL está correta
 */
export function validateWebhookUrl(): { valid: boolean; message: string } {
  const url = N8N_CONFIG.WEBHOOK_URL;
  
  if (!url) {
    return { valid: false, message: 'N8N_WEBHOOK_URL não está configurada' };
  }
  
  if (!url.includes('app.n8n.cloud') && !url.includes('localhost')) {
    return { valid: false, message: 'URL do n8n parece inválida' };
  }
  
  if (!url.includes('/webhook/')) {
    return { valid: false, message: 'URL deve conter /webhook/' };
  }
  
  return { valid: true, message: 'URL válida ✓' };
}

/**
 * Função para exibir configuração atual (útil para debug)
 */
export function printConfig() {
  console.log('📋 Configuração Atual do n8n:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🔗 Webhook URL: ${N8N_CONFIG.WEBHOOK_URL}`);
  console.log(`🔒 Auth Habilitado: ${N8N_CONFIG.AUTH.ENABLED}`);
  console.log(`⏱️  Timeout: ${N8N_CONFIG.REQUEST.TIMEOUT_MS}ms`);
  console.log(`🔄 Retries: ${N8N_CONFIG.REQUEST.MAX_RETRIES}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}
