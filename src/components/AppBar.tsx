"use client";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { Music } from "lucide-react";

export const AppBar = () => {
  const session = useSession();

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center border-b">
      <Link className="flex items-center justify-center" href="#">
        <Music className="h-6 w-6" />
        <p className="px-2 font-semibold">Cue Me</p>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        {/* <div className="text-sm font-medium hover:underline underline-offset-4"> */}
          {session.data?.user ? (
            <>
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
              <Button onClick={() => signOut()}>Sign Out</Button>
            </>
          ) : (
            <Button onClick={() => signIn()}>Sign In</Button>
          )}
        {/* </div> */}
      </nav>
    </header>
  );
};
