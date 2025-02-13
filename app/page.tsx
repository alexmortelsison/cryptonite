import { Button } from "@/components/ui/button";
import SignInButton from "./components/SignInButton";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) {
    return redirect("/dashboard");
  }
  return (
    <div className="w-full flex flex-col justify-center items-center h-[80vh] max-w-6xl mx-auto px-4 md:px-0">
      <h1 className="text-primary text-2xl sm:text-6xl font-extrabold text-center tracking-tighter leading-none font-mono">
        Your Go-To Hub for Everything Crypto – Stay Informed, Stay Ahead.
      </h1>
      <p className="text-center pt-6 text-muted-foreground tracking-tighter md:w-4/5 text-sm md:text-base font-mono">
        Crypto evolves fast—stay informed with clear insights on blockchain,
        DeFi, and market trends. From beginners to experts, we break down
        complex topics so you can navigate the crypto world with confidence.
      </p>
      <div className="mt-8 w-auto">
        <Button asChild variant={"ghost"} size={"lg"}>
          <SignInButton />
        </Button>
      </div>
    </div>
  );
}
