import express from "express";
import cors from "cors";
import contactRoutes from "./routes/contact.routes.js";
import chatRoutes from "./routes/chat.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/contact", contactRoutes);

// ✅ THIS LINE WAS MISSING
app.use("/api", chatRoutes);

export default app;
