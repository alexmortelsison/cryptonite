"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function SignInButton() {
  return (
    <Button onClick={() => signIn()}>
      <p className="font-mono tracking-tight">Log in</p>
    </Button>
  );
}
