import { listApiKeys } from "@/app/actions/api-keys";
import { getDashboardData } from "@/app/actions/dashboard";
import ApiKeysClient from "./api-keys-client";

export default async function ApiKeysPage() {
    const keys = await listApiKeys();
    const dashboardData = await getDashboardData();
    const sites = dashboardData?.sites || [];
    
    return <ApiKeysClient 
        initialKeys={JSON.parse(JSON.stringify(keys))} 
        sites={JSON.parse(JSON.stringify(sites))}
    />;
}
