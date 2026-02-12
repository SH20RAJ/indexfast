import { notFound } from "next/navigation";
import { getSiteDetails } from "@/app/actions/dashboard";
import SubmitClient from "./submit-client";

export default async function SubmitPage({ params }: { params: Promise<{ domain: string }> }) {
    const { domain: rawDomain } = await params;
    const domain = decodeURIComponent(rawDomain);
    const data = await getSiteDetails(domain);

    if (!data) return notFound();

    return (
        <SubmitClient site={{ id: data.site.id, domain: data.site.domain, gscSiteUrl: data.site.gscSiteUrl }} />
    );
}
