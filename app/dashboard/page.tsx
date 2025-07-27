// app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "./LogoutButton";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">
        Welcome, {session.user?.name} dengan email {session.user?.email}
      </h1>
      <LogoutButton />
    </div>
  );
}
