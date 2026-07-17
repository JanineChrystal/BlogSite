import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL environment variable is missing or empty.");
}

const sql = neon(process.env.DATABASE_URL);

// Binding the connection and the schema together into a single database instance
export const db = drizzle(sql, { schema });

// Note: This index file is the pipeline between the next js application and the neon database.
