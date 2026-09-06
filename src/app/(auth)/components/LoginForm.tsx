"use client";

import { ModeToggle } from "@/components/mode-toogle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GithubLogoIcon, GoogleLogoIcon } from "@phosphor-icons/react";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";

export default function LoginForm() {
  const [pending, setPending] = useState(false);
  const handleSignIn = async (provider: "google" | "github") => {
    setPending(true);
    const response = await authClient.signIn.social({
      provider,
      callbackURL: "/",
      errorCallbackURL: "/login",
    });

    if (response.error) {
      toast.error(response.error.message ?? "Could not sign in with Google");
      setPending(false);
    }
  };
  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="ma-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center justify-between gap-2">
                <h1 className="text-2xl font-bold">Login</h1>
                <ModeToggle />
              </div>
            </CardTitle>
            <CardDescription>Welcome to Bot AI</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button disabled={pending} onClick={() => handleSignIn("google")}>
              {pending ? "Signing in..." : "Sign in with Google"}
              <GoogleLogoIcon weight="bold" className="size-5" />
            </Button>
            <Button disabled={pending} onClick={() => handleSignIn("github")}>
              {pending ? "Signing in..." : "Sign in with Github"}
              <GithubLogoIcon className="size-5" weight="bold" />
            </Button>
          </CardContent>
          <CardFooter>
            <p>Terms & Conditions</p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
