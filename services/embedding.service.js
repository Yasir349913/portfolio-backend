import { getOpenAI } from "../config/openai.js";

// 🧠 safe embedding function
export async function createEmbedding(text) {
  try {
    const openai = getOpenAI();

    const res = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    return res.data[0].embedding;
  } catch (err) {
    console.log("⚠️ Embedding failed, using fallback");

    return Array(1536).fill(0.01);
  }
}
