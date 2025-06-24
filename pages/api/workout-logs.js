// pages/api/workout-logs.js
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
      const { rows } = await turso.execute("SELECT * FROM workout_logs ORDER BY date DESC, time DESC;");
      // Map boolean from number back to boolean if needed, though JS handles truthy/falsy
      const logs = rows.map(row => ({
        ...row,
        isCustom: Boolean(row.is_custom_workout) // Ensure it's a boolean
      }));
      res.status(200).json(logs);
    } catch (error) {
      console.error("Failed to fetch workout logs:", error);
      res.status(500).json({ error: "Failed to fetch workout logs" });
    }
  } else if (req.method === 'POST') {
    const { user_id, date, time, workout_name, duration_minutes, actual_duration_seconds, total_exercises, completed_exercises, completion_rate, is_custom_workout } = req.body;
    if (!user_id || !date || !time || !workout_name || duration_minutes === undefined || actual_duration_seconds === undefined || total_exercises === undefined || completed_exercises === undefined || completion_rate === undefined || is_custom_workout === undefined) {
      return res.status(400).json({ error: "Missing required fields for workout log" });
    }
    const id = Date.now().toString(); // Simple unique ID for the log entry
    try {
      await turso.execute({
        sql: `INSERT INTO workout_logs (id, user_id, date, time, workout_name, duration_minutes, actual_duration_seconds, total_exercises, completed_exercises, completion_rate, is_custom_workout) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        args: [id, user_id, date, time, workout_name, duration_minutes, actual_duration_seconds, total_exercises, completed_exercises, completion_rate, is_custom_workout ? 1 : 0] // Store boolean as 1 or 0
      });
      res.status(201).json({ message: "Workout log added successfully", id });
    } catch (error) {
      console.error("Failed to add workout log:", error);
      res.status(500).json({ error: "Failed to add workout log" });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
