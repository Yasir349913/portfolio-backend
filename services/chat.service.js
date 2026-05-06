import { openai } from "../config/openai.js";
import { createEmbedding } from "./embedding.service.js";
import { vectorSearch } from "./vector.service.js";

export async function generateChatResponse(message) {
  try {
    // 1. Create embedding
    const queryEmbedding = await createEmbedding(message);

    // 2. Vector search
    const matches = await vectorSearch(queryEmbedding);

    const context = matches.map((m) => m.text).join("\n");

    // 3. AI Response (OpenRouter)
    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3-8b-instruct", // ✅ FIXED

      messages: [
        {
          role: "system",
          content: `
You are Yasir Maqsood's AI assistant.

Your job:
- Act like a professional recruiter assistant
- Answer ONLY from provided context
- Highlight:
  • MERN stack experience
  • SaaS project (Restaurant system)
  • Hackathon winner
  • Deployment experience

Style:
- Short
- Confident
- Professional
- Impact-focused (numbers if possible)

If answer not in context:
Say: "I don’t have that information yet."

--------------------
CONTEXT:
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

    return {
      reply:
        completion?.choices?.[0]?.message?.content ||
        "⚠️ No response generated",
      sources: matches.map((m) => m.text),
    };
  } catch (err) {
    console.error("❌ Chat Service Error:", err.message);

    // 🧠 fallback (important for demo stability)
    return {
      reply:
        "⚠️ AI is temporarily unavailable, but Yasir is a MERN Stack Developer with SaaS and hackathon experience.",
      sources: [],
    };
  }
}
