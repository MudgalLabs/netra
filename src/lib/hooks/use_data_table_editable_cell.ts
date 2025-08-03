import { useEffect, useState } from "react";
import { CellContext, RowData } from "@tanstack/react-table";
import { Setter } from "../shared/types";

declare module "@tanstack/react-table" {
    interface TableMeta<TData extends RowData> {
        updateFn?: (rowIndex: number, columnId: string, value: unknown) => void;
        isFetching?: boolean;
        extra?: Record<string, any>;
    }

    interface ColumnMeta<TData extends RowData, TValue> {
        columnVisibilityHeader?: string;
    }
}

function useDataTableEditableCell<TCellValue>(ctx: CellContext<any, any>) {
    const {
        getValue,
        row: { index },
        column: { id },
        table,
    } = ctx;

    const initialValue = getValue();

    // We need to keep and update the state of the cell normally.
    const [value, setValue] = useState<TCellValue>(initialValue);

    const sync = () => {
        // If the value has not changed, we don't need to sync.
        if (value === initialValue) {
            return;
        }

        table.options.meta?.updateFn?.(index, id, value);
    };

    // User can pass a value directly if they don't want to use `setValue`
    // but call `sync` directly. Useful for things like checkboxes, toggles, etc.
    const syncWithValue = (value: TCellValue) => {
        // If the value has not changed, we don't need to sync.
        if (value === initialValue) {
            return;
        }

        table.options.meta?.updateFn?.(index, id, value);
    };

    // If the initialValue is changed external, sync it up with our state.
    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    return {
        value,
        setValue,
        sync,
        syncWithValue,
    };
}

type DataTableCellUpdateFn = (
    rowIndex: number,
    columnId: string,
    value: unknown
) => void;

// function getDataTableCellUpdateFn<T = unknown>(setter: Setter<T[]>): DataTableCellUpdateFn {
//     return (rowIndex, columnId, value) => {
//         setter((old: T[]) =>
//             old.map((row, index) => {
//                 if (index === rowIndex) {
//                     return {
//                         ...old[rowIndex]!,
//                         [columnId]: value,
//                     };
//                 }
//                 return row;
//             })
//         );
//     };
// }

function getDataTableCellUpdateFn<T = unknown>(
    setter: Setter<T[]>
): DataTableCellUpdateFn {
    return (rowIndex, columnId, value) => {
        setter((old: T[]) => {
            if (!old[rowIndex]) return old;
            const copy = Array.from(old);
            // Only clone the row being updated
            const row = { ...copy[rowIndex], [columnId]: value };
            copy[rowIndex] = row;
            return copy;
        });
    };
}

export { useDataTableEditableCell, getDataTableCellUpdateFn };
export type { DataTableCellUpdateFn };
