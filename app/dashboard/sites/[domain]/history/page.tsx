import { notFound } from "next/navigation";
import { getSiteDetails } from "@/app/actions/dashboard";
import HistoryClient from "./history-client";

export default async function HistoryPage({ params }: { params: Promise<{ domain: string }> }) {
    const { domain: rawDomain } = await params;
    const domain = decodeURIComponent(rawDomain);
    const data = await getSiteDetails(domain);

    if (!data) return notFound();

    return (
        <HistoryClient 
            site={{ id: data.site.id, domain: data.site.domain }} 
            submissions={JSON.parse(JSON.stringify(data.submissions))} 
        />
    );
}
