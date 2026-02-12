import { notFound } from "next/navigation";
import { getSiteDetails } from "@/app/actions/dashboard";
import { getSitemaps } from "@/app/actions/sitemaps";
import SitemapsClient from "./sitemaps-client";

export default async function SitemapsPage({ params }: { params: Promise<{ domain: string }> }) {
    const { domain: rawDomain } = await params;
    const domain = decodeURIComponent(rawDomain);
    const data = await getSiteDetails(domain);

    if (!data) return notFound();

    const sitemapsList = await getSitemaps(data.site.id);

    return (
        <SitemapsClient
            site={{ id: data.site.id, domain: data.site.domain, gscSiteUrl: data.site.gscSiteUrl }}
            initialSitemaps={JSON.parse(JSON.stringify(sitemapsList))}
        />
    );
}
