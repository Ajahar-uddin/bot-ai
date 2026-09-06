import 'dotenv/config';
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";

// better-auth's Prisma adapter only supports Prisma <= 7 (`prisma.user.findUnique(...)`).
// This project is on Prisma 8, whose ORM is a different builder API (`db.orm.public.User…`),
// so better-auth talks to the same Postgres directly via its built-in Kysely dialect.
// The `user` / `session` / `account` / `verification` tables in contract.prisma already
// match the column names better-auth expects. App code keeps using `@/prisma/db`.
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const auth = betterAuth({
    database: pool,
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    plugins: [nextCookies()]
});
