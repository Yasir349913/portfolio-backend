import express from "express";
import { sendMessage } from "../controllers/contact.controller.js";

const router = express.Router();

router.post("/send", sendMessage);

export default router;
