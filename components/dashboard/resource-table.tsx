"use client";

import * as React from "react";
import {
  ColumnDef, ColumnFiltersState, SortingState, VisibilityState,
  flexRender, getCoreRowModel, getFilteredRowModel,
  getPaginationRowModel, getSortedRowModel, useReactTable,
} from "@tanstack/react-table";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DashCard } from "@/components/dashboard/dash-card";
import {
  ArrowUpDown, ArrowUp, ArrowDown, ExternalLink, Search, SlidersHorizontal,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
} from "lucide-react";
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
  pricing?: string;
}

interface ResourceTableProps {
  data: ResourceItem[];
  typeParams: string[];
  categoryParams?: string[];
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "High": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "Medium": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "Low": return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    default: return "bg-zinc-500/10 text-zinc-400";
  }
}

function getPricingColor(pricing: string) {
  switch (pricing) {
    case "Free": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "Freemium": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "Paid": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    default: return "bg-zinc-500/10 text-zinc-400";
  }
}

const columns: ColumnDef<ResourceItem>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <button className="flex items-center gap-1.5 hover:text-foreground transition-colors"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Name
        {column.getIsSorted() === "asc" ? <ArrowUp className="w-3 h-3" /> :
         column.getIsSorted() === "desc" ? <ArrowDown className="w-3 h-3" /> :
         <ArrowUpDown className="w-3 h-3 opacity-30" />}
      </button>
    ),
    cell: ({ row }) => {
      const item = row.original;
      const isExternal = item.url.startsWith("http");
      return (
        <div className="flex items-center gap-3 min-w-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              {isExternal ? (
                <a href={item.url} target="_blank" rel="noopener noreferrer"
                  className="text-sm font-medium hover:text-primary transition-colors truncate flex items-center gap-1.5">
                  {item.name}
                  <ExternalLink className="w-3 h-3 opacity-40" />
                </a>
              ) : (
                <Link href={item.url} className="text-sm font-medium hover:text-primary transition-colors truncate">
                  {item.name}
                </Link>
              )}
            </div>
            {item.description && (
              <p className="text-[11px] text-muted-foreground/50 truncate max-w-xs mt-0.5">{item.description}</p>
            )}
          </div>
        </div>
      );
    },
  },
  {
    id: "typeOrCategory",
    accessorFn: (row) => row.type || row.category || "",
    header: ({ column }) => (
      <button className="flex items-center gap-1.5 hover:text-foreground transition-colors"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Type
        {column.getIsSorted() === "asc" ? <ArrowUp className="w-3 h-3" /> :
         column.getIsSorted() === "desc" ? <ArrowDown className="w-3 h-3" /> :
         <ArrowUpDown className="w-3 h-3 opacity-30" />}
      </button>
    ),
    cell: ({ row }) => {
      const val = row.original.type || row.original.category || "";
      return <Badge variant="outline" className="text-[10px] font-medium">{val}</Badge>;
    },
  },
  {
    accessorKey: "da",
    header: ({ column }) => (
      <button className="flex items-center gap-1.5 hover:text-foreground transition-colors"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        DA
        {column.getIsSorted() === "asc" ? <ArrowUp className="w-3 h-3" /> :
         column.getIsSorted() === "desc" ? <ArrowDown className="w-3 h-3" /> :
         <ArrowUpDown className="w-3 h-3 opacity-30" />}
      </button>
    ),
    cell: ({ row }) => {
      const da = row.getValue("da") as number;
      return (
        <div className="flex items-center gap-1.5">
          <div className={cn("w-2 h-2 rounded-full",
            da >= 90 ? "bg-emerald-400" : da >= 70 ? "bg-amber-400" : "bg-zinc-400"
          )} />
          <span className="text-sm font-mono">{da}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "score",
    header: ({ column }) => (
      <button className="flex items-center gap-1.5 hover:text-foreground transition-colors"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Score
        {column.getIsSorted() === "asc" ? <ArrowUp className="w-3 h-3" /> :
         column.getIsSorted() === "desc" ? <ArrowDown className="w-3 h-3" /> :
         <ArrowUpDown className="w-3 h-3 opacity-30" />}
      </button>
    ),
    cell: ({ row }) => {
      const score = row.getValue("score") as number;
      return (
        <div className="w-full max-w-[80px]">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-mono">{score}</span>
          </div>
          <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
            <div className={cn("h-full rounded-full transition-all",
              score >= 90 ? "bg-emerald-400" : score >= 75 ? "bg-amber-400" : "bg-zinc-400"
            )} style={{ width: `${score}%` }} />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <button className="flex items-center gap-1.5 hover:text-foreground transition-colors"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Priority
        {column.getIsSorted() === "asc" ? <ArrowUp className="w-3 h-3" /> :
         column.getIsSorted() === "desc" ? <ArrowDown className="w-3 h-3" /> :
         <ArrowUpDown className="w-3 h-3 opacity-30" />}
      </button>
    ),
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      return (
        <Badge variant="outline" className={cn("text-[10px] font-semibold", getPriorityColor(priority))}>
          {priority}
        </Badge>
      );
    },
  },
  {
    accessorKey: "pricing",
    header: "Pricing",
    cell: ({ row }) => {
      const pricing = row.original.pricing;
      if (!pricing) return null;
      return (
        <Badge variant="outline" className={cn("text-[10px] font-medium", getPricingColor(pricing))}>
          {pricing}
        </Badge>
      );
    },
  },
];

export function ResourceTable({ data, typeParams }: ResourceTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "score", desc: true }]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [activeType, setActiveType] = React.useState<string>("all");

  // Filter by pricing
  const hasPricing = data.some(d => "pricing" in d);
  const columnsToUse = hasPricing ? columns : columns.filter(c => !("accessorKey" in c && c.accessorKey === "pricing"));

  const filteredData = React.useMemo(() => {
    if (activeType === "all") return data;
    return data.filter(d => (d.type || d.category) === activeType);
  }, [data, activeType]);

  const table = useReactTable({
    data: filteredData,
    columns: columnsToUse,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, columnFilters, columnVisibility },
    initialState: { pagination: { pageSize: 25 } },
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
          <input
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={e => table.getColumn("name")?.setFilterValue(e.target.value)}
            placeholder="Search tools & resources..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-muted/20 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-0.5 p-0.5 bg-muted/30 rounded-lg border border-border/30 overflow-x-auto">
            <button onClick={() => setActiveType("all")}
              className={cn("px-2.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap",
                activeType === "all" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground/60 hover:text-foreground"
              )}>All ({data.length})</button>
            {typeParams.map(type => {
              const count = data.filter(d => (d.type || d.category) === type).length;
              return (
                <button key={type} onClick={() => setActiveType(type)}
                  className={cn("px-2.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap",
                    activeType === type ? "bg-card text-foreground shadow-sm" : "text-muted-foreground/60 hover:text-foreground"
                  )}>{type} ({count})</button>
              );
            })}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 hover:bg-muted/30 rounded-lg border border-border/30 transition-colors">
                <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {table.getAllColumns().filter(col => col.getCanHide()).map(col => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  className="capitalize text-xs"
                  checked={col.getIsVisible()}
                  onCheckedChange={value => col.toggleVisibility(!!value)}
                >
                  {col.id === "typeOrCategory" ? "Type" : col.id}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <DashCard className="overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className="border-border/30 hover:bg-transparent">
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className="text-[10px] uppercase tracking-[0.15em] font-semibold text-muted-foreground/50 h-10 px-4">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} className="border-border/20 hover:bg-muted/10">
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columnsToUse.length} className="h-32 text-center text-muted-foreground/40">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DashCard>

      {/* Pagination */}
      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-muted-foreground/40">
            {table.getFilteredRowModel().rows.length} result{table.getFilteredRowModel().rows.length !== 1 ? "s" : ""}
            {" • "}Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </p>
          <div className="flex items-center gap-1">
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
              className="h-8 px-2 text-xs bg-muted/20 border border-border/30 rounded-md focus:outline-none"
            >
              {[10, 25, 50, 100].map(size => (
                <option key={size} value={size}>{size} / page</option>
              ))}
            </select>
            <div className="flex items-center gap-0.5 ml-2">
              <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}
                className="p-1.5 rounded-md hover:bg-muted/30 disabled:opacity-20 disabled:pointer-events-none transition-colors">
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}
                className="p-1.5 rounded-md hover:bg-muted/30 disabled:opacity-20 disabled:pointer-events-none transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}
                className="p-1.5 rounded-md hover:bg-muted/30 disabled:opacity-20 disabled:pointer-events-none transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
              <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}
                className="p-1.5 rounded-md hover:bg-muted/30 disabled:opacity-20 disabled:pointer-events-none transition-colors">
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
