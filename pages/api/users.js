// pages/api/users.js
import { turso, initDb } from '../../lib/turso';

// Use a promise to ensure initDb runs only once per cold start of the module
let initPromise;
async function ensureDbInitialized() {
  if (!initPromise) {
    initPromise = initDb();
  }
  return initPromise;
}

export default async function handler(req, res) {
  // Ensure DB is ready before handling any request
  try {
    await ensureDbInitialized();
  } catch (dbError) {
    console.error("Database initialization failed for API route /api/users:", dbError);
    return res.status(500).json({ error: "Database not ready." });
  }

  if (req.method === 'GET') {
    try {
      const { rows } = await turso.execute("SELECT id, name, avatar, color FROM users ORDER BY name;");
      res.status(200).json(rows);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  } else if (req.method === 'POST') {
    const { name, avatar, color } = req.body;
    if (!name || !avatar || !color) {
      return res.status(400).json({ error: "Missing required fields for user" });
    }
    const newUserId = name.toLowerCase().replace(/\s/g, '-'); // Derive ID

    try {
      const existingUser = await turso.execute({
        sql: `SELECT id FROM users WHERE id = ?;`,
        args: [newUserId]
      });

      if (existingUser.rows.length > 0) {
        return res.status(409).json({ error: "User with this name already exists (ID conflict). Please choose a different name." });
      }

      await turso.execute({
        sql: `INSERT INTO users (id, name, avatar, color) VALUES (?, ?, ?, ?);`,
        args: [newUserId, name, avatar, color]
      });
      res.status(201).json({ message: "User added successfully", id: newUserId });
    } catch (error) {
      console.error("Failed to add user:", error);
      res.status(500).json({ error: "Failed to add user due to a server error." });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }
    if (['akshay', 'ravish'].includes(id)) {
      return res.status(403).json({ error: "Cannot delete default system users." });
    }
    try {
      const { rowsAffected } = await turso.execute({
        sql: `DELETE FROM users WHERE id = ?;`,
        args: [id]
      });
      if (rowsAffected === 0) {
        return res.status(404).json({ error: "User not found." });
      }
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Failed to delete user:", error);
      res.status(500).json({ error: "Failed to delete user due to a server error." });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
