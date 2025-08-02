import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../shared/utils";

const alertVariants = cva(
    "bg-surface-3 relative w-full rounded-md border-border-subtle border-1 px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
    {
        variants: {
            variant: {
                default: "text-text-primary",
                destructive:
                    "text-text-destructive [&>svg]:text-current *:data-[slot=alert-description]:text-text-destructive/90",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

type AlertVariant = "default" | "destructive";

function Alert({
    className,
    variant,
    ...props
}: React.ComponentProps<"div"> & { variant?: AlertVariant }) {
    return (
        <div
            role="alert"
            className={cn(alertVariants({ variant }), className)}
            {...props}
        />
    );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            className={cn(
                "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight text-current",
                className
            )}
            {...props}
        />
    );
}

function AlertDescription({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            className={cn(
                "text-text-muted col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
                className
            )}
            {...props}
        />
    );
}

export { Alert, AlertTitle, AlertDescription };
