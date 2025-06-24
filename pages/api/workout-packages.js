// pages/api/workout-packages.js
import { getDbClient, initDbSchema } from '../../lib/db'; // Changed import

let initPromise;
async function ensureDbInitialized() {
  if (!initPromise) {
    initPromise = initDbSchema();
  }
  return initPromise;
}

export default async function handler(req, res) {
  let client;
  try {
    await ensureDbInitialized();
    client = await getDbClient();

    if (req.method === 'GET') {
      const { rows } = await client.query("SELECT id, name, exercises, focus, duration, created_by as createdBy, created_at as createdAt FROM workout_packages;");
      const packages = rows.map(row => ({
        ...row,
        exercises: JSON.parse(row.exercises)
      }));
      res.status(200).json(packages);
    } else if (req.method === 'POST') {
      const { name, exercises, focus, duration, createdBy, createdAt } = req.body;
      if (!name || !exercises || !focus || !duration || !createdBy || !createdAt) {
        return res.status(400).json({ error: "Missing required fields for workout package" });
      }
      const id = Date.now().toString(); // Simple unique ID
      await client.query('INSERT INTO workout_packages (id, name, exercises, focus, duration, created_by, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7);', [id, name, JSON.stringify(exercises), focus, duration, createdBy, createdAt]);
      res.status(201).json({ message: "Workout package added successfully", id });
    } else if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: "Package ID is required" });
      }
      const result = await client.query('DELETE FROM workout_packages WHERE id = $1;', [id]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Workout package not found." });
      }
      res.status(200).json({ message: "Workout package deleted successfully" });
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("API route /api/workout-packages failed:", error);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
}
