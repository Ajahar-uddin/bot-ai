"use client";
import { Button } from "@/components/ui/button";
import { authClient, useSession } from "@/lib/auth-client";
import { SignOutIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SignOut() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      toast.success("Signed out successfully");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  return (
    <Button onClick={() => handleSignOut()} size="icon">
      <SignOutIcon size={50} />
    </Button>
  );
}
