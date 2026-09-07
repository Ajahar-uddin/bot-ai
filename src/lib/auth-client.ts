import { createAuthClient } from "better-auth/react";

// No baseURL: the client runs in the browser, where a non-`NEXT_PUBLIC_` env var is
// always undefined. Leaving it unset makes better-auth call `/api/auth/*` on the
// current origin, which is what we want in dev and in production alike.
export const authClient = createAuthClient();

export const { signIn, signUp, signOut, useSession } = authClient;
