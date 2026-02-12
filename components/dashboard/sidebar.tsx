"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Settings, Globe, BarChart3, Menu, X, CreditCard, ChevronLeft, Link2, Wrench } from "lucide-react";
import { useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";

const sidebarItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Sites",
    href: "/dashboard/sites",
    icon: Globe,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Backlinks",
    href: "/dashboard/backlinks",
    icon: Link2,
  },
  {
    title: "Tools",
    href: "/dashboard/tools",
    icon: Wrench,
  },
  {
    title: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-background border rounded-md shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      <div className={cn(
        "fixed inset-y-0 left-0 z-40 bg-card border-r transition-all duration-300 ease-in-out lg:static lg:block",
        isOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0",
        isCollapsed ? "lg:w-20" : "lg:w-64"
      )}>
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center justify-between px-4 border-b">
            {!isCollapsed && <span className="text-xl font-bold font-handwritten tracking-tight">Placer.ai</span>}
            <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:flex p-1 hover:bg-muted rounded-md"
            >
                <ChevronLeft className={cn("h-5 w-5 transition-transform", isCollapsed && "rotate-180")} />
            </button>
          </div>

          <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors group relative",
                  pathname === item.href 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  isCollapsed && "justify-center px-2"
                )}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.title}</span>}
                {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap border shadow-sm">
                        {item.title}
                    </div>
                )}
              </Link>
            ))}
          </div>

          <div className={cn("p-4 border-t space-y-4", isCollapsed && "items-center flex flex-col")}>
             <div className="flex items-center justify-between w-full">
                {!isCollapsed && <span className="text-xs text-muted-foreground">Theme</span>}
                <ModeToggle />
             </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div 
            className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
