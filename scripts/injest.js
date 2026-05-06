import fs from "fs";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import OpenAI from "openai";

dotenv.config();

// ✅ FIX: env name safe check
const MONGO_URI = process.env.MONGODB_URI;
const OPENAI_KEY = process.env.OPENAI_API_KEY;

// fallback check
if (!MONGO_URI) {
  throw new Error("❌ MONGODB_URI missing in .env");
}

const client = new MongoClient(MONGO_URI);

// ✅ OpenAI optional (so mock mode works)
const openai = OPENAI_KEY ? new OpenAI({ apiKey: OPENAI_KEY }) : null;

const DB_NAME = "portfolio";
const COLLECTION = "knowledge_vectors";

// ------------------ CHUNKING ------------------
function chunkText(data) {
  const chunks = [];

  function traverse(obj, path = "") {
    for (let key in obj) {
      const value = obj[key];

      if (typeof value === "string") {
        chunks.push({
          text: `${path} ${key}: ${value}`.trim(),
        });
      } else if (Array.isArray(value)) {
        value.forEach((item, i) => {
          if (typeof item === "string") {
            chunks.push({
              text: `${path} ${key}[${i}]: ${item}`,
            });
          } else {
            traverse(item, `${path} ${key}[${i}]`);
          }
        });
      } else if (typeof value === "object" && value !== null) {
        traverse(value, `${path} ${key}`);
      }
    }
  }

  traverse(data);
  return chunks;
}

// ------------------ EMBEDDING ------------------
async function embed(text) {
  // 🟡 MOCK MODE (if no OpenAI key or quota issue)
  if (!openai) {
    return Array(1536).fill(0.01);
  }

  try {
    const res = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    return res.data[0].embedding;
  } catch (err) {
    console.log("⚠️ OpenAI failed, switching to mock embedding");
    return Array(1536).fill(0.01);
  }
}

// ------------------ MAIN ------------------
async function run() {
  try {
    await client.connect();

    const db = client.db(DB_NAME);
    const col = db.collection(COLLECTION);

    const rawData = JSON.parse(
      fs.readFileSync("./data/YasirData.json", "utf-8"),
    );

    const chunks = chunkText(rawData);

    console.log(`Chunks created: ${chunks.length}`);

    for (let chunk of chunks) {
      const vector = await embed(chunk.text);

      await col.insertOne({
        text: chunk.text,
        embedding: vector,
        createdAt: new Date(),
      });

      console.log("Inserted chunk");
    }

    console.log("🚀 Ingestion completed successfully");
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await client.close();
    process.exit();
  }
}

run();
