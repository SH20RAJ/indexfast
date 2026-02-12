import { notFound } from "next/navigation";
import { getSiteDetails } from "@/app/actions/dashboard";
import SiteSettingsClient from "./settings-client";

export default async function SiteSettingsPage({ params }: { params: Promise<{ domain: string }> }) {
    const { domain: rawDomain } = await params;
    const domain = decodeURIComponent(rawDomain);
    const data = await getSiteDetails(domain);

    if (!data) return notFound();

    return (
        <SiteSettingsClient site={JSON.parse(JSON.stringify(data.site))} />
    );
}
