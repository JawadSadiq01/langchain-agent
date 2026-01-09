import { Pool } from "pg";

export const pgPool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: true, // Neon requires SSL
});
