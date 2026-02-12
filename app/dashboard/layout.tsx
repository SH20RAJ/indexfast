import { Sidebar } from "@/components/dashboard/sidebar";
import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await stackServerApp.getUser();
  
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 lg:p-8 pt-16 lg:pt-8 bg-background">
        {children}
      </main>
    </div>
  );
}
