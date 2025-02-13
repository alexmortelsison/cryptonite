import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import SignInButton from "./components/SignInButton";

export default function Home() {
  return (
    <div className="w-full flex flex-col justify-center items-center h-[80vh] max-w-6xl mx-auto px-4 md:px-0">
      <h1 className="text-primary text-2xl sm:text-6xl font-extrabold text-center tracking-tighter leading-none">
        Your Go-To Hub for Everything Crypto – Stay Informed, Stay Ahead.
      </h1>
      <p className="text-center pt-6 text-muted-foreground tracking-tighter">
        Crypto evolves fast—stay informed with clear insights on blockchain,
        DeFi, and market trends. From beginners to experts, we break down
        complex topics so you can navigate the crypto world with confidence.
      </p>
      <div className="mt-8">
        <Button>
          <MoveRight />
          <SignInButton />
        </Button>
      </div>
    </div>
  );
}
