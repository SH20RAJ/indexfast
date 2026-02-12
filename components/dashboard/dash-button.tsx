import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface DashButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    size?: "sm" | "default" | "lg";
    loading?: boolean;
    icon?: React.ReactNode;
}

/**
 * Dashboard button component — clean and modern, no brutalist shadows.
 */
export function DashButton({ 
    className, 
    variant = "primary", 
    size = "default",
    loading = false,
    icon,
    children,
    disabled,
    ...props 
}: DashButtonProps) {
    const variants = {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/20",
        secondary: "bg-muted text-foreground hover:bg-muted/80",
        outline: "border border-border bg-transparent hover:bg-muted/50 text-foreground",
        ghost: "bg-transparent hover:bg-muted/50 text-muted-foreground hover:text-foreground",
        danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20",
    };

    const sizes = {
        sm: "h-8 px-3 text-xs",
        default: "h-9 px-4 text-sm",
        lg: "h-10 px-6 text-sm",
    };

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center gap-2",
                "rounded-lg font-medium",
                "transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                "disabled:opacity-50 disabled:pointer-events-none",
                variants[variant],
                sizes[size],
                className,
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
            {children}
        </button>
    );
}
