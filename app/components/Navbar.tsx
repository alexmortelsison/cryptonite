import Link from "next/link";
import { ModeToggle } from "./ModeToggle";

export default function Navbar() {
  return (
    <nav className="border-b p-4 flex justify-between">
      <div className="">
        <Link className="font-mono text-2xl tracking-widest" href={"/"}>
          cryptonite.
        </Link>
      </div>
      <ModeToggle />
    </nav>
  );
}
