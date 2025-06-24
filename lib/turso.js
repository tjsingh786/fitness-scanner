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
    // *** STEP 1: Test basic connection FIRST ***
    // If this fails, it's still a URL/Token issue, but it will confirm
    await turso.execute("SELECT 1;");
    console.log("Successfully connected to Turso database with SELECT 1 test.");

    // *** STEP 2: Execute schema creation commands in a batch ***
    // This is often more reliable for schema setup as it sends multiple statements
    // and might bypass some internal migration job checks.
    await turso.batch([
      // Users table
      `
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        avatar TEXT NOT NULL,
        color TEXT NOT NULL
      );
      `,
      // Workout Packages table
      `
      CREATE TABLE IF NOT EXISTS workout_packages (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        exercises TEXT NOT NULL, -- Stored as JSON string
        focus TEXT NOT NULL,
        duration TEXT NOT NULL,
        created_by TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
      `,
      // Custom Workouts table (for assigned workouts on specific dates)
      `
      CREATE TABLE IF NOT EXISTS custom_workouts (
        date TEXT PRIMARY KEY, --YYYY-MM-DD format
        workout_name TEXT NOT NULL,
        exercises TEXT NOT NULL, -- Stored as JSON string
        focus TEXT NOT NULL,
        duration TEXT NOT NULL,
        created_by TEXT NOT NULL
      );
      `,
      // Workout Logs table
      `
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
      `
    ]);
    console.log("All tables ensured to exist via batch execution.");

    // *** STEP 3: Seed Default Users (Akshay and Ravish) ***
    // Keep this separate as it's an INSERT, not CREATE TABLE
    const systemUsersCountResult = await turso.execute("SELECT COUNT(*) as count FROM users WHERE id IN ('akshay', 'ravish');");
    const systemUsersExist = systemUsersCountResult.rows[0].count;

    if (systemUsersExist < 2) {
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
        console.error("Error seeding default users (this specific error can sometimes be ignored if users already exist):", insertError);
      }
    } else {
      console.log("Default users (Akshay, Ravish) already present.");
    }

    console.log("Database schema initialization process completed successfully.");
    dbInitialized = true; // Set flag to true on success
  } catch (e) {
    console.error("CRITICAL: Failed to initialize database schema. Error details:", e);
    // Re-throw the error so Vercel logs it clearly and stops the function
    throw e;
  }
}
