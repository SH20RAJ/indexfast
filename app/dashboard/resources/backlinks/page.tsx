import { backlinkSources } from "@/lib/data/backlinks";
import { ResourceTable } from "@/components/dashboard/resource-table";
import { Metadata } from "next";
import baseMetadata from "@/lib/metadata";

export const metadata: Metadata = {
  ...baseMetadata,
  title: "Backlinks",
  description: "Curated list of high-authority directories, guest posting sites, and communities to boost your SEO.",
};

export default function BacklinksPage() {
  const types = Array.from(new Set(backlinkSources.map((s) => s.type)));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Backlink Opportunities</h2>
        <p className="text-muted-foreground">
          Curated list of high-authority directories, guest posting sites, and communities to boost your SEO.
        </p>
      </div>
      <ResourceTable data={backlinkSources} typeParams={types} />
    </div>
  );
}
