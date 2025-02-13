import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function SignoutButton() {
  return (
    <Button variant={"ghost"} onClick={() => signOut()}>
      <p className="font-mono tracking-tight">Log out</p>
    </Button>
  );
}
