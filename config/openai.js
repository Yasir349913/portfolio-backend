import dotenv from "dotenv";
dotenv.config(); // ⭐ MUST ADD THIS

import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});
