"use strict";

import { seoMarketingTools } from "@/lib/data/tools";
import { ResourceTable } from "@/components/dashboard/resource-table";
import { Metadata } from "next";
import baseMetadata from "@/lib/metadata";

export const metadata: Metadata = {
  ...baseMetadata,
  title: "Tools",
  description: "Essential third-party and internal tools for SEO, marketing, and analytics.",
};

export default function ToolsPage() {
  const categories = Array.from(new Set(seoMarketingTools.map((t) => t.category)));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Tools & Resources</h2>
        <p className="text-muted-foreground">
          Essential third-party and internal tools for SEO, marketing, and analytics.
        </p>
      </div>
      <ResourceTable data={seoMarketingTools} typeParams={categories} />
    </div>
  );
}
