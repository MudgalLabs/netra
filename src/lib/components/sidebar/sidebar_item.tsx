import { ReactNode } from "react";

import { useIsMobile } from "../../hooks/use_is_mobile";
import { cn } from "../../shared/utils";
import { Tooltip } from "../tooltip/tooltip";

interface SidebarItemProps {
    label: ReactNode;
    icon: ReactNode;
    open: boolean;
    isActive: boolean;
    onClick?: () => void;
    isMobile?: boolean;
}

export function SidebarItem(props: SidebarItemProps) {
    const { label, icon, open, isActive, onClick } = props;
    const isMobile = useIsMobile();

    const content = (
        <div
            className={cn(
                "peer text-text-muted [&_svg]:text-text-muted hover:[&_svg]:text-text-primary w-full rounded-sm bg-transparent p-2 text-sm! transition-colors",
                {
                    "bg-secondary-hover text-text-primary": isActive,
                    "hover:bg-secondary-hover hover:text-text-primary":
                        !isActive,
                    "flex items-center gap-2 text-base": open && !isMobile,
                    "mx-auto flex h-9 w-9 items-center justify-center":
                        !open || isMobile,
                }
            )}
            onClick={onClick}
        >
            {icon}
            {open && !isMobile && label}
        </div>
    );

    return (
        <Tooltip
            content={label}
            delayDuration={0}
            contentProps={{ side: "right" }}
            disabled={open}
        >
            {content}
        </Tooltip>
    );
}
