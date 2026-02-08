
import { cn } from '@/lib/utils'

interface CreativeCardProps extends React.HTMLAttributes<HTMLDivElement> {
    rotate?: 'left' | 'right' | 'none'
}

export function CreativeCard({ className, rotate = 'none', children, ...props }: CreativeCardProps) {
    return (
        <div
            className={cn(
                "relative group transition-all duration-300",
                rotate === 'left' && "-rotate-1 hover:rotate-0",
                rotate === 'right' && "rotate-1 hover:rotate-0",
                className
            )}
            {...props}
        >
            <div
                className={cn(
                    "absolute inset-0 bg-white dark:bg-zinc-900",
                    "border-2 border-zinc-900 dark:border-white",
                    "rounded-lg shadow-[4px_4px_0px_0px] shadow-zinc-900 dark:shadow-white",
                    "transition-all duration-300",
                )}
            />
            <div className="relative p-6 border-2 border-transparent">
                {children}
            </div>
        </div>
    )
}
