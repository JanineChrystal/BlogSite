<div align="center">

# 📝 Janine Blogsite

### *also referenced as Chrystl.Blogs*

A full-stack, modern blogging platform built with Next.js — a public-facing site for readers, paired with a secure, feature-rich administrative dashboard for content management. It handles robust content workflows, including soft-delete across posts, comments, and categories; a draft/publish/scheduled post lifecycle; and threaded comment moderation.

[![Next.js](https://img.shields.io/badge/Next.js-App%20Router-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C5F74F)](https://orm.drizzle.team/)
[![pnpm](https://img.shields.io/badge/pnpm-package%20manager-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)

[**Live Demo →**](https://chrystl-blogs.vercel.app/)

</div>

---

## Quick Navigation

- [Installation / Setup](#installation--setup-instructions)
- [Features](#features)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Credits](#credits)

---

## Installation / Setup Instructions

### 1. Prerequisites

This project uses **pnpm** as its package manager. Install it globally if you don't already have it:

```bash
npm install -g pnpm
```

### 2. Clone & Install

```bash
git clone <your-repo-url>
cd janine-blogsite
pnpm install
```

### 3. Environment Variables

Create a `.env` or `.env.local` file in the project root:

```env
# Database connection string for Drizzle ORM
DATABASE_URL="your_database_connection_string"

# Public site URL
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Add any additional secrets (auth, file uploads, etc.) here
```

### 4. Set Up the Database

Push the schema and seed the database — adjust these to match the actual script names in your `package.json`:

```bash
pnpm db:push
pnpm db:seed
```

### 5. Run the Dev Server

```bash
pnpm dev
```

The app should now be running at `http://localhost:3000`.

---

## Features

- **Public blog site** — home page, individual post pages, and a shared Navbar/Footer layout.
- **Secure admin console** — username/password login, gated behind route-level middleware so the dashboard is unreachable without a valid session.
- **Post management** — create, edit, and soft-delete posts, with a full draft → published → scheduled lifecycle; drafts can be saved with just a title, while publishing requires a complete post.
- **Comment moderation** — a Pending/All Comments queue, inline Approve/Reject/Delete actions, a threaded reply-context modal, and automatic bad-word filtering applied server-side on submission.
- **Soft-delete workflows** — posts, comments, and categories are never hard-deleted; removed rows are simply excluded from every query rather than dropped from the database.
- **Cinematic, dark-themed design system** — Montserrat + Inter typography, a high-contrast red accent, and a Tailwind-driven theme shared across public and admin surfaces.
- **Responsive layout** — a persistent sidebar on desktop, collapsing to a drawer-based mobile navigation.
- **Smooth page transitions**, powered by Framer Motion.

---

## Project Structure

### App Router & Layout

```
src/app/
├── (public)/                   # Public-facing site
│   ├── (home)/                  # Home page route
│   ├── components/
│   │   ├── layout/               # Navbar, Footer
│   │   ├── sections/              # Homepage sections
│   │   └── ui/
│   ├── constants/
│   ├── error.tsx
│   ├── layout.tsx
│   └── not-found.tsx
├── admin/
│   ├── (auth)/                   # Unauthenticated admin routes (log-in)
│   ├── (private)/                 # Authenticated admin dashboard
│   ├── components/
│   ├── constants/
│   ├── error.tsx
│   └── not-found.tsx
├── hooks/                        # App-level React hooks
├── globals.css
├── icon.png
├── layout.tsx                    # Root layout — <html>/<body>, fonts
└── template.tsx
```

### Library, Database & Actions

```
src/
├── components/
│   └── ui/                       # Shared shadcn components
├── lib/
│   ├── actions/                   # Server Actions — form submissions & mutations
│   │   ├── auth-admin/
│   │   ├── comment-management/
│   │   ├── forms/
│   │   ├── post-management/
│   │   └── search.ts
│   ├── data/
│   ├── db/
│   │   ├── queries/
│   │   │   ├── comment/
│   │   │   └── post/
│   │   │       ├── admin.ts
│   │   │       ├── data.ts
│   │   │       └── get-more-post.ts
│   │   ├── index.ts                 # Drizzle client/connection setup
│   │   ├── schema.ts
│   │   └── seed.ts
│   ├── helpers/
│   ├── schema/                       # Drizzle table definitions + Zod validation
│   ├── types/                         # Shared TypeScript types
│   └── utils/
│       ├── format-date.ts
│       ├── generate-excerpt.ts
│       ├── nav.ts
│       └── utils.ts                   # cn() and other shared helpers
└── proxy.ts
```

### Configuration Files

```
.
├── .env
├── .env.local
├── .gitignore
├── biome.json               # Linting & formatting
├── components.json          # shadcn/ui config
├── drizzle.config.ts        # Database migration configuration
├── migrate.log
├── next-env.d.ts
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── postcss.config.mjs
└── tsconfig.json
```

### Directory Explanation

| Path | Purpose |
|---|---|
| `src/app/(public)` | All publicly accessible routes — the home page and individual blog post pages. |
| `src/app/admin` | The secure administrative dashboard, split into `(auth)` and `(private)` route groups. |
| `src/components/ui` | Shared shadcn/ui components used across both the public site and the admin dashboard. |
| `src/lib/actions` | Server Actions, grouped by feature (`auth-admin`, `comment-management`, `forms`, `post-management`) plus a standalone `search.ts`. |
| `src/lib/data` | Read-side data access, separate from the mutation-focused `actions` folder. |
| `src/lib/db` | Drizzle ORM setup (`index.ts`), schema, seed script, and isolated query files under `queries/comment` and `queries/post`. |
| `src/lib/helpers` | General-purpose helper logic that doesn't fit `utils`. |
| `src/lib/schema` | Database structure and validation schemas (e.g. Zod for form validation). |
| `src/lib/utils` | Small shared utilities — date formatting, excerpt generation, nav helpers, and `cn()`. |
| `src/proxy.ts` | *(purpose not confirmed — verify this is doing what the name suggests before relying on this description)* |

---

## Tech Stack

| Category | Technology |
|---|---|
| Core Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Database & ORM | Drizzle ORM |
| Validation | Zod |
| State / Data Fetching | React Hooks (`useState`, `useEffect`), custom hooks (`useLazyLoad`, `usePostSort`) |
| Package Manager | pnpm |
| Linter / Formatter | Biome |
| Hosting | Vercel (recommended) |

---

## Credits

- Built with [Next.js](https://nextjs.org/) and React.
- UI animations powered by [Framer Motion](https://www.framer.com/motion/).
- Database interactions and schemas simplified by [Drizzle ORM](https://orm.drizzle.team/).
- Icons sourced from [Google Material Symbols](https://fonts.google.com/icons).