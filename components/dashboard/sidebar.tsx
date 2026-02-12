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
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors group relative",
                isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                isCollapsed && "justify-center px-2"
            )}
            onClick={() => setIsOpen(false)}
        >
            <item.icon className="h-4.5 w-4.5 flex-shrink-0" />
            {!isCollapsed && <span>{item.title}</span>}
            {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap border shadow-sm">
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
                "fixed inset-y-0 left-0 z-40 bg-card border-r transition-all duration-300 ease-in-out lg:static lg:block",
                isOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0",
                isCollapsed ? "lg:w-16" : "lg:w-60"
            )}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="h-14 flex items-center justify-between px-3 border-b">
                        {!isCollapsed && <span className="text-lg font-bold font-handwritten tracking-tight">IndexFast</span>}
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="hidden lg:flex p-1 hover:bg-muted rounded-md"
                        >
                            <ChevronLeft className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")} />
                        </button>
                    </div>

                    {/* Domain Switcher */}
                    {!isCollapsed && sites.length > 0 && (
                        <div className="px-3 py-3 border-b">
                            <DomainSwitcher sites={sites} currentDomain={currentDomain} />
                        </div>
                    )}

                    {/* Site-Scoped Navigation */}
                    {isSiteScoped && currentDomain && (
                        <div className="px-3 py-3 space-y-0.5">
                            {!isCollapsed && (
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-3 mb-2">
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

                    {/* Divider */}
                    {isSiteScoped && <div className="border-t mx-3" />}

                    {/* Global Navigation */}
                    <div className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
                        {!isCollapsed && (
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-3 mb-2">
                                {isSiteScoped ? "General" : "Navigation"}
                            </p>
                        )}
                        {globalNavItems.map((item) => {
                            const isActive = pathname === item.href || 
                                (item.href !== "/dashboard/sites" && pathname.startsWith(item.href));
                            return renderNavLink(item, isActive);
                        })}
                    </div>

                    {/* Footer */}
                    <div className={cn("p-3 border-t space-y-2", isCollapsed && "items-center flex flex-col")}>
                        <div className="flex items-center justify-between w-full">
                            {!isCollapsed && <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Theme</span>}
                            <ModeToggle />
                        </div>
                        {user && (
                            <button
                                onClick={async () => {
                                    await user.signOut();
                                    router.push("/");
                                }}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors w-full",
                                    "text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
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
