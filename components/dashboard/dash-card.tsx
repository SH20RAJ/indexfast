import { cn } from "@/lib/utils";

interface DashCardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "stat" | "ghost" | "danger" | "accent";
    glow?: "blue" | "emerald" | "purple" | "amber" | "rose" | "none";
    hoverable?: boolean;
}

/**
 * Dashboard card component with modern glassmorphic styling.
 * Replaces CreativeCard for all dashboard pages.
 */
export function DashCard({ 
    className, 
    variant = "default", 
    glow = "none",
    hoverable = false,
    children, 
    ...props 
}: DashCardProps) {
    return (
        <div
            className={cn(
                // Base
                "relative rounded-2xl transition-all duration-300 overflow-hidden",
                // Variants
                variant === "default" && [
                    "bg-zinc-900/40 backdrop-blur-xl",
                    "border border-white/5",
                ],
                variant === "stat" && [
                    "bg-zinc-900/60 backdrop-blur-2xl",
                    "border border-white/10 shadow-2xl",
                ],
                variant === "ghost" && [
                    "bg-transparent",
                    "border border-dashed border-white/10",
                ],
                variant === "danger" && [
                    "bg-red-500/5 backdrop-blur-xl",
                    "border border-red-500/10",
                ],
                variant === "accent" && [
                    "bg-gradient-to-br from-brand/5 to-brand/10 backdrop-blur-xl",
                    "border border-brand/20",
                ],
                // Glow effects
                glow === "blue" && "shadow-[0_0_30px_-10px_rgba(59,130,246,0.1)]",
                glow === "emerald" && "shadow-[0_0_30px_-10px_rgba(16,185,129,0.1)]",
                glow === "purple" && "shadow-[0_0_30px_-10px_rgba(168,85,247,0.1)]",
                glow === "amber" && "shadow-[0_0_30px_-10px_rgba(245,158,11,0.1)]",
                glow === "rose" && "shadow-[0_0_30px_-10px_rgba(244,63,94,0.1)]",
                // Hover
                hoverable && [
                    "hover:border-white/20",
                    "hover:shadow-xl hover:shadow-brand/5",
                    "hover:-translate-y-1",
                    "cursor-pointer",
                ],
                className
            )}
            {...props}
        >
            {/* Top highlight */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            {children}
        </div>
    );
}

interface DashStatProps {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
    trend?: { value: string; positive: boolean };
    glow?: DashCardProps["glow"];
    accent?: string; // tailwind color class like "text-blue-500"
}

/**
 * Pre-styled stat card with premium typography.
 */
export function DashStat({ label, value, icon, trend, glow = "none", accent }: DashStatProps) {
    return (
        <DashCard variant="stat" glow={glow} className="p-6">
            <div className="flex items-start justify-between">
                <div className="space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
                        {label}
                    </p>
                    <div className="flex flex-col">
                        <p className={cn("text-4xl font-bold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent", accent)}>
                            {value}
                        </p>
                        {trend && (
                            <p className={cn(
                                "text-[11px] font-semibold mt-1 flex items-center gap-1",
                                trend.positive ? "text-emerald-500/80" : "text-red-500/80"
                            )}>
                                <span className="text-[14px]">{trend.positive ? "↑" : "↓"}</span>
                                {trend.value}
                                <span className="text-muted-foreground/30 font-normal ml-0.5">vs last period</span>
                            </p>
                        )}
                    </div>
                </div>
                {icon && (
                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 shadow-inner">
                        <div className="text-muted-foreground/60">{icon}</div>
                    </div>
                )}
            </div>
        </DashCard>
    );
}
