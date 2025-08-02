import { FC, ReactNode, Ref } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";

import { IconCheck, IconChevronDown, IconChevronUp } from "../../icons";
import { cn } from "../../shared/utils";
import { useControlled } from "../../hooks/use_controlled";
import { Loading, InputErrorMessage } from "../index";

interface SelectOptionItem<T = string> {
    value: T;
    label: string | ReactNode;
    disabled?: boolean;
}

interface SelectProps extends SelectPrimitive.SelectProps {
    ref?: Ref<HTMLButtonElement>;
    container?: HTMLElement | null;
    options: SelectOptionItem[];
    placeholder?: ReactNode;
    classNames?: {
        content?: string;
        trigger?: string;
        item?: string;
    };
    loading?: boolean;
    error?: boolean;
    errorMsg?: string;
}

const Select: FC<SelectProps> = ({
    ref,
    container,
    children,
    options,
    classNames,
    disabled,
    loading,
    error,
    errorMsg,
    placeholder,
    defaultValue = "",
    value: valueProp,
    defaultOpen = false,
    open: openProp,
    onOpenChange,
    ...props
}) => {
    const [value, setValue] = useControlled({
        controlled: valueProp,
        default: defaultValue,
        name: "value",
    });

    const [open, setOpen] = useControlled({
        controlled: openProp,
        default: defaultOpen,
        name: "open",
    });

    return (
        <SelectPrimitive.Root
            open={open}
            onOpenChange={(v) => setOpen(v)}
            value={value}
            onValueChange={setValue}
            defaultValue={defaultValue}
            defaultOpen={defaultOpen}
            disabled={disabled || loading}
            data-disabled={disabled || loading}
            {...props}
        >
            <SelectPrimitive.Trigger
                ref={ref}
                className={cn(
                    "bg-secondary text-text-primary border-border-soft hover:bg-secondary-hover flex h-10 w-full items-center justify-between gap-x-4 rounded-md border-1 p-3 text-sm transition-colors sm:w-[240px]",
                    {
                        "text-text-muted": !value,
                        "opacity-60": disabled || loading,
                        "border-b-border-red": error,
                        "bg-secondary-hover": open,
                    },
                    classNames?.trigger
                )}
            >
                {loading ? (
                    <div className="flex-center w-full">
                        <Loading />
                    </div>
                ) : (
                    <>
                        <SelectPrimitive.Value
                            placeholder={placeholder ?? "Choose"}
                        />
                        <SelectPrimitive.Icon
                            className={cn("text-primary-500", {
                                "-rotate-180 transition-transform": open,
                                "rotate-0 transition-transform": !open,
                                "text-primary-300": value,
                            })}
                        >
                            <IconChevronDown size={20} />
                        </SelectPrimitive.Icon>
                    </>
                )}
            </SelectPrimitive.Trigger>

            {error && errorMsg && <InputErrorMessage errorMsg={errorMsg} />}

            <SelectPrimitive.Portal container={container}>
                <SelectPrimitive.Content
                    position="popper"
                    className={cn(
                        "border-border-soft bg-surface-3 z-100 my-1 w-[240px] rounded-md border-1 text-sm",
                        classNames?.content
                    )}
                >
                    <SelectPrimitive.ScrollUpButton>
                        <IconChevronUp />
                    </SelectPrimitive.ScrollUpButton>

                    <SelectPrimitive.Viewport>
                        {options.map((option, idx) => (
                            <SelectItem
                                key={`${option.value}${idx}`}
                                className={classNames?.item}
                                value={option.value}
                                disabled={option.disabled}
                            >
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectPrimitive.Viewport>

                    <SelectPrimitive.ScrollDownButton>
                        <IconChevronDown />
                    </SelectPrimitive.ScrollDownButton>
                </SelectPrimitive.Content>
            </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
    );
};

interface SelectItemProps extends SelectPrimitive.SelectItemProps {
    ref?: Ref<HTMLDivElement>;
}

const SelectItem: FC<SelectItemProps> = ({
    ref,
    children,
    className,
    disabled,
    ...props
}) => {
    return (
        <SelectPrimitive.Item
            ref={ref}
            data-disabled={disabled}
            className={cn(
                "enabled:hover:bg-secondary-hover focus:bg-secondary-hover data-[disabled=true]:text-text-subtle focus:outline-noned m-1 flex h-fit items-center justify-between rounded-sm p-2",
                className
            )}
            disabled={disabled}
            {...props}
        >
            <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
            <SelectPrimitive.ItemIndicator>
                <IconCheck size={18} className="text-text-muted" />
            </SelectPrimitive.ItemIndicator>
        </SelectPrimitive.Item>
    );
};

export { Select };
export type { SelectProps, SelectOptionItem };
