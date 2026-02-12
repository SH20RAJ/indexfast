"use strict";
"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, ChevronDown, ExternalLink } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ResourceItem {
  name: string;
  url: string;
  type?: string;
  category?: string;
  da: number;
  score: number;
  priority: "High" | "Medium" | "Low";
  description?: string;
  [key: string]: any;
}

interface ResourceTableProps {
  data: ResourceItem[];
  typeParams: string[]; // for filtering, e.g., ["Directory", "Guest Post"]
  categoryParams?: string[];
}

export function ResourceTable({ data, typeParams }: ResourceTableProps) {
  const [sorting, setSorting] = React.useState<{
    key: "da" | "score" | "priority" | null;
    direction: "asc" | "desc";
  }>({ key: "score", direction: "desc" });

  const [filterType, setFilterType] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredData = React.useMemo(() => {
    let items = [...data];

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerQuery) ||
          item.description?.toLowerCase().includes(lowerQuery) ||
          item.type?.toLowerCase().includes(lowerQuery) ||
          item.category?.toLowerCase().includes(lowerQuery)
      );
    }

    if (filterType) {
      items = items.filter(
        (item) => item.type === filterType || item.category === filterType
      );
    }

    if (sorting.key) {
      items.sort((a, b) => {
        let valA = a[sorting.key!];
        let valB = b[sorting.key!];

        // Handle priority sorting explicitly
        if (sorting.key === "priority") {
          const priorityMap = { High: 3, Medium: 2, Low: 1 };
          valA = priorityMap[valA as "High" | "Medium" | "Low"];
          valB = priorityMap[valB as "High" | "Medium" | "Low"];
        }

        if (valA < valB) return sorting.direction === "asc" ? -1 : 1;
        if (valA > valB) return sorting.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return items;
  }, [data, searchQuery, filterType, sorting]);

  const toggleSort = (key: "da" | "score" | "priority") => {
    setSorting((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "desc" ? "asc" : "desc",
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-green-500/15 text-green-700 dark:text-green-400 hover:bg-green-500/25";
      case "Medium":
        return "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/25";
      case "Low":
        return "bg-slate-500/15 text-slate-700 dark:text-slate-400 hover:bg-slate-500/25";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Filter <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem
              checked={filterType === null}
              onCheckedChange={() => setFilterType(null)}
            >
              All
            </DropdownMenuCheckboxItem>
            {typeParams.map((type) => (
              <DropdownMenuCheckboxItem
                key={type}
                checked={filterType === type}
                onCheckedChange={() =>
                  setFilterType(filterType === type ? null : type)
                }
              >
                {type}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => toggleSort("da")}
                  className="hover:bg-transparent px-0 font-semibold"
                >
                  DA
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => toggleSort("score")}
                  className="hover:bg-transparent px-0 font-semibold"
                >
                  Score
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => toggleSort("priority")}
                  className="hover:bg-transparent px-0 font-semibold"
                >
                  Priority
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length ? (
              filteredData.map((item) => (
                <TableRow key={item.name}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span className="text-base font-semibold">{item.name}</span>
                      {item.description && (
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {item.description}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.type || item.category}</Badge>
                    {item.pricing && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                            {item.pricing}
                        </Badge>
                    )}
                  </TableCell>
                  <TableCell>{item.da > 0 ? item.da : "N/A"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <span className="font-medium">{item.score}</span>
                        <div className="h-1.5 w-16 bg-secondary rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-primary" 
                                style={{ width: `${item.score}%` }} 
                            />
                        </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("font-medium border-0", getPriorityColor(item.priority))}>
                      {item.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="sm" variant="ghost">
                      <Link href={item.url} target={item.url.startsWith("/") ? "_self" : "_blank"}>
                        Visit <ExternalLink className="ml-2 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
