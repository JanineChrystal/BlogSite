import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { relations } from "./schema";

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL environment variable is missing or empty.");
}

const sql = neon(process.env.DATABASE_URL);

// Binding the connection and the schema together into a single database instance
export const db = drizzle({ client: sql, relations });

// Note: This index file is the pipeline between the next js application and the neon database.
