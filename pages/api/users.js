// pages/api/users.js
import { getDbClient, initDbSchema } from '../../lib/db'; // Changed import from turso to db

let initPromise;
async function ensureDbInitialized() {
  if (!initPromise) {
    initPromise = initDbSchema(); // Call initDbSchema now
  }
  return initPromise;
}

export default async function handler(req, res) {
  let client;
  try {
    await ensureDbInitialized(); // Ensure DB schema is ready
    client = await getDbClient(); // Get the connected client

    if (req.method === 'GET') {
      const { rows } = await client.query("SELECT id, name, avatar, color FROM users ORDER BY name;");
      res.status(200).json(rows);
    } else if (req.method === 'POST') {
      const { id, name, avatar, color } = req.body;
      if (!id || !name || !avatar || !color) {
        return res.status(400).json({ error: "Missing required fields for user" });
      }

      // Check for existing user (PostgreSQL specific)
      const existingUserResult = await client.query('SELECT id FROM users WHERE id = $1;', [id]);
      if (existingUserResult.rows.length > 0) {
        return res.status(409).json({ error: "User with this name already exists (ID conflict). Please choose a different name." });
      }

      await client.query('INSERT INTO users (id, name, avatar, color) VALUES ($1, $2, $3, $4);', [id, name, avatar, color]);
      res.status(201).json({ message: "User added successfully", id });
    } else if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: "User ID is required" });
      }
      if (['akshay', 'ravish'].includes(id)) {
        return res.status(403).json({ error: "Cannot delete default system users." });
      }

      const result = await client.query('DELETE FROM users WHERE id = $1;', [id]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "User not found." });
      }
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("API route /api/users failed:", error);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
}
