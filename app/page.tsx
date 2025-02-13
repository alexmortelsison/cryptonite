import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";

export default function Home() {
  return (
    <div className="w-full flex flex-col justify-center items-center h-[70vh] max-w-6xl mx-auto">
      <h1 className="text-primary text-6xl font-extrabold text-center tracking-tighter leading-tight">
        Your Go-To Hub for Everything Crypto – Stay Informed, Stay Ahead.
      </h1>
      <p className="text-center pt-6 text-muted-foreground tracking-tighter">
        Crypto evolves fast—stay informed with clear insights on blockchain,
        DeFi, and market trends. From beginners to experts, we break down
        complex topics so you can navigate the crypto world with confidence.
      </p>
      <Button className="mt-10 max-w-sm w-full">
        <MoveRight />
        SignUp
      </Button>
    </div>
  );
}
