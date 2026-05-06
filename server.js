import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import app from "./app.js";

console.log("🚀 Server starting...");
console.log("🔑 OPENROUTER:", process.env.OPENROUTER_API_KEY);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
