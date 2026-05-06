import dotenv from "dotenv";
dotenv.config();

import { createEmbedding } from "./embedding.service.js";
import { vectorSearch } from "./vector.service.js";

export async function generateChatResponse(message) {
  try {
    console.log("📩 Message:", message);
    console.log("🔑 ENV CHECK:", !!process.env.OPENROUTER_API_KEY);

    // 🧠 STEP 1: Embedding
    console.log("🧠 Creating embedding...");
    const queryEmbedding = await createEmbedding(message);
    console.log("✅ Embedding done");

    // 🔎 STEP 2: Vector Search
    console.log("🔎 Running vector search...");
    const matches = await vectorSearch(queryEmbedding);
    console.log("📊 Matches:", matches?.length || 0);

    const context = matches?.map((m) => m.text).join("\n") || "";

    // 🤖 STEP 3: OpenRouter via fetch
    console.log("🚀 Calling OpenRouter API...");

    const completion = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://yasir-maqsood-qbwc.vercel.app",
          "X-Title": "Yasir Portfolio",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          temperature: 0.7,
          max_tokens: 300,
          messages: [
            {
              role: "system",
              content: `You are Yasir Maqsood's AI portfolio assistant.
Rules:
- Be concise and professional
- Sound confident, not like a student
- Use numbers and metrics where possible
- Only answer about Yasir's skills, experience, and projects
- If asked why hire Yasir, highlight SaaS experience + hackathon wins + full-stack ownership

Context:
${context}`,
            },
            {
              role: "user",
              content: message,
            },
          ],
        }),
      },
    );

    const data = await completion.json();
    console.log("✅ AI response received");

    const reply =
      data?.choices?.[0]?.message?.content || "No response generated";

    return {
      reply,
      sources: matches?.map((m) => m.text) || [],
    };
  } catch (err) {
    console.error("❌ FULL CHAT ERROR:", err.message);
    return {
      reply:
        "⚠️ AI temporarily unavailable, but Yasir is a MERN Stack Developer with SaaS & AI experience.",
      sources: [],
    };
  }
}
