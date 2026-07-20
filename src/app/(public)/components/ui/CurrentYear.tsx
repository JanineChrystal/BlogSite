"use client";

import { useEffect, useState } from "react";

export function CurrentYear() {
	// Initialize the year state. The server will see this as null during prerendering.
	const [year, setYear] = useState<number | null>(null);

	useEffect(() => {
		// This block only executes in the browser, safely bypassing the server
		setYear(new Date().getFullYear());
	}, []);

	// Render nothing or  could put a fallback like "2026" until the browser calculates the year
	if (!year) return null;

	return <>{year}</>;
}
