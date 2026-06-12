import express from "express";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

const router = express.Router();

// Middleware per verificare il token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: "Token mancante" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "chiave-segreta-test-12345");
    req.userId = decoded.userId; // <-- Qui salviamo l'ID
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token non valido" });
  }
};

// Applica il middleware a TUTTE le route di questo file
router.use(authenticateToken);

// GET: Lista oggetti
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM inventory WHERE user_id = $1 ORDER BY created_at DESC",
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GET inventory error:", err);
    res.status(500).json({ error: "Errore nel recupero dati" });
  }
});

// POST: Aggiungi nuovo oggetto
router.post("/", async (req, res) => {
  // 👇 QUESTA RIGA È IL NOSTRO DETECTIVE 👇
  console.log("🕵️ DEBUG BACKEND: req.userId vale =", req.userId); 
  
  const { name, category, quantity, location, min_threshold, notes } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO inventory (user_id, name, category, quantity, location, min_threshold, notes) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [req.userId, name, category, quantity, location, min_threshold || 5, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("POST inventory error:", err);
    res.status(500).json({ error: "Errore inserimento" });
  }
});

// PUT: Modifica
router.put("/:id", async (req, res) => {
  const { name, category, quantity, location, min_threshold, notes } = req.body;
  try {
    const result = await pool.query(
      `UPDATE inventory SET name = $1, category = $2, quantity = $3, location = $4, min_threshold = $5, notes = $6 
       WHERE id = $7 AND user_id = $8 RETURNING *`,
      [name, category, quantity, location, min_threshold || 5, notes, req.params.id, req.userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Non trovato" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("PUT inventory error:", err);
    res.status(500).json({ error: "Errore aggiornamento" });
  }
});

// DELETE: Elimina
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM inventory WHERE id = $1 AND user_id = $2", [req.params.id, req.userId]);
    if (result.rowCount === 0) return res.status(404).json({ error: "Non trovato" });
    res.json({ message: "Oggetto rimosso" });
  } catch (err) {
    console.error("DELETE inventory error:", err);
    res.status(500).json({ error: "Errore eliminazione" });
  }
});

export default router;