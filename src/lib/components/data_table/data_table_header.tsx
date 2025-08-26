import { ReactNode } from "react";
import { Column } from "@tanstack/react-table";

import { Button } from "../index";
import { cn } from "../../shared/utils";
import { IconArrowDown } from "../../icons";

interface DataTableColumnHeaderProps<TData, TValue> {
    title: ReactNode;
    column?: Column<TData, TValue>;
    className?: string;
    disabled?: boolean;
}

export function DataTableColumnHeader<TData, TValue>({
    column,
    title,
    className,
    disabled = false,
}: DataTableColumnHeaderProps<TData, TValue>) {
    if (!column || !column.getCanSort()) {
        return (
            <div className={cn("px-4 py-2 text-text-muted", className)}>
                {title}
            </div>
        );
    }

    return (
        <div className={cn("flex items-center space-x-2", className)}>
            <Button
                variant="ghost"
                className={cn("mx-1 h-8 w-full justify-start", {
                    "text-foreground font-medium": column.getIsSorted(),
                })}
                onClick={() => column.toggleSorting()}
                disabled={disabled}
            >
                <span>{title}</span>
                {
                    <div
                        className={cn({
                            "opacity-0": !column.getIsSorted(),
                            "opacity-100": column.getIsSorted(),
                            "-rotate-180 transition-transform":
                                column.getIsSorted() === "asc",
                            "rotate-0 transition-transform":
                                column.getIsSorted() === "desc",
                        })}
                    >
                        <IconArrowDown size={14} />
                    </div>
                }
            </Button>
        </div>
    );
}
