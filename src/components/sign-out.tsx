"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { SignOutIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SignOut() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleSignOut = async () => {
    setPending(true);
    const { error } = await authClient.signOut();

    if (error) {
      toast.error(error.message ?? "Could not sign out");
      setPending(false);
      return;
    }

    toast.success("Signed out successfully");
    router.push("/login");
    router.refresh();
  };

  return (
    <Button onClick={handleSignOut} disabled={pending} size="icon">
      <SignOutIcon size={50} />
    </Button>
  );
}
