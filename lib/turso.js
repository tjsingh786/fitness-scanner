// lib/turso.js
import { createClient } from "@libsql/client";

// Ensure environment variables are loaded if not in a Next.js environment already
// This is typically handled by Next.js's built-in env handling,
// but for clarity, it's good to be aware.
// process.env.TURSO_DATABASE_URL and process.env.TURSO_AUTH_TOKEN

if (!process.env.TURSO_DATABASE_URL) {
  throw new Error("TURSO_DATABASE_URL is not set");
}
if (!process.env.TURSO_AUTH_TOKEN) {
  throw new Error("TURSO_AUTH_TOKEN is not set");
}

export const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// A simple function to ensure our tables exist on app start
export async function initDb() {
  try {
    // Users table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        avatar TEXT NOT NULL,
        color TEXT NOT NULL
      );
    `);

    // Default users (Akshay and Ravish) if they don't exist
    // This is a basic way to seed data. For robust seeding, consider separate scripts.
    const systemUsersExist = await turso.execute("SELECT COUNT(*) FROM users WHERE id IN ('akshay', 'ravish');");
    if (systemUsersExist.rows[0]['COUNT(*)'] === 0) {
      await turso.execute({
        sql: `INSERT INTO users (id, name, avatar, color) VALUES (?, ?, ?, ?), (?, ?, ?, ?);`,
        args: [
          'akshay', 'Akshay', '💪', 'from-blue-500 to-cyan-500',
          'ravish', 'Ravish', '🔥', 'from-orange-500 to-red-500'
        ]
      });
      console.log("Seeded default users.");
    }

    // Workout Packages table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS workout_packages (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        exercises TEXT NOT NULL, -- Stored as JSON string
        focus TEXT NOT NULL,
        duration TEXT NOT NULL,
        created_by TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
    `);

    // Custom Workouts table (for assigned workouts on specific dates)
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS custom_workouts (
        date TEXT PRIMARY KEY, -- YYYY-MM-DD format
        workout_name TEXT NOT NULL,
        exercises TEXT NOT NULL, -- Stored as JSON string
        focus TEXT NOT NULL,
        duration TEXT NOT NULL,
        created_by TEXT NOT NULL
      );
    `);

    // Workout Logs table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS workout_logs (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        workout_name TEXT NOT NULL,
        duration_minutes INTEGER NOT NULL,
        actual_duration_seconds INTEGER NOT NULL,
        total_exercises INTEGER NOT NULL,
        completed_exercises INTEGER NOT NULL,
        completion_rate INTEGER NOT NULL,
        is_custom_workout BOOLEAN NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);

    console.log("Database schema initialized successfully.");
  } catch (e) {
    console.error("Failed to initialize database schema:", e);
    // Exit or handle fatal error if DB is critical
  }
}
