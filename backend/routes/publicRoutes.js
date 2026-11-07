import express from "express";
import rateLimit from "express-rate-limit";
import Portfolio from "../models/Portfolio.js";
import Message from "../models/Message.js";

const router = express.Router();
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many messages were sent. Please try again later." }
});

router.get("/portfolio", async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ key: "main" }).lean();
    if (!portfolio) return res.status(404).json({ message: "Portfolio has not been configured yet." });
    res.json(portfolio);
  } catch (error) {
    next(error);
  }
});

router.post("/contact", contactLimiter, async (req, res, next) => {
  try {
    // Honeypot field: real visitors leave this hidden field empty.
    if (req.body.website) return res.status(201).json({ message: "Message received." });

    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const subject = String(req.body.subject || "Recruitment enquiry").trim();
    const message = String(req.body.message || "").trim();

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email and message are required." });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }
    if (message.length < 10) {
      return res.status(400).json({ message: "Please add a little more detail to your message." });
    }

    await Message.create({ name, email, subject, message });
    res.status(201).json({ message: "Thank you. Your enquiry has been sent." });
  } catch (error) {
    next(error);
  }
});

export default router;
