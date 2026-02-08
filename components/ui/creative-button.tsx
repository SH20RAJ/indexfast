import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CreativeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'accent' | 'outline'
    size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function CreativeButton({ className, variant = 'primary', size = 'default', ...props }: CreativeButtonProps) {
    const variants = {
        primary: "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 shadow-blue-900 dark:shadow-blue-300",
        secondary: "bg-zinc-900 text-white hover:bg-zinc-800 active:bg-zinc-900 shadow-zinc-500 dark:shadow-zinc-700",
        accent: "bg-amber-400 text-zinc-900 hover:bg-amber-300 active:bg-amber-400 shadow-amber-700 dark:shadow-amber-200",
        outline: "bg-white text-zinc-900 border-2 border-zinc-900 hover:bg-zinc-50 shadow-zinc-900 dark:shadow-white dark:bg-zinc-900 dark:text-white dark:border-white"
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
