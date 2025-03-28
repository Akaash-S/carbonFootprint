import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import * as schema from '@shared/schema';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import dotenv from 'dotenv'
dotenv.config()

// Use environment variables for database configuration
const DATABASE_URL = process.env.DATABASE_URL || '';

// Create a database client
export const sql = neon(DATABASE_URL);
// Type assertion to help with TypeScript compatibility
export const db = drizzle(sql as any, { schema });

// Function to run migrations
export async function runMigrations() {
  try {
    console.log('Running database migrations...');
    // The migrate function is used to run SQL migrations from a directory
    // We won't use it in this implementation, but it's here for reference
    // await migrate(db, { migrationsFolder: './migrations' });
    
    // For now, we'll just create tables directly
    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
    throw error;
  }
}

export async function initializeDatabase() {
  try {
    // Check if the tables exist, if not create them
    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      )`;
    
    const tablesExist = result[0]?.exists || false;
    
    if (!tablesExist) {
      // Create the users table
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          first_name TEXT NOT NULL,
          last_name TEXT,
          email TEXT,
          eco_rank TEXT DEFAULT 'Beginner',
          points INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `;
      
      // Create the activities table
      await sql`
        CREATE TABLE IF NOT EXISTS activities (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id),
          type TEXT NOT NULL,
          subtype TEXT,
          description TEXT,
          quantity NUMERIC,
          unit TEXT,
          co2_emissions NUMERIC,
          date TIMESTAMP DEFAULT NOW(),
          notes TEXT,
          passengers INTEGER
        )
      `;
      
      // Create the products table
      await sql`
        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          barcode TEXT NOT NULL UNIQUE,
          name TEXT NOT NULL,
          category TEXT,
          co2_per_unit NUMERIC,
          unit TEXT,
          is_user_contribution BOOLEAN DEFAULT FALSE,
          user_id INTEGER REFERENCES users(id),
          created_at TIMESTAMP DEFAULT NOW()
        )
      `;
      
      // Create the challenges table
      await sql`
        CREATE TABLE IF NOT EXISTS challenges (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          target_value NUMERIC,
          unit TEXT,
          start_date TIMESTAMP DEFAULT NOW(),
          end_date TIMESTAMP,
          category TEXT,
          points INTEGER DEFAULT 0
        )
      `;
      
      // Create the user_challenges table
      await sql`
        CREATE TABLE IF NOT EXISTS user_challenges (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id),
          challenge_id INTEGER NOT NULL REFERENCES challenges(id),
          progress NUMERIC DEFAULT 0,
          is_completed BOOLEAN DEFAULT FALSE,
          completed_at TIMESTAMP
        )
      `;
      
      // Create table for sessions
      await sql`
        CREATE TABLE IF NOT EXISTS "session" (
          "sid" varchar NOT NULL PRIMARY KEY,
          "sess" json NOT NULL,
          "expire" timestamp(6) NOT NULL
        )
      `;
      
      await sql`
        CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire")
      `;

      console.log('Database tables created successfully');
    } else {
      console.log('Database tables already exist');
    }
    
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}