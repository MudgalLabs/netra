import { cn } from "../../shared/utils";
import { FC } from "react";

interface ErrorMessageProps {
    errorMsg: string;
    className?: string;
}

export const ErrorMessage: FC<ErrorMessageProps> = ({
    errorMsg,
    className,
}) => {
    return (
        <p className={cn("text-text-destructive text-xs", className)}>
            {errorMsg}
        </p>
    );
};
