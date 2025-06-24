// lib/db.js
import { Client } from 'pg';

// Using a module-scoped variable to store the promise of a connected client.
// This ensures that within a single serverless function invocation,
// the connection attempt is only made once, and subsequent calls
// will await the same promise.
let clientPromise;

/**
 * Gets a singleton PostgreSQL client instance.
 * The connection is established only once per serverless function cold start.
 * @returns {Promise<Client>} A promise that resolves to the connected pg.Client instance.
 * @throws {Error} If DATABASE_URL is not set or connection fails.
 */
export async function getDbClient() {
  if (!clientPromise) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set. Please configure it in your .env.local file or Vercel Environment Variables.");
    }

    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      // Add SSL mode if required by your Supabase setup (often 'require' or 'prefer')
      // For Supabase, often no explicit SSL config is needed if the connection string handles it.
      // If you face SSL errors, you might need:
      // ssl: {
      //   rejectUnauthorized: false // Use with caution, for dev only, or if specific certificate is provided
      // }
    });

    clientPromise = client.connect()
      .then(() => {
        console.log("Successfully connected to PostgreSQL database.");
        return client;
      })
      .catch((error) => {
        console.error("Failed to connect to PostgreSQL database. Error details:", error);
        // Clear the promise so the next call in a new invocation might try again
        clientPromise = null;
        throw error; // Re-throw the error so the API route handler can catch it
      });
  }
  return clientPromise;
}

/**
 * Initializes the database schema by creating tables if they don't exist
 * and seeding default users.
 * This function is designed to be idempotent (safe to run multiple times).
 * @throws {Error} If schema initialization queries fail.
 */
export async function initDbSchema() {
  const client = await getDbClient(); // Ensure connection is established
  console.log("Attempting to initialize database schema...");

  try {
    // Enable UUID extension for PostgreSQL if needed (common for Supabase default IDs)
    // await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

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
    // Use INSERT INTO ... ON CONFLICT (id) DO NOTHING for idempotency in PostgreSQL
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
    // Important: Reset clientPromise if schema init fails to force re-connection on next attempt
    clientPromise = null; 
    throw e; // Re-throw to propagate the error up to the API route handler
  }
}
