import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "../../shared/utils";

function Switch({
    className,
    ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
    return (
        <SwitchPrimitive.Root
            data-slot="switch"
            className={cn(
                "peer data-[state=checked]:bg-primary data-[state=checked]:enabled:hover:bg-primary-hover data-[state=unchecked]:bg-secondary data-[state=unchecked]:enabled:hover:bg-secondary-hover  border-transparent focus-visible:border-accent focus-visible:ring-accent/50 dark:data-[state=unchecked]:bg-secondary/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        >
            <SwitchPrimitive.Thumb
                data-slot="switch-thumb"
                className={cn(
                    "bg-background dark:data-[state=unchecked]:bg-secondary-foreground dark:data-[state=checked]:bg-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
                )}
            />
        </SwitchPrimitive.Root>
    );
}

export { Switch };
