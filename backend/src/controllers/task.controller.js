import {
  createTask,
  getTasksByUser,
  getAllTasks
} from "../models/task.model.js";
import pool from "../config/db.js";

export const addTask = async (req, res) => {
  const { title, description, date } = req.body;

  try {
    // date è una stringa "YYYY-MM-DD" dal frontend
    const task = await createTask(
      title,
      description,
      date,
      req.user.id
    );

    res.json(task);
  } catch (err) {
    console.error("addTask error:", err);
    res.status(500).json({ error: "Errore creazione task" });
  }
};

export const getMyTasks = async (req, res) => {
  try {
    const tasks = await getTasksByUser(req.user.id);
    res.json(tasks);
  } catch (err) {
    console.error("getMyTasks error:", err);
    res.status(500).json({ error: "Errore caricamento task" });
  }
};

export const getAllTasksAdmin = async (req, res) => {
  try {
    const tasks = await getAllTasks();
    res.json(tasks);
  } catch (err) {
    console.error("getAllTasksAdmin error:", err);
    res.status(500).json({ error: "Errore caricamento task" });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
    res.json({ message: "Task eliminata" });
  } catch (err) {
    console.error("deleteTask error:", err);
    res.status(500).json({ error: "Errore eliminazione task" });
  }
};

export const toggleTask = async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  try {
    await pool.query(
      "UPDATE tasks SET completed = $1 WHERE id = $2",
      [completed, id]
    );

    res.json({ message: "Task aggiornata" });
  } catch (err) {
    console.error("toggleTask error:", err);
    res.status(500).json({ error: "Errore aggiornamento task" });
  }
};
