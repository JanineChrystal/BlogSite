"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions/auth";

export function LoginForm() {
	const [state, formAction, isPending] = useActionState(loginAction, {
		error: null,
	});

	return (
		<form action={formAction} className="space-y-4">
			<input
				name="username"
				type="text"
				placeholder="Username"
				autoComplete="username"
				required
				className="w-full border-b border-outline-variant bg-surface-container px-3 py-3 text-on-surface outline-none focus:border-primary-container"
			/>
			<input
				name="password"
				type="password"
				placeholder="Password"
				autoComplete="current-password"
				required
				className="w-full border-b border-outline-variant bg-surface-container px-3 py-3 text-on-surface outline-none focus:border-primary-container"
			/>

			{state.error && <p className="text-sm text-error">{state.error}</p>}

			<button
				type="submit"
				disabled={isPending}
				className="w-full bg-primary-container py-3 font-heading font-bold uppercase tracking-widest text-on-primary-container disabled:opacity-60"
			>
				{isPending ? "Signing in…" : "Log in"}
			</button>
		</form>
	);
}
