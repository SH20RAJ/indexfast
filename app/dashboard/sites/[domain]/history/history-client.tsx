"use client";

import { useState, useMemo } from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { DashCard, DashStat } from "@/components/dashboard/dash-card";
import { DashButton } from "@/components/dashboard/dash-button";
import {
    Download, Search, CheckCircle, XCircle, Zap, AlertTriangle, Trash2,
    ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown,
    SlidersHorizontal, ArrowDown, ArrowUp,
} from "lucide-react";
import {
    DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow, format } from "date-fns";
import { clearSiteHistory } from "@/app/actions/dashboard";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Submission {
    id: string;
    url: string;
    status: number;
    submittedAt: string;
}

const columns: ColumnDef<Submission>[] = [
    {
        accessorKey: "url",
        header: ({ column }) => (
            <button className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                URL
                {column.getIsSorted() === "asc" ? <ArrowUp className="w-3 h-3" /> :
                 column.getIsSorted() === "desc" ? <ArrowDown className="w-3 h-3" /> :
                 <ArrowUpDown className="w-3 h-3 opacity-30" />}
            </button>
        ),
        cell: ({ row }) => {
            const status = row.original.status;
            const isSuccess = status >= 200 && status < 300;
            return (
                <div className="flex items-center gap-2.5 max-w-md">
                    {isSuccess
                        ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        : <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                    <span className="font-mono text-xs truncate text-foreground/70">{row.getValue("url")}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <button className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Status
                {column.getIsSorted() === "asc" ? <ArrowUp className="w-3 h-3" /> :
                 column.getIsSorted() === "desc" ? <ArrowDown className="w-3 h-3" /> :
                 <ArrowUpDown className="w-3 h-3 opacity-30" />}
            </button>
        ),
        cell: ({ row }) => {
            const status = row.getValue("status") as number;
            const isSuccess = status >= 200 && status < 300;
            return (
                <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${
                    isSuccess ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                }`}>
                    {status}
                </span>
            );
        },
    },
    {
        accessorKey: "submittedAt",
        header: ({ column }) => (
            <button className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Submitted
                {column.getIsSorted() === "asc" ? <ArrowUp className="w-3 h-3" /> :
                 column.getIsSorted() === "desc" ? <ArrowDown className="w-3 h-3" /> :
                 <ArrowUpDown className="w-3 h-3 opacity-30" />}
            </button>
        ),
        cell: ({ row }) => {
            const date = new Date(row.getValue("submittedAt"));
            return (
                <div className="text-right">
                    <p className="text-xs text-muted-foreground/60">
                        {formatDistanceToNow(date, { addSuffix: true })}
                    </p>
                    <p className="text-[10px] text-muted-foreground/30">
                        {format(date, "MMM d, yyyy HH:mm")}
                    </p>
                </div>
            );
        },
    },
];

export default function HistoryClient({ site, submissions }: { site: { id: string; domain: string }; submissions: Submission[] }) {
    const router = useRouter();
    const [sorting, setSorting] = useState<SortingState>([{ id: "submittedAt", desc: true }]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [statusFilter, setStatusFilter] = useState<"all" | "success" | "failed">("all");
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [clearing, setClearing] = useState(false);

    const filteredData = useMemo(() => {
        if (statusFilter === "all") return submissions;
        if (statusFilter === "success") return submissions.filter(s => s.status >= 200 && s.status < 300);
        return submissions.filter(s => s.status < 200 || s.status >= 300);
    }, [submissions, statusFilter]);

    const successCount = submissions.filter(s => s.status >= 200 && s.status < 300).length;
    const failedCount = submissions.length - successCount;

    const table = useReactTable({
        data: filteredData,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: { sorting, columnFilters, columnVisibility },
        initialState: { pagination: { pageSize: 20 } },
    });

    const exportCSV = () => {
        const rows = ["URL,Status,Submitted At", ...filteredData.map(s =>
            `"${s.url}",${s.status},"${new Date(s.submittedAt).toISOString()}"`)].join("\n");
        const blob = new Blob([rows], { type: "text/csv" });
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
        a.download = `${site.domain}-submissions.csv`; a.click();
    };

    const handleClearHistory = async () => {
        setClearing(true);
        try {
            const result = await clearSiteHistory(site.id);
            if (result.success) {
                toast.success("History cleared");
                router.refresh();
            } else {
                toast.error("Failed to clear history", { description: result.error });
            }
        } catch (e: unknown) {
            toast.error("Failed", { description: (e as Error).message });
        }
        setClearing(false);
        setShowClearConfirm(false);
    };

    return (
        <div className="space-y-6 max-w-5xl animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">History</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Submission log for <span className="font-medium text-foreground">{site.domain}</span>
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {!showClearConfirm ? (
                        <DashButton variant="danger" size="sm" onClick={() => setShowClearConfirm(true)} disabled={submissions.length === 0}
                            icon={<Trash2 className="w-3.5 h-3.5" />}>
                            Clear
                        </DashButton>
                    ) : (
                        <>
                            <DashButton variant="ghost" size="sm" onClick={() => setShowClearConfirm(false)}>Cancel</DashButton>
                            <DashButton variant="danger" size="sm" onClick={handleClearHistory} loading={clearing}>Confirm Clear All</DashButton>
                        </>
                    )}
                    <DashButton variant="outline" size="sm" onClick={exportCSV} disabled={filteredData.length === 0}
                        icon={<Download className="w-3.5 h-3.5" />}>
                        CSV
                    </DashButton>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
                <DashStat label="Total" value={submissions.length} icon={<Zap className="w-4 h-4 text-blue-400" />} glow="blue" accent="text-blue-400" />
                <DashStat label="Success" value={successCount} icon={<CheckCircle className="w-4 h-4 text-emerald-400" />} glow="emerald" accent="text-emerald-400" />
                <DashStat label="Failed" value={failedCount} icon={<AlertTriangle className="w-4 h-4 text-red-400" />} glow="rose" accent="text-red-400" />
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="relative flex-1 w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                    <input
                        value={(table.getColumn("url")?.getFilterValue() as string) ?? ""}
                        onChange={e => table.getColumn("url")?.setFilterValue(e.target.value)}
                        placeholder="Filter by URL..."
                        className="w-full pl-9 pr-3 py-2 text-sm bg-muted/20 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5 p-0.5 bg-muted/30 rounded-lg border border-border/30">
                        {(["all", "success", "failed"] as const).map(f => (
                            <button key={f} onClick={() => setStatusFilter(f)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all capitalize ${
                                    statusFilter === f ? "bg-card text-foreground shadow-sm" : "text-muted-foreground/60 hover:text-foreground"
                                }`}>{f}</button>
                        ))}
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
                                    {col.id === "submittedAt" ? "Submitted" : col.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Data Table */}
            <DashCard className="overflow-hidden">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id} className="border-border/30 hover:bg-transparent">
                                {headerGroup.headers.map(header => (
                                    <TableHead key={header.id} className="text-[10px] uppercase tracking-[0.15em] font-semibold text-muted-foreground/50 h-10 px-5">
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
                                        <TableCell key={cell.id} className="px-5 py-3.5">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground/40">
                                    {submissions.length === 0 ? "No submissions yet." : "No results match your filters."}
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
                            {[10, 20, 50, 100].map(size => (
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
