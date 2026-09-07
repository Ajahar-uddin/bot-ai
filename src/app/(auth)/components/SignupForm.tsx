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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { GithubLogoIcon, GoogleLogoIcon } from "@phosphor-icons/react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const MIN_PASSWORD_LENGTH = 8;

export default function SignupForm({
  callbackURL = "/",
}: {
  callbackURL?: string;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pending, setPending] = useState<"email" | "google" | "github" | null>(
    null,
  );

  const handleSocialSignIn = async (provider: "google" | "github") => {
    setPending(provider);
    const { error } = await authClient.signIn.social({
      provider,
      callbackURL,
      errorCallbackURL: "/signup",
    });

    if (error) {
      toast.error(error.message ?? `Could not sign up with ${provider}`);
      setPending(null);
    }
  };

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password.length < MIN_PASSWORD_LENGTH) {
      toast.error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setPending("email");
    const { error } = await authClient.signUp.email({ name, email, password });

    if (error) {
      toast.error(error.message ?? "Could not create your account");
      setPending(null);
      return;
    }

    toast.success("Account created");
    router.push(callbackURL);
    router.refresh();
  };

  return (
    <main className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center justify-between gap-2">
                <h1 className="text-2xl font-bold">Sign up</h1>
                <ModeToggle />
              </div>
            </CardTitle>
            <CardDescription>Create your Bot AI account</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <form onSubmit={handleSignUp} className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  autoComplete="name"
                  placeholder="Ada Lovelace"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  minLength={MIN_PASSWORD_LENGTH}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  minLength={MIN_PASSWORD_LENGTH}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={pending !== null}>
                {pending === "email" ? "Creating account..." : "Create account"}
              </Button>
            </form>

            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">or</span>
              <Separator className="flex-1" />
            </div>

            <Button
              variant="outline"
              disabled={pending !== null}
              onClick={() => handleSocialSignIn("google")}
            >
              {pending === "google" ? "Signing up..." : "Sign up with Google"}
              <GoogleLogoIcon weight="bold" className="size-5" />
            </Button>
            <Button
              variant="outline"
              disabled={pending !== null}
              onClick={() => handleSocialSignIn("github")}
            >
              {pending === "github" ? "Signing up..." : "Sign up with Github"}
              <GithubLogoIcon className="size-5" weight="bold" />
            </Button>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
