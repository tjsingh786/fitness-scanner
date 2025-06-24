// lib/turso.js
import { createClient } from "@libsql/client";

// Ensure environment variables are loaded
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

let dbInitialized = false; // Add a local flag to prevent multiple initializations

export async function initDb() {
  if (dbInitialized) {
    console.log("Database already initialized, skipping.");
    return;
  }

  console.log("Attempting to initialize database schema...");
  try {
    // Test basic connection first
    await turso.execute("SELECT 1;");
    console.log("Successfully connected to Turso database.");

    // Users table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        avatar TEXT NOT NULL,
        color TEXT NOT NULL
      );
    `);
    console.log("Ensured 'users' table exists.");

    // Default users (Akshay and Ravish) if they don't exist
    const systemUsersCountResult = await turso.execute("SELECT COUNT(*) as count FROM users WHERE id IN ('akshay', 'ravish');");
    const systemUsersExist = systemUsersCountResult.rows[0].count; // Access the count property

    if (systemUsersExist < 2) { // Check if both don't exist
      console.log("Seeding default users: Akshay and Ravish...");
      try {
        await turso.execute({
          sql: `INSERT OR IGNORE INTO users (id, name, avatar, color) VALUES (?, ?, ?, ?), (?, ?, ?, ?);`,
          args: [
            'akshay', 'Akshay', '💪', 'from-blue-500 to-cyan-500',
            'ravish', 'Ravish', '🔥', 'from-orange-500 to-red-500'
          ]
        });
        console.log("Default users seeded (or already existed).");
      } catch (insertError) {
        console.error("Error seeding default users (might be ignorable if due to existing data):", insertError);
      }
    } else {
      console.log("Default users (Akshay, Ravish) already present.");
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
    console.log("Ensured 'workout_packages' table exists.");


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
    console.log("Ensured 'custom_workouts' table exists.");

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
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log("Ensured 'workout_logs' table exists.");

    console.log("All database schema initialization steps completed successfully.");
    dbInitialized = true; // Set flag to true on success
  } catch (e) {
    console.error("Failed to initialize database schema:", e);
    // Re-throw the error so Vercel logs it clearly and stops the function
    throw e;
  }
}
