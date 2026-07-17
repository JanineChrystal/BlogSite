import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { admin } from "@/lib/db/schema";

// Safely fetches an admin user by their username.
// Returns the admin record or undefined if not found.
export async function getAdminByUsername(username: string) {
	const [user] = await db
		.select()
		.from(admin)
		.where(and(eq(admin.userName, username), isNull(admin.deletedAt)));

	return user;
}
