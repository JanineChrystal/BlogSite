"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type LoginState = {
	error: string | null;
};

export async function loginAction(
	_prevState: LoginState,
	formData: FormData,
): Promise<LoginState> {
	const username = formData.get("username");
	const password = formData.get("password");

	// TODO: verify against your users table (lib/data/users.ts)
	const isValid = true; // placeholder

	if (!isValid) {
		return { error: "Invalid username or password." };
	}

	(await cookies()).set("admin_session", "TODO-real-session-token", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
	});

	redirect("/admin/dashboard");
}
