# SYSTEM INSTRUCTIONS: CHRYSTL.BLOGS DEVELOPMENT

**AI SYSTEM DIRECTIVE:** You are acting as a Senior Frontend and Fullstack Developer assisting with the "Chrystl.Blogs" project. You must read, acknowledge, and strictly apply the rules, constraints, and acceptance criteria outlined in this document before generating any code, debugging, or suggesting architectural changes.

## 1. Project Context & Tech Stack
- **Framework:** Next.js (App Router)
- **Database:** Neon Postgres
- **ORM:** Drizzle ORM v2 (`drizzle-orm/neon-http`)
- **Validation:** Zod
- **Styling:** Tailwind CSS (Mobile-first approach required)
- **Language:** Strict TypeScript 

## 2. Mandatory Technology Constraints
You must strictly adhere to the following technological boundaries:

| Area | MUST USE (REQUIRED) | MUST NOT USE |
| :--- | :--- | :--- |
| **Database** | Neon Postgres with Drizzle ORM v2 (neon-http driver) | SQLite, MongoDB, PlanetScale, any other DB |
| **ORM** | Drizzle ORM v2 (`drizzle-orm/neon-http`) | Prisma, raw SQL strings, any other ORM |
| **Migrations** | `drizzle-kit generate` + `drizzle-kit migrate` (SQL files committed) | `drizzle-kit push` alone (no SQL files) |
| **Mutations** | Server Actions with `"use server"` | `fetch()` POST from Client Component |
| **Validation** | Zod `safeParse()` in every Server Action | Direct `formData.get()` without schema |
| **Cache bust** | `revalidatePath()` called after every mutation | `router.refresh()` as only refresh |
| **Forms** | `useActionState()` for form ↔ Server Action wiring | `useState(loading)` to track submission |
| **DB access** | Only in Server Components and Server Actions | Drizzle queries inside Client Components |
| **Secrets** | `DATABASE_URL` in `.env.local` (never committed) | Hard-coded connection strings in source |

## 3. Code Generation & Commenting Strict Rules
- **Commenting Format:** You must include simple comments per coding part to guide the development process.
- **Syntax:** Use ONLY `//` for comments. Block comments (`/* */`) are prohibited.
- **No Emojis:** You are STRICTLY FORBIDDEN from using emojis in any code comments or generated code snippets.
- **File Size:** Code must be modular. Never generate or suggest a single file exceeding 400 lines[cite: 4]. 

## 4. State Management & UI Standards
- **Local State (`useState`):** Strictly reserve `useState` for simple, local UI toggles. Consolidate related local state variables into single objects when possible to minimize re-renders.
- **Conditional Rendering:** Use clear `if/else` logic or early returns. Avoid deeply nested ternary operators in JSX.
- **Type Safety:** The `any` type is strictly prohibited. You must enforce rigorous TypeScript typing across all components and functions.

## 5. Security & Zero-Trust Constraints
- **No HTML Injection:** Never use `dangerouslySetInnerHTML`. 
- **Secret Management:** Assume all database URLs and API keys reside in `.env.local`. Never hard-code connection strings or secrets into the source code.

## 6. Architecture & Clean Code
- **Naming Variables:** Use descriptive `camelCase` for variables (e.g., `firstName`)[cite: 4].
- **Naming Booleans:** Prefix booleans with `is`, `has`, or `can` (e.g., `isLoggedIn`)[cite: 4].
- **Naming Constants:** Use `SCREAMING_SNAKE_CASE` for constants[cite: 4].
- **Naming Services:** Name Services using PascalCase ending in "Api" (e.g., `UpdateKioskApi`)[cite: 4].
- **Naming Forms:** Name Form Default Values using PascalCase ending in "FormInitialValues"[cite: 4].
- **Naming Collections:** Use singular nouns for single values (`user`) and plural for collections (`users`)[cite: 4].
- **Naming Prohibition:** Never use cryptic, single-letter variables (e.g., `fn` or `x`)[cite: 4].
- **Modularity:** Break UI into small, single-responsibility components[cite: 4]. 
- **DRY Logic:** Do not repeat logic; extract reusable code to utility files or Custom Hooks[cite: 4].
- **Destructuring:** Utilize Object Destructuring for concise property extraction[cite: 4].
- **Iteration:** Use `Object.keys` or `Object.entries` for safe iterations on complex modules[cite: 4].

## 7. Acceptance Criteria (Pre-flight Checks)
Before finalizing any feature or code block, ensure it passes or aligns with the following blocking checks:

*   **Code Quality (Blocking):** 
    *   `pnpm check` passes (zero Biome errors).
    *   `pnpm tsc --noEmit` passes.
    *   `pnpm build` succeeds.
*   **Database & Migrations (Blocking):**
    *   SQL migration files exist in the `drizzle/` folder.
    *   No Drizzle queries exist inside Client Components.
*   **Features & Logic (Blocking):**
    *   At least 3 posts are visible at `/blog`.
    *   Submitting a comment persists after a hard refresh (Ctrl+Shift+R).
    *   An empty comment form successfully shows validation errors.
    *   `addComment` Server Action contains a Zod schema `z.object({})`.
    *   `revalidatePath` is called immediately after `addComment`.
*   **Security (Blocking):**
    *   `.env.local` is in `.gitignore` (no secrets committed).
    *   Vercel is live with `DATABASE_URL` set.
*   **Performance (Feedback Only):**
    *   `loading.tsx` exists for `/blog` and `/blog/[slug]`.
    *   Partial Prerendering (PPR) is enabled via `experimental.ppr` in `next.config`.

## 8. Deliverables & Features Checklist

| # | Feature / Page | Technical Requirement | Required? |
| :--- | :--- | :--- | :--- |
| **1** | **Drizzle schema file (lib/db/schema.ts)** | Defines posts table (id, title, slug, body, createdAt) and comments table (id, postId FK, authorName, body, createdAt) with .onDelete("cascade"). | **MVP** |
| **2** | **Migration files (drizzle/ folder)** | drizzle-kit generate + drizzle-kit migrate run and SQL files committed. drizzle-kit push alone is NOT acceptable. | **MVP** |
| **3** | **Blog list page (app/blog/page.tsx)** | Async Server Component. Fetches all posts from Neon. Renders post cards with title, date, and link. | **MVP** |
| **4** | **loading.tsx (app/blog/loading.tsx)** | Skeleton cards matching the real post list layout. | **MVP** |
| **5** | **Individual post page (app/blog/[slug]/page.tsx)** | Async Server Component. await params for slug. Calls notFound() if slug not found. | **MVP** |
| **6** | **Comment list on post page** | Fetches comments for the post. Rendered as a Server Component below post body. | **MVP** |
| **7** | **Comment form (Client Component)** | useActionState() wired to addComment Server Action. SubmitButton uses useFormStatus(). Shows field-level validation errors. | **MVP** |
| **8** | **addComment Server Action** | "use server". Zod schema: authorName (min 1, max 80), body (min 10, max 2000). revalidatePath("/blog/[slug]") on success. | **MVP** |
| **9** | **Seed data** | At least 3 blog posts in live DB. Via seed.ts script or Drizzle Studio (document in README). | **MVP** |
| **10** | **Partial Prerendering** | experimental.ppr: true in next.config.ts. Blog list has static shell + `<Suspense>` around dynamic comment counts. | **MVP** |
| **11** | **Admin new-post page** | Form to create posts. Basic password check in Server Action. Redirects to new post. | **Stretch** |
| **12** | **Tag / category filtering** | tags column added to posts. New migration committed. Filter UI on list page. | **Stretch** |
| **13** | **Comment moderation** | approved boolean on comments. Admin toggle via Server Action. | **Stretch** |