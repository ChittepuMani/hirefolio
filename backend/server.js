import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import Admin from "./models/Admin.js";
import Portfolio from "./models/Portfolio.js";
import initialPortfolio from "./data/initialPortfolio.js";
import authRoutes from "./routes/authRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((value) => value.trim());

app.use(helmet());
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.json({ message: "Hirefolio API is running", health: "/api/health" });
});
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", database: mongoose.connection.readyState === 1 ? "connected" : "disconnected" });
});

app.use("/api/auth", authRoutes);
app.use("/api", publicRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "API route not found." });
});

app.use((error, req, res, next) => {
  console.error(error);
  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({ message: error.message });
  }
  res.status(500).json({ message: "Something went wrong on the server." });
});

async function seedDatabase() {
  const existingPortfolio = await Portfolio.findOne({ key: "main" });
  if (!existingPortfolio) {
    await Portfolio.create(initialPortfolio);
    console.log("Created initial portfolio document.");
  }

  const email = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = String(process.env.ADMIN_PASSWORD || "");
  if (!email || password.length < 12) {
    throw new Error("Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 12 characters in backend/.env.");
  }

  const existingAdmin = await Admin.findOne({ email });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(password, 12);
    await Admin.create({ email, passwordHash });
    console.log(`Created portfolio admin account for ${email}.`);
  }
}

async function start() {
  try {
    if (!process.env.MONGO_URI || !process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      throw new Error("Set MONGO_URI and a JWT_SECRET of at least 32 characters in backend/.env.");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected.");
    await seedDatabase();

    const port = Number(process.env.PORT) || 5000;
    app.listen(port, () => console.log(`Hirefolio API listening at http://localhost:${port}`));
  } catch (error) {
    console.error("Startup failed:", error.message);
    process.exit(1);
  }
}

start();
