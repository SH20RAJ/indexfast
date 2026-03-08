"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { 
  Plus,
  Settings, 
  Search, 
  Globe,
  Wrench 
} from "lucide-react";

export function CommandMenu({ sites = [] }: { sites?: { id: string; domain: string }[] }) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search sites..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard"))}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Add New Site</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/settings"))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Account Settings</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/tools"))}>
            <Wrench className="mr-2 h-4 w-4" />
            <span>SEO Tools</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/backlinks"))}>
            <Search className="mr-2 h-4 w-4" />
            <span>Backlink Opportunities</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Recent Sites">
          {sites.map((site) => (
            <CommandItem
              key={site.id}
              onSelect={() => runCommand(() => router.push(`/dashboard/sites/${site.domain}`))}
            >
              <Globe className="mr-2 h-4 w-4" />
              <span>{site.domain}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
