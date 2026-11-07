import express from "express";
import mongoose from "mongoose";
import Portfolio from "../models/Portfolio.js";
import Message from "../models/Message.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();
router.use(requireAdmin);

router.get("/portfolio", async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ key: "main" }).lean();
    res.json(portfolio);
  } catch (error) {
    next(error);
  }
});

router.put("/portfolio", async (req, res, next) => {
  try {
    const allowed = ["profile", "skills", "experience", "projects", "achievements", "education", "certifications"];
    const update = {};
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) update[key] = req.body[key];
    }

    if (update.profile && typeof update.profile !== "object") {
      return res.status(400).json({ message: "Profile must be an object." });
    }
    for (const key of ["skills", "experience", "projects", "achievements", "education", "certifications"]) {
      if (update[key] !== undefined && !Array.isArray(update[key])) {
        return res.status(400).json({ message: `${key} must be an array.` });
      }
    }

    const portfolio = await Portfolio.findOneAndUpdate(
      { key: "main" },
      { $set: update },
      { new: true, runValidators: true }
    );
    res.json({ message: "Portfolio saved successfully.", portfolio });
  } catch (error) {
    next(error);
  }
});

router.get("/messages", async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).lean();
    res.json({ messages });
  } catch (error) {
    next(error);
  }
});

router.patch("/messages/:id/read", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid message ID." });
    }
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!message) return res.status(404).json({ message: "Message not found." });
    res.json({ message: "Marked as read.", item: message });
  } catch (error) {
    next(error);
  }
});

router.delete("/messages/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid message ID." });
    }
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found." });
    res.json({ message: "Message deleted." });
  } catch (error) {
    next(error);
  }
});

export default router;
