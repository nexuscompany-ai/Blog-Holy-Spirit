#!/usr/bin/env node

/**
 * Script de Teste para Webhook n8n
 * 
 * Este script testa a integração com o webhook do n8n
 * Uso: node test-n8n-webhook.js
 */

const WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'http://localhost:3000/api/webhooks/n8n';

const sampleBlog = {
  title: 'A Importância da Oração no Cotidiano',
  excerpt: 'Entenda como a oração pode transformar sua vida espiritual e fortalecer sua fé diária.',
  content: `
    A oração é uma prática fundamental na vida espiritual de qualquer crente. 
    Ela nos conecta diretamente com Deus e nos permite expressar nossas preocupações, 
    gratidão e esperança.
    
    ## Por que orar?
    
    - Fortalece nossa relação com Deus
    - Traz paz interior e tranquilidade
    - Nos transforma espiritualmente
    - Nos dá força para enfrentar desafios
    
    ## Como começar a orar
    
    1. Escolha um local tranquilo
    2. Feche os olhos e respire fundo
    3. Fale de coração
    4. Agradeça pelas bênçãos
    5. Peça o que o seu coração deseja
    
    A oração constante nos proporciona uma vida mais religiosa e conectada com o divino.
  `,
  category: 'Espiritualidade',
  image: 'https://via.placeholder.com/800x400?text=Oração+Espiritual',
  published: true,
  publishedAt: new Date().toISOString()
};

async function testWebhook() {
  console.log('🔍 Testando Webhook n8n...\n');
  console.log(`📍 URL: ${WEBHOOK_URL}\n`);

  try {
    console.log('📤 Enviando payload...');
    console.log(JSON.stringify(sampleBlog, null, 2));
    console.log('\n⏳ Aguardando resposta...\n');

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sampleBlog)
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ SUCESSO! Blog criado com sucesso\n');
      console.log('📊 Resposta do servidor:');
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.log('❌ ERRO ao criar blog\n');
      console.log('📊 Resposta do servidor:');
      console.log(JSON.stringify(data, null, 2));
    }

    console.log(`\n📅 Timestamp: ${new Date().toISOString()}`);
    console.log(`🔗 Status HTTP: ${response.status}`);

  } catch (error) {
    console.error('❌ Erro na requisição:');
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Verificar saúde do webhook
async function checkHealth() {
  console.log('🏥 Verificando saúde do webhook...\n');

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'GET'
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Webhook está operacional!\n');
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.log('❌ Webhook não está respondendo corretamente\n');
      console.log(JSON.stringify(data, null, 2));
    }

  } catch (error) {
    console.error('❌ Webhook não está acessível:');
    console.error(error instanceof Error ? error.message : error);
    console.error(`\n💡 Certifique-se de que a aplicação está rodando em ${WEBHOOK_URL}`);
  }
}

// Executar testes
(async () => {
  await checkHealth();
  console.log('\n' + '='.repeat(60) + '\n');
  await testWebhook();
})();
