// pages/api/workout-packages.js
import { turso, initDb } from '../../lib/turso';

let dbInitialized = false;
async function ensureDbInitialized() {
  if (!dbInitialized) {
    await initDb();
    dbInitialized = true;
  }
}

export default async function handler(req, res) {
  await ensureDbInitialized();

  if (req.method === 'GET') {
    try {
      const { rows } = await turso.execute("SELECT * FROM workout_packages;");
      // Parse exercises back from JSON string
      const packages = rows.map(row => ({
        ...row,
        exercises: JSON.parse(row.exercises)
      }));
      res.status(200).json(packages);
    } catch (error) {
      console.error("Failed to fetch workout packages:", error);
      res.status(500).json({ error: "Failed to fetch workout packages" });
    }
  } else if (req.method === 'POST') {
    const { name, exercises, focus, duration, createdBy, createdAt } = req.body;
    if (!name || !exercises || !focus || !duration || !createdBy || !createdAt) {
      return res.status(400).json({ error: "Missing required fields for workout package" });
    }
    const id = Date.now().toString(); // Simple unique ID
    try {
      await turso.execute({
        sql: `INSERT INTO workout_packages (id, name, exercises, focus, duration, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?);`,
        args: [id, name, JSON.stringify(exercises), focus, duration, createdBy, createdAt]
      });
      res.status(201).json({ message: "Workout package added successfully", id });
    } catch (error) {
      console.error("Failed to add workout package:", error);
      res.status(500).json({ error: "Failed to add workout package" });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: "Package ID is required" });
    }
    try {
      await turso.execute({
        sql: `DELETE FROM workout_packages WHERE id = ?;`,
        args: [id]
      });
      res.status(200).json({ message: "Workout package deleted successfully" });
    } catch (error) {
      console.error("Failed to delete workout package:", error);
      res.status(500).json({ error: "Failed to delete workout package" });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
