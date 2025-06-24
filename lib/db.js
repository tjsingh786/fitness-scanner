// lib/db.js
import { Client } from 'pg';

// Using a module-scoped variable to store the promise of a connected client
// This ensures we don't connect multiple times in the same serverless instance.
let clientPromise;

export async function getDbClient() {
  if (!clientPromise) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set");
    }

    const client = new Client({
      connectionString: process.env.DATABASE_URL,
    });

    clientPromise = client.connect()
      .then(() => {
        console.log("Successfully connected to PostgreSQL database.");
        return client;
      })
      .catch((error) => {
        console.error("Failed to connect to PostgreSQL database:", error);
        // Clear the promise so next call tries again
        clientPromise = null;
        throw error;
      });
  }
  return clientPromise;
}

// Function to initialize the database schema
export async function initDbSchema() {
  const client = await getDbClient();
  console.log("Attempting to initialize database schema...");

  try {
    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        avatar TEXT NOT NULL,
        color TEXT NOT NULL
      );
    `);
    console.log("Ensured 'users' table exists.");

    // Default users (Akshay and Ravish) if they don't exist
    // Use INSERT INTO ... ON CONFLICT to handle idempotency in PostgreSQL
    await client.query(`
      INSERT INTO users (id, name, avatar, color) VALUES
      ('akshay', 'Akshay', '💪', 'from-blue-500 to-cyan-500'),
      ('ravish', 'Ravish', '🔥', 'from-orange-500 to-red-500')
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log("Default users seeded (or already existed).");

    // Workout Packages table
    await client.query(`
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
    await client.query(`
      CREATE TABLE IF NOT EXISTS custom_workouts (
        date TEXT PRIMARY KEY, --YYYY-MM-DD format
        workout_name TEXT NOT NULL,
        exercises TEXT NOT NULL, -- Stored as JSON string
        focus TEXT NOT NULL,
        duration TEXT NOT NULL,
        created_by TEXT NOT NULL
      );
    `);
    console.log("Ensured 'custom_workouts' table exists.");

    // Workout Logs table
    await client.query(`
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
  } catch (e) {
    console.error("CRITICAL: Failed to initialize database schema:", e);
    throw e; // Re-throw to propagate the error
  } finally {
    // In serverless, it's generally better to allow the client to persist
    // for the lifetime of the function invocation, rather than client.end()
    // However, if you explicitly want to close connections after init,
    // be aware of connection pooling limitations. For now, rely on serverless.
  }
}
