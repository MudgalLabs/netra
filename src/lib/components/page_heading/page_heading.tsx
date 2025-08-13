import { FC, memo } from "react";
import { Loading, Button, Separator, Tooltip } from "../../components";
import { IconPanelLeftClose, IconPanelLeftOpen } from "../../icons";

interface PageHeadingProps {
    heading: string;
    loading?: boolean;
    isOpen?: boolean;
    toggleSidebar?: () => void;
}

const PageHeading: FC<PageHeadingProps> = memo(
    ({ heading, loading, isOpen, toggleSidebar }) => {
        return (
            <div>
                <div className="flex items-center gap-x-2">
                    {toggleSidebar && (
                        <Tooltip
                            content={
                                isOpen ? "Collapse Sidebar" : "Expand Sidebar"
                            }
                            delayDuration={500}
                            contentProps={{ side: "right" }}
                        >
                            <Button
                                className="text-text-subtle"
                                variant="ghost"
                                size="icon"
                                type="button"
                                onClick={toggleSidebar}
                            >
                                {isOpen ? (
                                    <IconPanelLeftClose size={18} />
                                ) : (
                                    <IconPanelLeftOpen size={18} />
                                )}
                            </Button>
                        </Tooltip>
                    )}

                    <h1 className="heading text-foreground leading-none">
                        {heading}
                    </h1>

                    <div>{loading && <Loading />}</div>
                </div>

                <div className="h-4" />
                <Separator />
                <div className="h-4" />
            </div>
        );
    }
);

export { PageHeading };
