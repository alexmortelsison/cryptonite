import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AboutPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect("/");
  }
  return (
    <div className="max-w-5xl mx-auto">
      Welcome to Cryptonite – your trusted source for everything crypto. Whether
      you&apos;re a beginner exploring blockchain or a seasoned trader
      navigating the ever-changing digital economy, we&apos;re here to provide
      insights, news, and analysis to keep you ahead of the curve. Our Mission
      At Cryptonite, we believe in demystifying cryptocurrency and empowering
      individuals with the knowledge needed to make informed decisions. We break
      down complex blockchain concepts, analyze market trends, and deliver
      expert opinions to help you navigate the decentralized future with
      confidence. What We Offer 🚀 Latest Crypto News – Stay updated on the
      biggest developments in blockchain, DeFi, NFTs, and beyond. 📊 Market
      Insights & Analysis – Get expert takes on price movements, trends, and
      investment strategies. 📚 Educational Resources – Learn everything from
      Bitcoin fundamentals to advanced trading techniques. 🔒 Security &
      Regulation Updates – Understand the evolving legal landscape and how to
      protect your assets. Join the Cryptonite Community Crypto is more than
      just technology—it&apos;s a movement. At Cryptonite, we’re building a
      community of enthusiasts, investors, and innovators who believe in the
      future of decentralized finance. Connect with us, share ideas, and be part
      of the crypto revolution. Stay informed. Stay ahead. Welcome to
      Cryptonite. 🚀
    </div>
  );
}
