import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

// Extract the environment variable to a local constant
const databaseUrl = process.env.DATABASE_URL;

// Validate that the connection string exists before exporting the config
if (!databaseUrl) {
	throw new Error("DATABASE_URL environment variable is missing.");
}

export default defineConfig({
	// Point the CLI directly to your custom schema file location
	schema: "./lib/db/schema.ts",

	// Set the target output directory for your SQL migration assets
	out: "./drizzle",

	// Define the database engine dialect
	dialect: "postgresql",

	dbCredentials: {
		// Pass the verified connection string
		url: databaseUrl,
	},
});
