import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function SignoutButton() {
  return (
    <Button variant={"ghost"} onClick={() => signOut()}>
      Log out
    </Button>
  );
}
