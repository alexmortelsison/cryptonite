import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect("/");
  }
  return <div className="max-w-5xl mx-auto">DashboardPage</div>;
}
