"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "next-auth/react";
import Image from "next/image";
import SignoutButton from "./SignoutButton";
import Link from "next/link";

const navlinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
];

export default function UserDropdown() {
  const { data: session } = useSession();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="items-center flex">
        {session ? (
          <Image
            src={session.user?.image as string}
            alt="avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <Image src={"/defav.jpg"} alt="avatar" width={12} height={12} />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          {navlinks.map((link, idx) => (
            <DropdownMenuItem key={idx}>
              <Link
                href={link.href}
                className="w-full justify-center items-center flex font-mono"
              >
                {link.name}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="items-center justify-center flex">
          <SignoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
