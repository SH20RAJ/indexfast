import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CreativeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function CreativeButton({ className, variant = 'primary', size = 'default', ...props }: CreativeButtonProps) {
    const variants = {
        primary: "bg-brand text-brand-foreground hover:bg-brand/90 shadow-lg shadow-brand/20",
        secondary: "bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-50 shadow-sm",
        outline: "border-2 border-brand text-brand hover:bg-brand/10",
        ghost: "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
    }

    // Border color logic: outline uses border-zinc-900/white, others rely on background but we want a border for the "drawing" look
    const borderClass = variant === 'outline' ? '' : 'border-2 border-zinc-900 dark:border-white'

    return (
        <Button
            className={cn(
                "font-handwritten text-lg relative",
                // Size adjustments for shadow/border if needed, but for now relying on Button sizing
                "transition-all duration-300",
                "shadow-[4px_4px_0px_0px]",
                "hover:shadow-[6px_6px_0px_0px]",
                "hover:-translate-y-[2px] hover:-translate-x-[2px]",
                "active:shadow-[2px_2px_0px_0px] active:translate-y-[2px] active:translate-x-[2px]",
                borderClass,
                variants[variant],
                className
            )}
            size={size}
            {...props}
        />
    )
}
