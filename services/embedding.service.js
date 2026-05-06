import { openai } from "../config/openai.js";

// 🧠 safe embedding function (production + fallback)
export async function createEmbedding(text) {
  try {
    const res = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    return res.data[0].embedding;

  } catch (err) {
    console.log("⚠️ OpenAI failed, using mock embedding");

    // fallback (so pipeline never breaks)
    return Array(1536).fill(0.01);
  }
}