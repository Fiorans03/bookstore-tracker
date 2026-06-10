import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";
import {
  addTask,
  getMyTasks,
  getAllTasksAdmin,
  deleteTask,
  toggleTask
} from "../controllers/task.controller.js";

const router = express.Router();

// USER
router.post("/", authMiddleware, addTask);
router.get("/", authMiddleware, getMyTasks);

// ADMIN
router.get("/admin/all", authMiddleware, adminMiddleware, getAllTasksAdmin);

// DELETE
router.delete("/:id", authMiddleware, deleteTask);

// UPDATE COMPLETED
router.put("/:id", authMiddleware, toggleTask);

export default router;