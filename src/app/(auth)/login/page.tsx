"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  const [pending, setPending] = useState(false);

  const handleSignIn = async (provider: "google") => {
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

  return <LoginForm />;
}
