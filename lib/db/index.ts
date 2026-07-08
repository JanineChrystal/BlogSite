import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
	// throw a clear error message to immediately stop the build if missing
	throw new Error("DATABASE_URL environment variable is missing or empty.");
}

// Establishing the HTTP connection using my secret environment variable
const sql = neon(process.env.DATABASE_URL!);

// Binding the connection and the schema together into a single database i  nstance
export const db = drizzle({ client: sql, schema });

// Note: This index file is the pipeline between the next js application and the neon database.
