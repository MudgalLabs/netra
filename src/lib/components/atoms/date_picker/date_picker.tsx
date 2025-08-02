import { ComponentProps, useEffect, useMemo, useRef, useState } from "react";

import { useControlled } from "../../hooks/use_controlled";
import { IconCalendarRange, IconCalendarSingle } from "../../icons";
import { cn, formatDate } from "../../shared/utils";
import {
    Calendar,
    CalendarProps,
    Popover,
    PopoverContent,
    PopoverTrigger,
    PopoverContentProps,
    Button,
} from "../index";

interface DatePickerProps
    extends Omit<CalendarProps, "dates" | "onDatesChange"> {
    popoverContentProps?: PopoverContentProps;
    container?: HTMLElement | null;
    className?: string;
    dates?: Date[];
    placeholder?: string;
    onDatesChange?(d: Date[]): void;
    onOpen?: () => void;
    onClose?: () => void;
}

function DatePicker({
    container,
    popoverContentProps = {},
    className,
    dates: datesProp,
    placeholder: placeholderProp,
    onDatesChange: onDatesChangeProp,
    offsetDate: offsetDateProp,
    mode,
    onOffsetChange: onOffsetChangeProp,
    time,
    onOpen,
    onClose,
    config,
}: DatePickerProps) {
    const [dates, setDates] = useControlled({
        controlled: datesProp,
        default: [],
        name: "dates",
    });

    const [offsetDate, setOffsetDate] = useControlled({
        controlled: offsetDateProp,
        default: useMemo(() => new Date(), []),
        name: "offsetDate",
    });

    const [open, setOpen] = useState(false);
    const prevOpen = useRef(open);

    const isDateSet = dates.length > 0;
    const isRange = mode === "range";
    const placeholder =
        placeholderProp || (isRange ? "Select range" : "Select date");
    const selectedText = dates
        .map((d) => formatDate(d, { time: time }))
        .join(" - ");

    let width = "w-[150px]";
    if (isRange) width = "w-[190px]";
    if (time && !isRange) width = "w-[150px]";
    if (time && isRange) width = "w-[330px]";

    const { className: popoverContentClassname, ...restPopoverContentProps } =
        popoverContentProps;

    // To allow the consumer of `DatePicker` be able to do something
    // when the popover opens or closes.
    useEffect(() => {
        if (open && !prevOpen.current) {
            onOpen?.();
        }

        if (!open && prevOpen.current) {
            onClose?.();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <DatePickerButton
                    className={className}
                    open={open}
                    isDateSet={isDateSet}
                >
                    {isRange ? (
                        <IconCalendarRange size={16} />
                    ) : (
                        <IconCalendarSingle size={16} />
                    )}
                    <span className={cn("tabular-nums", width)}>
                        {isDateSet ? selectedText : placeholder}
                    </span>
                </DatePickerButton>
            </PopoverTrigger>
            <PopoverContent
                className={cn(
                    "w-auto border-none p-0",
                    popoverContentClassname
                )}
                align="start"
                container={container}
                {...restPopoverContentProps}
            >
                <Calendar
                    dates={dates}
                    onDatesChange={onDatesChangeProp ?? setDates}
                    offsetDate={offsetDate}
                    onOffsetChange={onOffsetChangeProp ?? setOffsetDate}
                    mode={mode}
                    time={time}
                    config={config}
                />
            </PopoverContent>
        </Popover>
    );
}

function DatePickerButton({
    children,
    className,
    open,
    isDateSet,
    ...props
}: ComponentProps<"button"> & { open: boolean; isDateSet: boolean }) {
    return (
        <Button
            variant="secondary"
            className={cn(
                "text-text-muted font-normal enabled:active:scale-[1]!",
                {
                    "bg-secondary-hover": open,
                    "text-text-primary": isDateSet,
                }
            )}
            {...props}
        >
            {children}
        </Button>
    );
}

export { DatePicker };
export type { DatePickerProps };
