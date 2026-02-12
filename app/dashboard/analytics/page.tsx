import { Metadata } from "next";
import baseMetadata from "@/lib/metadata";

export const metadata: Metadata = {
  ...baseMetadata,
  title: "Analytics",
  description: "View your indexing performance.",
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-handwritten tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">View your indexing performance.</p>
      </div>
      <div className="p-8 border border-dashed rounded-lg text-center text-muted-foreground">
        Coming Soon
      </div>
    </div>
  );
}
