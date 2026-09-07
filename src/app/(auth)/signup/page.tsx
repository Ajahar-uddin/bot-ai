import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SignupForm from "../components/SignupForm";
import { safeRedirectPath } from "../redirect";

export default async function SignupPage({ searchParams }: PageProps<"/signup">) {
  const session = await auth.api.getSession({ headers: await headers() });
  const callbackURL = safeRedirectPath((await searchParams).redirect);

  if (session) {
    redirect(callbackURL);
  }

  return <SignupForm callbackURL={callbackURL} />;
}
