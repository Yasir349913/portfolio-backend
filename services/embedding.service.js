import dotenv from "dotenv";
dotenv.config();

export async function createEmbedding(text) {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://yasir-maqsood-qbwc.vercel.app",
        "X-Title": "Yasir Portfolio",
      },
      body: JSON.stringify({
        model: "openai/text-embedding-3-small",
        input: text,
      }),
    });

    const data = await res.json();

    if (!data?.data?.[0]?.embedding) {
      throw new Error("No embedding returned");
    }

    return data.data[0].embedding;
  } catch (err) {
    console.log("⚠️ Embedding failed, using fallback:", err.message);
    return Array(1536).fill(0.01);
  }
}
