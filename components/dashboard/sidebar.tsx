"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
    LayoutDashboard, Settings, Globe, Menu, X, CreditCard, ChevronLeft, 
    Link2, Wrench, Send, MapPin, History, Cog, Key, LogOut
} from "lucide-react";
import { useState } from "react";
import { useUser } from "@stackframe/stack";
import { ModeToggle } from "@/components/mode-toggle";
import { DomainSwitcher } from "./domain-switcher";

interface SiteInfo {
    id: string;
    domain: string;
    gscSiteUrl: string;
    isVerified: boolean;
}

// Site-scoped nav items (shown when a domain is selected)
const siteNavItems = [
    { title: "Overview", segment: "overview", icon: LayoutDashboard },
    { title: "Submit URLs", segment: "submit", icon: Send },
    { title: "Sitemaps", segment: "sitemaps", icon: MapPin },
    { title: "History", segment: "history", icon: History },
    { title: "Site Settings", segment: "settings", icon: Cog },
];

// Global nav items (always visible)
const globalNavItems = [
    { title: "All Sites", href: "/dashboard/sites", icon: Globe },
    { title: "Backlinks", href: "/dashboard/resources/backlinks", icon: Link2 },
    { title: "Tools", href: "/dashboard/resources/tools", icon: Wrench },
    { title: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { title: "API Keys", href: "/dashboard/settings/api-keys", icon: Key },
    { title: "Account", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar({ sites }: { sites: SiteInfo[] }) {
    const pathname = usePathname();
    const router = useRouter();
    const user = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Extract current domain from URL
    const domainMatch = pathname.match(/\/dashboard\/sites\/([^/]+)/);
    const currentDomain = domainMatch ? decodeURIComponent(domainMatch[1]) : undefined;

    // Check if we're in a site-scoped context
    const isSiteScoped = !!currentDomain && pathname.includes(`/dashboard/sites/${domainMatch?.[1]}/`);

    const renderNavLink = (item: { title: string; href: string; icon: React.ElementType }, isActive: boolean) => (
        <Link
            key={item.href}
            href={item.href}
            className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all group relative border border-transparent",
                isActive
                    ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)] border-white/10"
                    : "text-muted-foreground/70 hover:text-white hover:bg-white/5",
                isCollapsed && "justify-center px-2"
            )}
            onClick={() => setIsOpen(false)}
        >
            <item.icon className={cn("h-4 w-4 flex-shrink-0 transition-transform group-hover:scale-110", isActive && "text-white")} />
            {!isCollapsed && <span className="tracking-tight">{item.title}</span>}
            {isCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-1.5 bg-zinc-900 text-white text-[10px] font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 whitespace-nowrap border border-white/10 shadow-xl -translate-x-2 group-hover:translate-x-0 tracking-wide">
                    {item.title}
                </div>
            )}
        </Link>
    );

    return (
        <>
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-background border rounded-md shadow-sm"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <div className={cn(
                "fixed inset-y-0 left-0 z-40 transition-all duration-300 ease-in-out lg:static lg:block p-3",
                isOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0",
                isCollapsed ? "lg:w-20" : "lg:w-64"
            )}>
                <div className="flex flex-col h-full glass-dark rounded-2xl shadow-2xl overflow-hidden border-white/5">
                    {/* Header */}
                    <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
                        {!isCollapsed && (
                            <div className="flex flex-col">
                                <span className="text-lg font-bold font-handwritten tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                                    IndexFast
                                </span>
                                <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/50 font-medium">Professional</span>
                            </div>
                        )}
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="p-1.5 hover:bg-white/5 rounded-lg transition-colors ml-auto"
                        >
                            <ChevronLeft className={cn("h-4 w-4 text-muted-foreground transition-transform", isCollapsed && "rotate-180")} />
                        </button>
                    </div>

                    <div className="flex-1 flex flex-col overflow-y-auto py-4">
                        {/* Domain Switcher */}
                        {!isCollapsed && sites.length > 0 && (
                            <div className="px-4 mb-6">
                                <DomainSwitcher sites={sites} currentDomain={currentDomain} />
                            </div>
                        )}

                        {/* Site-Scoped Navigation */}
                        {isSiteScoped && currentDomain && (
                            <div className="px-3 space-y-1 mb-6">
                                {!isCollapsed && (
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/40 px-3 mb-2">
                                        Property
                                    </p>
                                )}
                                {siteNavItems.map((item) => {
                                    const href = `/dashboard/sites/${encodeURIComponent(currentDomain)}/${item.segment}`;
                                    const isActive = pathname.includes(`/${item.segment}`);
                                    return renderNavLink({ ...item, href }, isActive);
                                })}
                            </div>
                        )}

                        {/* Global Navigation */}
                        <div className="px-3 space-y-1">
                            {!isCollapsed && (
                                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/40 px-3 mb-2">
                                    {isSiteScoped ? "General" : "Navigation"}
                                </p>
                            )}
                            {globalNavItems.map((item) => {
                                const isActive = pathname === item.href || 
                                    (item.href !== "/dashboard/sites" && pathname.startsWith(item.href));
                                return renderNavLink(item, isActive);
                            })}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className={cn("p-4 border-t border-white/5 space-y-3 bg-white/[0.02]", isCollapsed && "items-center flex flex-col")}>
                        <div className="flex items-center justify-between w-full">
                            {!isCollapsed && <span className="text-[10px] text-muted-foreground/40 uppercase tracking-widest font-medium">Settings</span>}
                            <ModeToggle />
                        </div>
                        {user && (
                            <button
                                onClick={async () => {
                                    await user.signOut();
                                    router.push("/");
                                }}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all w-full",
                                    "text-muted-foreground hover:bg-destructive/10 hover:text-destructive border border-transparent hover:border-destructive/20",
                                    isCollapsed && "justify-center px-2"
                                )}
                            >
                                <LogOut className="h-4 w-4 flex-shrink-0" />
                                {!isCollapsed && <span>Sign Out</span>}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
