import React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

import { IconCheck, IconDash } from "../../icons";
import { cn } from "../../shared/utils";

function Checkbox({
    className,
    ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
    return (
        <CheckboxPrimitive.Root
            className={cn(
                "peer border-border-soft data-[state=checked]:bg-primary data-[state=checked]:text-foreground data-[state=checked]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-foreground aria-invalid:border-error-border focus-visible:ring-foreground! hover:border-border-hover size-4 shrink-0 rounded-[4px] border shadow-xs transition-all disabled:opacity-50",
                className
            )}
            {...props}
        >
            <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current transition-none">
                {props.checked === "indeterminate" ? (
                    <IconDash />
                ) : (
                    <IconCheck />
                )}
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    );
}

export { Checkbox };
