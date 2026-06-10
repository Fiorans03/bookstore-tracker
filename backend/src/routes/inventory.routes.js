import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// GET: Lista oggetti inventario
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM inventory ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("GET inventory error:", err);
    res.status(500).json({ error: "Errore nel recupero dati" });
  }
});

// POST: Aggiungi nuovo oggetto
router.post("/", async (req, res) => {
  const { name, category, quantity, location, min_threshold, notes } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO inventory (name, category, quantity, location, min_threshold, notes) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, category, quantity, location, min_threshold || 5, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("POST inventory error:", err);
    res.status(500).json({ error: "Errore inserimento" });
  }
});

// DELETE: Rimuovi oggetto
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM inventory WHERE id = $1", [req.params.id]);
    res.json({ message: "Oggetto rimosso" });
  } catch (err) {
    console.error("DELETE inventory error:", err);
    res.status(500).json({ error: "Errore eliminazione" });
  }
});

// PUT: Modifica oggetto esistente
router.put("/:id", async (req, res) => {
  const { name, category, quantity, location, min_threshold, notes } = req.body;
  try {
    const result = await pool.query(
      `UPDATE inventory 
       SET name = $1, category = $2, quantity = $3, location = $4, min_threshold = $5, notes = $6 
       WHERE id = $7 RETURNING *`,
      [name, category, quantity, location, min_threshold || 5, notes, req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Oggetto non trovato" });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error("PUT inventory error:", err);
    res.status(500).json({ error: "Errore durante l'aggiornamento" });
  }
});

export default router;