// pages/api/users.js
import { turso, initDb } from '../../lib/turso';

// Initialize DB on server start (or first request)
let dbInitialized = false;
async function ensureDbInitialized() {
  if (!dbInitialized) {
    await initDb();
    dbInitialized = true;
  }
}

export default async function handler(req, res) {
  await ensureDbInitialized(); // Ensure DB is ready

  if (req.method === 'GET') {
    try {
      const { rows } = await turso.execute("SELECT id, name, avatar, color FROM users ORDER BY name;");
      res.status(200).json(rows);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  } else if (req.method === 'POST') {
    const { id, name, avatar, color } = req.body;
    if (!id || !name || !avatar || !color) {
      return res.status(400).json({ error: "Missing required fields for user" });
    }
    try {
      await turso.execute({
        sql: `INSERT INTO users (id, name, avatar, color) VALUES (?, ?, ?, ?);`,
        args: [id, name, avatar, color]
      });
      res.status(201).json({ message: "User added successfully" });
    } catch (error) {
      console.error("Failed to add user:", error);
      res.status(500).json({ error: "Failed to add user" });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query; // Use req.query for DELETE with ID in URL
    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }
    // Prevent deleting system users (Akshay and Ravish)
    if (['akshay', 'ravish'].includes(id)) {
      return res.status(403).json({ error: "Cannot delete system users" });
    }
    try {
      await turso.execute({
        sql: `DELETE FROM users WHERE id = ?;`,
        args: [id]
      });
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Failed to delete user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
