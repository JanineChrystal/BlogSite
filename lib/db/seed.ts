import * as dotenv from "dotenv";
import { db } from "./index"; 
import { admin, categories } from "./schema";

dotenv.config({ path: ".env.local" });

//  UUID for  seed admin to link with posts later
const SEED_ADMIN_ID = "00000000-0000-0000-0000-000000000000";

async function main() {
  console.log("Starting database seeding process...");

  // initial admin account
  await db.insert(admin).values({
    userId: SEED_ADMIN_ID,
    userName: "NinejaChrys",
    passwordHash: "temporaryp4ssw_hash!", 
    themeMode: "dark",
    accentColor: "zinc",
  });
  console.log("Admin account created.");

  // First default category
  await db.insert(categories).values({
    name: "Entertainment",
    slug: "entertainment",
  });
  console.log("Default category created.");

  console.log("Database seeded successfully!");
}

main();