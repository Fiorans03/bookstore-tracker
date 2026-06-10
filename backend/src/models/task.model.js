import pool from "../config/db.js";

export const createTask = async (title, description, date, userId) => {
  const result = await pool.query(
    `INSERT INTO tasks (title, description, date, user_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id, title, description, completed, date`,
    [title, description, date, userId]
  );

  return result.rows[0];
};

export const getTasksByUser = async (userId) => {
  const result = await pool.query(
    `SELECT id, title, description, completed,
            TO_CHAR(date, 'YYYY-MM-DD') AS date
     FROM tasks
     WHERE user_id = $1
     ORDER BY date ASC`,
    [userId]
  );

  return result.rows;
};


export const getAllTasks = async () => {
  const result = await pool.query(
    `SELECT id, title, description, completed, date, user_id
     FROM tasks
     ORDER BY date ASC, id ASC`
  );

  return result.rows;
};
