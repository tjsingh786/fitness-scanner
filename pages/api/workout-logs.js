// pages/api/workout-logs.js
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
      const { rows } = await client.query("SELECT id, user_id as userId, date, time, workout_name as workoutName, duration_minutes as durationMinutes, actual_duration_seconds as actualDurationSeconds, total_exercises as totalExercises, completed_exercises as completedExercises, completion_rate as completionRate, is_custom_workout as isCustomWorkout FROM workout_logs ORDER BY date DESC, time DESC;");
      const logs = rows.map(row => ({
        ...row,
        isCustomWorkout: Boolean(row.isCustomWorkout)
      }));
      res.status(200).json(logs);
    } else if (req.method === 'POST') {
      const { user_id, date, time, workout_name, duration_minutes, actual_duration_seconds, total_exercises, completed_exercises, completion_rate, is_custom_workout } = req.body;
      if (!user_id || !date || !time || !workout_name || duration_minutes === undefined || actual_duration_seconds === undefined || total_exercises === undefined || completed_exercises === undefined || completion_rate === undefined || is_custom_workout === undefined) {
        return res.status(400).json({ error: "Missing required fields for workout log" });
      }
      const id = Date.now().toString();
      await client.query(`
        INSERT INTO workout_logs (id, user_id, date, time, workout_name, duration_minutes, actual_duration_seconds, total_exercises, completed_exercises, completion_rate, is_custom_workout)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);
      `, [id, user_id, date, time, workout_name, duration_minutes, actual_duration_seconds, total_exercises, completed_exercises, completion_rate, is_custom_workout]);
      res.status(201).json({ message: "Workout log added successfully", id });
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("API route /api/workout-logs failed:", error);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
}
