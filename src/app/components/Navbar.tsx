"use client";
import { ModeToggle } from "@/components/mode-toogle";
import SignOut from "@/components/sign-out";
import { Button } from "@/components/ui/button";
import { authClient, useSession } from "@/lib/auth-client";
import { RainbowCloudIcon, SignOutIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav>
      <div className="max-w-10/12 mx-auto border rounded-full border-accent p-5 mt-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <RainbowCloudIcon className="size-10 text-primary " />
            <h1 className="text-2xl font-bricol font-bold">Bot Ai</h1>
          </div>

          {session?.user.name && (
            <div className="flex gap-2 items-center">
              <p className="text-sm text-muted-foreground">
                {session?.user.name}
              </p>
            </div>
          )}
          <div className="flex gap-2 items-center">
            <ModeToggle />
            <SignOut />
          </div>
        </div>
      </div>
    </nav>
  );
}
