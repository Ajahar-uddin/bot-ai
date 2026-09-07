# Bot AI

A Next.js starter with authentication already wired end to end — email/password plus Google and GitHub OAuth, session persistence, and route protection that works in both directions.

Built on **Next.js 16** (App Router), **React 19**, **shadcn/ui** with Tailwind CSS v4, **Prisma v8** (Prisma Next), and **Better Auth**.

---

## What you get


|                         |                                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------- |
| **Auth**                | Email + password, Google OAuth, GitHub OAuth                                                      |
| **Sessions**            | 30-day sessions, signed cookie cache so most requests skip the database                           |
| **Route protection**    | Signed-out users are sent to `/login`; signed-in users can't reach `/login` or `/signup`          |
| **Return-to redirects** | `/login?redirect=/some/page` sends you back where you came from after signing in                  |
| **UI**                  | shadcn/ui (`radix-luma` style, Phosphor icons), dark/light/system theme toggle, toasts via Sonner |
| **Database**            | Prisma v8 with a typed data contract and migrations                                               |


---

## Requirements

- **Node.js 20+**
- **PostgreSQL 15 or newer** — Prisma v8 does not support older servers
- **pnpm 9** (`corepack enable` will set it up for you)

---

## Getting started

### 1. Install

```bash
git clone <your-repo-url>
cd bot-ai
pnpm install
```

### 2. Configure your environment

```bash
cp .env.example .env
```

Then fill in `.env`:

```env
# PostgreSQL 15+ connection string
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# Better Auth
BETTER_AUTH_SECRET="a-long-random-string"
BETTER_AUTH_URL="http://localhost:3001"

# Google OAuth (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# GitHub OAuth (optional)
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
```

Generate a secret with:

```bash
openssl rand -base64 32
```

> `BETTER_AUTH_URL` must match the origin you actually browse to. The dev server runs on **port 3001**, so a mismatched port here is the usual cause of a login that appears to succeed but doesn't stick.

**OAuth is optional.** Leave the Google and GitHub variables empty and email/password sign-in still works — only those two buttons will fail. To enable them, register an app with each provider and set the callback URL to:

- Google — `http://localhost:3001/api/auth/callback/google`
- GitHub — `http://localhost:3001/api/auth/callback/github`

### 3. Create the database tables

```bash
pnpm dlx prisma@latest contract emit
```

### 4. Run it

```bash
pnpm dev
```

Open **[http://localhost:3001](http://localhost:3001)**. You will be redirected to `/login` — click **Sign up** to create your first account.

---

## Project structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx      # email/password + social sign-in
│   │   │   └── SignupForm.tsx     # registration form
│   │   ├── login/page.tsx         # server-checks session, redirects if signed in
│   │   ├── signup/page.tsx
│   │   └── redirect.ts            # validates the ?redirect= param
│   ├── api/auth/[...all]/route.ts # Better Auth request handler
│   ├── components/Navbar.tsx
│   ├── layout.tsx
│   └── page.tsx                   # protected home page
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── sign-out.tsx
│   ├── mode-toogle.tsx
│   └── theme-provider.tsx
├── lib/
│   ├── auth.ts                    # Better Auth server config
│   ├── auth-client.ts             # Better Auth React client
│   └── utils.ts
├── prisma/
│   ├── contract.prisma            # your data models
│   └── db.ts                      # typed database client
└── proxy.ts                       # route protection (Next.js 16 "proxy")
```

---

## How authentication works

Three layers, each with a different job:

1. `**src/proxy.ts**` runs before every request and does an *optimistic* check — it reads the session cookie without touching the database, so it stays fast. Signed-out visitors are redirected to `/login?redirect=<path>`; signed-in visitors are bounced off `/login` and `/signup`.
2. **Server components** do the *authoritative* check with `auth.api.getSession()`, which validates against the database. Never rely on the proxy alone for anything that actually matters — that is why `src/app/page.tsx` re-checks.
3. `**src/lib/auth-client.ts`** handles the browser side: `signIn`, `signUp`, `signOut`, and the `useSession()` hook.

Reading the session in a server component:

```tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  return <p>Hello, {session.user.name}</p>;
}
```

Reading it in a client component:

```tsx
"use client";
import { useSession } from "@/lib/auth-client";

export function Greeting() {
  const { data: session, isPending } = useSession();
  if (isPending) return null;
  return <p>Hello, {session?.user.name}</p>;
}
```

Prefer the server version where you can — it renders with the user already known, so there is no signed-out flash on reload.

### Protecting more routes

`src/proxy.ts` protects **everything** by default except the auth API, Next.js internals, and static files. To make a route public, add it to the list the proxy skips. To add another signed-out-only page, add its path to `AUTH_ROUTES`.

---

## Database

Models live in `[src/prisma/contract.prisma](src/prisma/contract.prisma)`. The `User`, `Session`, `Account`, and `Verification` models are required by Better Auth — change them only if you know what you are doing.

To add your own model:

1. Edit `src/prisma/contract.prisma`
2. Run `pnpm prisma contract emit` to regenerate types
3. Query it — your editor autocompletes every table, column, and relation

```ts
import { prisma } from "@/prisma/db";

const user = await prisma.User.where({ email: "alice@example.com" }).first();
```


| Command                                | What it does                                   |
| -------------------------------------- | ---------------------------------------------- |
| `pnpm dlx prisma@latest contract emit` | Regenerate `contract.json` and `contract.d.ts` |
| `pnpm prisma db update`                | Create the tables in your database             |
| `pnpm prisma migration status`         | Show migration status                          |


> **Note:** Better Auth talks to Postgres directly through its built-in Kysely dialect rather than through Prisma. Its Prisma adapter only supports Prisma 7 and below, and this project is on Prisma 8, whose ORM is a different API. Both read the same tables, so your app code keeps using `@/prisma/db` as normal.

See `[prisma-next.md](prisma-next.md)` for the full Prisma v8 guide.

---

## UI components

This project uses [shadcn/ui](https://ui.shadcn.com) with the `radix-luma` style and Phosphor icons. Add a component:

```bash
pnpm dlx shadcn@latest add dialog
```

Components land in `src/components/ui/` and are yours to edit.

---

## Scripts


| Command              | What it does                      |
| -------------------- | --------------------------------- |
| `pnpm dev`           | Start the dev server on port 3001 |
| `pnpm build`         | Production build                  |
| `pnpm start`         | Serve the production build        |
| `pnpm lint`          | Run ESLint                        |
| `pnpm contract:emit` | Regenerate the Prisma contract    |


---

## Deploying

1. Push to a Git repo and import it on [Vercel](https://vercel.com/new) (or any Node host).
2. Set every variable from your `.env` in the host's environment settings.
3. Point `BETTER_AUTH_URL` at your production URL — for example `https://yourapp.com`.
4. Add your production callback URLs to the Google and GitHub OAuth apps.
5. Run `pnpm prisma db init` against your production database.

---

## Troubleshooting

**Login succeeds but I am signed out on the next page.**
`BETTER_AUTH_URL` does not match the origin in your browser's address bar. Check the port — dev runs on 3001, not 3000.

**Redirect loop between `/` and `/login`.**
The session cookie is not being set. Confirm `BETTER_AUTH_SECRET` is set and that the app can reach the database.

**"Could not sign in with Google/GitHub".**
The provider's client ID or secret is missing from `.env`, or the callback URL registered with the provider does not match your `BETTER_AUTH_URL`.

**Prisma errors on startup.**
Verify your Postgres server is 15 or newer (`SELECT version()`), then run `pnpm prisma db init`.

---

## Learn more

- [Next.js docs](https://nextjs.org/docs)
- [Better Auth docs](https://better-auth.com/docs)
- [Prisma docs](https://prisma.io/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

