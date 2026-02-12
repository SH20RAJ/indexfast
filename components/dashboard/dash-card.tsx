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
                "relative rounded-xl transition-all duration-200",
                // Variants
                variant === "default" && [
                    "bg-card/60 backdrop-blur-sm",
                    "border border-border/50",
                ],
                variant === "stat" && [
                    "bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm",
                    "border border-border/30",
                ],
                variant === "ghost" && [
                    "bg-transparent",
                    "border border-dashed border-border/40",
                ],
                variant === "danger" && [
                    "bg-red-500/5 backdrop-blur-sm",
                    "border border-red-500/20",
                ],
                variant === "accent" && [
                    "bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-sm",
                    "border border-primary/20",
                ],
                // Glow effects
                glow === "blue" && "shadow-[0_0_20px_-5px_rgba(59,130,246,0.15)]",
                glow === "emerald" && "shadow-[0_0_20px_-5px_rgba(16,185,129,0.15)]",
                glow === "purple" && "shadow-[0_0_20px_-5px_rgba(168,85,247,0.15)]",
                glow === "amber" && "shadow-[0_0_20px_-5px_rgba(245,158,11,0.15)]",
                glow === "rose" && "shadow-[0_0_20px_-5px_rgba(244,63,94,0.15)]",
                glow === "none" && "shadow-sm",
                // Hover
                hoverable && [
                    "hover:border-primary/30",
                    "hover:shadow-md hover:shadow-primary/5",
                    "hover:-translate-y-0.5",
                    "cursor-pointer",
                ],
                className
            )}
            {...props}
        >
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
 * Pre-styled stat card for dashboard metrics.
 */
export function DashStat({ label, value, icon, trend, glow = "none", accent }: DashStatProps) {
    return (
        <DashCard variant="stat" glow={glow} className="p-5">
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70">
                        {label}
                    </p>
                    <p className={cn("text-3xl font-bold tracking-tight", accent)}>
                        {value}
                    </p>
                    {trend && (
                        <p className={cn(
                            "text-xs font-medium",
                            trend.positive ? "text-emerald-500" : "text-red-500"
                        )}>
                            {trend.positive ? "↑" : "↓"} {trend.value}
                        </p>
                    )}
                </div>
                {icon && (
                    <div className="p-2.5 rounded-lg bg-muted/50">
                        {icon}
                    </div>
                )}
            </div>
        </DashCard>
    );
}
