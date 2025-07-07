"use client";

import { getAuth, signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { SignOut } from "@/lib/action/auth.action";
import { useTransition } from "react";
import { toast } from "sonner";
import { auth } from "@/firebase/client";

export default function SignOutButton() {
  const [isPending, startTransition] = useTransition();

  const handleSignOut = async () => {
    try {
      await signOut(auth);

      startTransition(() => {
        SignOut();
      });

      toast.success("Signed out successfully");
      window.location.href = "/sign-in";
    } catch (err) {
      console.error("Signout error:", err);
      toast.error("Error signing out");
    }
  };

  return (
    <Button onClick={handleSignOut} disabled={isPending}>
      {isPending ? "Signing out..." : "Sign Out"}
    </Button>
  );
}
