import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);

let db;
let collection;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db("portfolio");
    collection = db.collection("knowledge_vectors");
  }
  return collection;
}

export async function vectorSearch(queryEmbedding) {
  try {
    const col = await connectDB();

    const results = await col
      .aggregate([
        {
          $vectorSearch: {
            index: "vector_index",
            path: "embedding",
            queryVector: queryEmbedding,
            numCandidates: 100,
            limit: 5,
          },
        },
      ])
      .toArray();

    return results;
  } catch (err) {
    console.log("⚠️ Vector search failed:", err.message);
    return [];
  }
}
