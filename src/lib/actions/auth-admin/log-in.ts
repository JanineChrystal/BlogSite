"use server";

import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminByUsername } from "@/lib/db/queries/admin";

export type LoginState = {
	error: string | null;
};

export async function loginAction(
	_prevState: LoginState,
	formData: FormData,
): Promise<LoginState> {
	const username = formData.get("username");
	const password = formData.get("password");

	// Basic validation of form input types
	if (typeof username !== "string" || typeof password !== "string") {
		return { error: "Invalid username or password." };
	}

	try {
		// Fetch user record from our dedicated data access layer
		const user = await getAdminByUsername(username);

		// Guard check using optional chaining to prevent revealing incorrect credentials
		if (!user?.passwordHash) {
			return { error: "Invalid username or password." };
		}

		// Verify credentials against the hashed password
		const isValid = await bcrypt.compare(password, user.passwordHash);

		if (!isValid) {
			return { error: "Invalid username or password." };
		}

		const cookieStore = await cookies();
		cookieStore.set("admin_session", "TODO-real-session-token", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
		});
	} catch (dbError) {
		console.error("Database authentication error:", dbError);
		return { error: "An unexpected error occurred. Please try again." };
	}

	redirect("/admin/dashboard");
}
