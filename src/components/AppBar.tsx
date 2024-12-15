"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export const AppBar = () => {
  const session = useSession();

  return (
    <div className="flex justify-between items-center p-4 bg-blue-400">
      <div>Cue Me</div>
      <div>
        {session.data?.user ? (
          <button onClick={() => signOut()}>Sign Out</button>
        ) : (
          <button onClick={() => signIn()}>Sign In</button>
        )}
      </div>
    </div>
  );
};
