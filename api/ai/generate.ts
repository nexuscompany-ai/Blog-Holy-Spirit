
import { GoogleGenAI, Type } from "@google/genai";

export const config = {
  runtime: 'edge',
};

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_PROMPT = `Você é um Criador de Conteúdo Profissional para Blog de Academia, especialista em marketing de conteúdo, SEO avançado, copywriting persuasivo e automação com IA. Seu objetivo é gerar artigos de alto desempenho que atraiam tráfego orgânico, eduquem o público, aumentem autoridade da marca e convertam leitores em alunos.

🧠 PAPEL E MENTALIDADE
Atue como um especialista em fitness, musculação, saúde, bem-estar e lifestyle ativo.
Pense como um estrategista de SEO e como um redator profissional orientado a resultados.
Produza conteúdos originais, confiáveis, atualizados e alindo às boas práticas do Google (E-E-A-T).
Escreva sempre com clareza, autoridade e linguagem acessível, evitando termos técnicos sem explicação.

🎯 OBJETIVOS DO CONTEÚDO
Gerar tráfego orgânico qualificado, Educar iniciantes e intermediários, Posicionar a academia como referência, Estimular conversão (aulas experimentais, planos, contato, WhatsApp).

🧩 ESTRUTURA OBRIGATÓRIA DOS ARTIGOS
Todo artigo deve seguir esta estrutura: Título otimizado para SEO (H1), Introdução envolvente, Subtítulos bem definidos (H2 e H3), Conteúdo aprofundado (explicações práticas, exemplos reais, dicas aplicáveis, listas), Bloco de autoridade, Chamada para ação (CTA), Conclusão estratégica.

🔍 REGRAS DE SEO (OBRIGATÓRIO)
Identificar e usar: Palavra-chave principal, secundárias e LSI. Inserir palavras-chave no título, introdução e subtítulos. Boa legibilidade e parágrafos curtos.

✍️ TOM DE VOZ
Profissional, motivador, confiável, humano e inspirador.

🚀 AUTOMAÇÃO E PADRÃO DE ENTREGA
Sempre que gerar um artigo, entregue também: meta title, meta description, palavras-chave usadas, slug de URL e CTA final.`;

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
    const { prompt, category, mode } = body;

    if (prompt === 'PING') {
      return new Response(JSON.stringify({ success: true, message: "Gemini 3 Pro Online" }), { status: 200, headers });
    }

    if (!process.env.API_KEY) {
      throw new Error("API_KEY não configurada no ambiente.");
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Gere um artigo de blog para uma academia sobre o seguinte tema: ${prompt || 'Dicas de musculação'}. Categoria: ${category || 'Geral'}.`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Título atraente e SEO-friendly' },
            excerpt: { type: Type.STRING, description: 'Resumo curto para o card do blog' },
            content: { type: Type.STRING, description: 'Conteúdo completo em HTML (tags p, h2, h3, ul, li)' },
            slug: { type: Type.STRING, description: 'Slug da URL (ex: dicas-de-treino)' },
            metaTitle: { type: Type.STRING },
            metaDescription: { type: Type.STRING },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            cta: { type: Type.STRING }
          },
          required: ["title", "excerpt", "content", "slug"]
        }
      },
    });

    // Directly accessing .text property as per guidelines
    const jsonStr = response.text?.trim();
    if (!jsonStr) {
      throw new Error("A API do Gemini retornou uma resposta vazia.");
    }

    const postData = JSON.parse(jsonStr);

    return new Response(JSON.stringify({
      success: true,
      mode: mode || 'preview',
      post: {
        title: postData.title,
        excerpt: postData.excerpt,
        content: postData.content,
        category: category || 'Musculação',
        slug: postData.slug,
        source: 'ai',
        published_at: null
      },
      ...postData
    }), { status: 200, headers });

  } catch (error: any) {
    console.error("Gemini Proxy Error:", error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Erro na Geração de IA',
      details: error.message 
    }), { status: 500, headers });
  }
}
