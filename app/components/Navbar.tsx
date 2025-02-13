"use client";
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { useSession } from "next-auth/react";
import SignInButton from "./SignInButton";

export default function Navbar() {
  const { data: session } = useSession();
  return (
    <nav className="border-b p-4 flex justify-between">
      <div className="">
        <Link className="font-mono text-2xl tracking-widest" href={"/"}>
          cryptonite.
        </Link>
      </div>
      <div className="flex items-center space-x-2">
        <ModeToggle />
        {!session ? (
          <div className="space-x-2">
            <SignInButton />
          </div>
        ) : (
          ""
        )}
      </div>
    </nav>
  );
}
