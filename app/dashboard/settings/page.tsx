import { Metadata } from "next";
import baseMetadata from "@/lib/metadata";
import SettingsClient from "./client";

export const metadata: Metadata = {
  ...baseMetadata,
  title: "Settings",
  description: "Manage your account and billing preferences.",
};

export default function SettingsPage() {
  return <SettingsClient />;
}
