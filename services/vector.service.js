import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);

let db;
let collection;

// lazy connect (best practice)
async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db("portfolio");
    collection = db.collection("knowledge_vectors");
  }
  return collection;
}

// vector search
export async function vectorSearch(queryEmbedding) {
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
}
