// pages/api/custom-workouts.js
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
      const { rows } = await turso.execute("SELECT * FROM custom_workouts;");
      const customWorkoutsMap = {};
      rows.forEach(row => {
        customWorkoutsMap[row.date] = {
          name: row.workout_name,
          exercises: JSON.parse(row.exercises),
          focus: row.focus,
          duration: row.duration,
          createdBy: row.created_by,
        };
      });
      res.status(200).json(customWorkoutsMap);
    } catch (error) {
      console.error("Failed to fetch custom workouts:", error);
      res.status(500).json({ error: "Failed to fetch custom workouts" });
    }
  } else if (req.method === 'POST') {
    const { date, workoutName, exercises, focus, duration, createdBy } = req.body;
    if (!date || !workoutName || !exercises || !focus || !duration || !createdBy) {
      return res.status(400).json({ error: "Missing required fields for custom workout" });
    }
    try {
      // Use INSERT OR REPLACE to update if date already exists
      await turso.execute({
        sql: `INSERT OR REPLACE INTO custom_workouts (date, workout_name, exercises, focus, duration, created_by) VALUES (?, ?, ?, ?, ?, ?);`,
        args: [date, workoutName, JSON.stringify(exercises), focus, duration, createdBy]
      });
      res.status(201).json({ message: "Custom workout saved successfully" });
    } catch (error) {
      console.error("Failed to save custom workout:", error);
      res.status(500).json({ error: "Failed to save custom workout" });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
