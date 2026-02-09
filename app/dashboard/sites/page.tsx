import SitesManager from "@/components/sites-manager";
import { getDashboardData } from "@/app/actions/dashboard";

export default async function SitesPage() {
  const data = await getDashboardData();
  const sites = data?.sites || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-handwritten tracking-tight">Sites</h1>
        <p className="text-muted-foreground">Manage your connected properties.</p>
      </div>
      <SitesManager initialSites={sites} />
    </div>
  );
}
