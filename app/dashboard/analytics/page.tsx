import { Metadata } from "next";
import { BarChart3 } from "lucide-react";
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
      <div className="p-12 border border-dashed border-border/50 rounded-lg flex flex-col items-center justify-center text-center space-y-4 bg-muted/10">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-primary" />
        </div>
        <div>
            <h3 className="font-medium text-lg">Analytics Coming Soon</h3>
            <p className="text-sm text-muted-foreground max-w-sm mt-1">
                We are building detailed reporting so you can track your indexed pages and search engine visibility over time.
            </p>
        </div>
      </div>
    </div>
  );
}
