import OpenAI from "openai";
import https from "https";

let client;

export function getOpenAI() {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is missing in env");
  }

  if (!client) {
    client = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
      httpAgent: new https.Agent({
        rejectUnauthorized: false, // SSL fix
      }),
    });
  }

  return client;
}
