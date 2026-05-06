import { getOpenAI } from "../config/openai.js";
import { createEmbedding } from "./embedding.service.js";
import { vectorSearch } from "./vector.service.js";

export async function generateChatResponse(message) {
  try {
    console.log("📩 Message:", message);
    console.log("🔑 ENV CHECK:", !!process.env.OPENROUTER_API_KEY);

    // 🧠 STEP 1: embedding
    console.log("🧠 Creating embedding...");
    const queryEmbedding = await createEmbedding(message);
    console.log("✅ Embedding done");

    // 🔎 STEP 2: vector search
    console.log("🔎 Running vector search...");
    const matches = await vectorSearch(queryEmbedding);
    console.log("📊 Matches:", matches?.length || 0);

    const context = matches?.map((m) => m.text).join("\n") || "";

    // 🤖 STEP 3: OpenRouter
    console.log("🤖 Getting OpenAI client...");
    const openai = getOpenAI();

    console.log("🚀 Calling OpenRouter API...");

    const completion = await openai.chat.completions.create({
      // 🔥 FIXED MODEL (IMPORTANT)

      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are Yasir Maqsood's AI assistant.

Rules:
- Be concise
- Be professional
- Act like recruiter assistant
- Focus on MERN, SaaS, AI, projects

Context:
${context}
          `,
        },
        {
          role: "user",
          content: message,
        },
      ],

      temperature: 0.7,
      max_tokens: 300,
    });

    console.log("✅ AI response received");

    return {
      reply:
        completion?.choices?.[0]?.message?.content || "No response generated",
      sources: matches?.map((m) => m.text) || [],
    };
  } catch (err) {
    console.error("❌ FULL CHAT ERROR:");
    console.error(err?.response?.data || err.message);

    return {
      reply:
        "⚠️ AI temporarily unavailable, but Yasir is a MERN Stack Developer with SaaS & AI experience.",
      sources: [],
    };
  }
}
