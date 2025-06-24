// pages/api/custom-workouts.js
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
      const { rows } = await client.query("SELECT date, workout_name as workoutName, exercises, focus, duration, created_by as createdBy FROM custom_workouts;");
      const customWorkoutsMap = {};
      rows.forEach(row => {
        customWorkoutsMap[row.date] = {
          name: row.workoutName,
          exercises: JSON.parse(row.exercises),
          focus: row.focus,
          duration: row.duration,
          createdBy: row.createdBy,
        };
      });
      res.status(200).json(customWorkoutsMap);
    } else if (req.method === 'POST') {
      const { date, workoutName, exercises, focus, duration, createdBy } = req.body;
      if (!date || !workoutName || !exercises || !focus || !duration || !createdBy) {
        return res.status(400).json({ error: "Missing required fields for custom workout" });
      }
      // Use INSERT INTO ... ON CONFLICT (date) DO UPDATE for upsert in PostgreSQL
      await client.query(`
        INSERT INTO custom_workouts (date, workout_name, exercises, focus, duration, created_by)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (date) DO UPDATE SET
          workout_name = EXCLUDED.workout_name,
          exercises = EXCLUDED.exercises,
          focus = EXCLUDED.focus,
          duration = EXCLUDED.duration,
          created_by = EXCLUDED.created_by;
      `, [date, workoutName, JSON.stringify(exercises), focus, duration, createdBy]);
      
      res.status(201).json({ message: "Custom workout saved successfully" });
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("API route /api/custom-workouts failed:", error);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
}
