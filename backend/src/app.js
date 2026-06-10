import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";

dotenv.config({ path: ".env" });

import pool from "./config/db.js";

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
app.use("/inventory", inventoryRoutes);

app.get("/", (req, res) => {
  res.send("API is running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  try {
    await pool.query("SELECT NOW()");
    console.log("DB connected");
  } catch (err) {
    console.error("DB connection error:", err);
  }
});