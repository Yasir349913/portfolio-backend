import express from "express";
import { generateChatResponse } from "../services/chat.service.js";

const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await generateChatResponse(message);

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chat failed" });
  }
});

export default router;
