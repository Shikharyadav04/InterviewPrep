import { Button } from "@/components/ui/button";
import { isAuthenticated } from "@/lib/action/auth.action";
import { getAuth, signOut } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import SignOutButton from "@/components/SignOut";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");

  return (
    <div className="root-layout ">
      <nav className="flex justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="MockMate Logo" width={38} height={32} />
          <h2 className="text-primary-100">Interview Prep</h2>
        </Link>
        <SignOutButton></SignOutButton>
      </nav>

      {children}
    </div>
  );
};

export default RootLayout;
