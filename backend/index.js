import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import dataRoutes from "./routes/dataRoutes.js";

dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// 🔥 MongoDB connect (async/await + try/catch)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected ✅");
  } catch (error) {
    console.log("DB Error:", error.message);
    process.exit(1); // server band kar dega agar DB fail ho gaya
  }
};

// DB connect call
connectDB();

// routes
app.use("/api", dataRoutes);

// server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
