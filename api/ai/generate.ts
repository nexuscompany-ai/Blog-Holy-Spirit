diff --git a/api/ai/generate.ts b/api/ai/generate.ts
index 9eb946543768f03f435cce2fc223969ea266c783..3603f44ca9386db089b82b1d65e34e11838b094a 100644
--- a/api/ai/generate.ts
+++ b/api/ai/generate.ts
@@ -20,75 +20,89 @@ export default async function handler(req: Request) {
 
   if (req.method !== 'POST') {
     return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
   }
 
   try {
     const body = await req.json().catch(() => ({}));
     const { prompt, config: userConfig } = body;
     const apiKey = process.env.API_KEY;
 
     if (!apiKey) {
       console.error("API_KEY MISSING");
       return new Response(JSON.stringify({ 
         error: 'Variável API_KEY não configurada na Vercel.' 
       }), { status: 500, headers });
     }
 
     if (!prompt) {
       return new Response(JSON.stringify({ error: 'Prompt vazio' }), { status: 400, headers });
     }
 
     const isOpenAI = apiKey.startsWith('sk-');
     const isBlogRequest = prompt.includes("Gere um artigo");
 
     if (isOpenAI) {
-      const response = await fetch('https://api.openai.com/v1/chat/completions', {
+      const defaultOpenAIModel = 'gpt-4o-mini';
+      const requestedModel = userConfig?.model?.trim();
+      const looksLikeGeminiModel = requestedModel?.startsWith('gemini') || requestedModel?.startsWith('models/');
+      let openaiModel = !requestedModel || looksLikeGeminiModel ? defaultOpenAIModel : requestedModel;
+      const supportsJsonResponse = !openaiModel.startsWith('gpt-3.5-turbo') || openaiModel.includes('1106');
+      if (isBlogRequest && !supportsJsonResponse) {
+        openaiModel = defaultOpenAIModel;
+      }
+      const baseUrl = userConfig?.baseUrl?.trim() || 'https://api.openai.com/v1/chat/completions';
+
+      const response = await fetch(baseUrl, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${apiKey}`
         },
         body: JSON.stringify({
-          model: userConfig?.model || 'gpt-3.5-turbo',
+          model: openaiModel,
           messages: [
             { role: 'system', content: 'Você é um estrategista de SEO Fitness para a Holy Spirit.' },
             { role: 'user', content: prompt }
           ],
           temperature: userConfig?.temperature || 0.7,
           ...(isBlogRequest ? { response_format: { type: "json_object" } } : {})
         })
       });
 
       const data = await response.json();
       if (!response.ok) throw new Error(data.error?.message || 'Erro na OpenAI');
-      
-      const content = data.choices[0].message.content;
+      const content = data.choices?.[0]?.message?.content;
+      if (!content) {
+        throw new Error('Resposta vazia da OpenAI.');
+      }
       return new Response(JSON.stringify(content), { status: 200, headers });
     } else {
       const ai = new GoogleGenAI({ apiKey });
-      const modelName = userConfig?.model || 'gemini-3-flash-preview';
+      const requestedModel = userConfig?.model?.trim();
+      const isGeminiModel = requestedModel?.startsWith('gemini') || requestedModel?.startsWith('models/');
+      const modelName = !requestedModel || !isGeminiModel ? 'gemini-3-flash-preview' : requestedModel;
       
       const generationConfig: any = {
         temperature: userConfig?.temperature || 0.7,
       };
 
       if (isBlogRequest) {
         generationConfig.responseMimeType = "application/json";
         generationConfig.responseSchema = {
           type: Type.OBJECT,
           properties: {
             title: { type: Type.STRING },
             excerpt: { type: Type.STRING },
             content: { type: Type.STRING },
             category: { type: Type.STRING },
             seo_keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
             meta_description: { type: Type.STRING },
             slug_suggestion: { type: Type.STRING }
           },
           required: ["title", "excerpt", "content", "category", "seo_keywords", "meta_description", "slug_suggestion"]
         };
       }
 
       const response = await ai.models.generateContent({
         model: modelName,
         contents: [{ role: 'user', parts: [{ text: prompt }] }],
