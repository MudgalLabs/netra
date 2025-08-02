import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../shared/utils";

const toggleVariants = cva(
    "inline-flex items-center justify-center gap-2 rounded-sm text-base font-medium disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 transition-[color,box-shadow] border-1 border-transparent data-[state=off]:enabled:hover:bg-accent-muted py-2.5 px-2.5",
    {
        variants: {
            variant: {
                default:
                    "text-text-muted data-[state=on]:bg-secondary border-border-subtle data-[state=on]:text-text-primary enabled:hover:text-text-primary data-[state=off]:hover:bg-secondary!",
                outline:
                    "data-[state=off]:border border-border bg-transparent text-foreground-muted shadow-xs data-[state=off]:enabled:hover:bg-accent-muted data-[state=off]:enabled:hover:text-muted-foreground",
                success:
                    "data-[state=on]:bg-btn-bg-secondary data-[state=on]:text-btn-text-secondary data-[state=on]:border-btn-border-secondary",
                destructive:
                    "data-[state=on]:bg-red-bg data-[state=on]:text-foreground",
            },
            size: {
                default: "",
                small: "text-sm",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

type ToggleVariant = "default" | "outline" | "success" | "destructive";
type ToggleSize = "default" | "small";

interface ToggleProps extends TogglePrimitive.ToggleProps {
    variant?: ToggleVariant;
    size?: ToggleSize;
}

function Toggle({
    className,
    variant = "default",
    size = "default",
    ...props
}: ToggleProps) {
    return (
        <TogglePrimitive.Root
            data-slot="toggle"
            className={cn(toggleVariants({ variant, size, className }))}
            {...props}
        />
    );
}

export { Toggle, toggleVariants };
export type { ToggleProps };
