export type Setter<T> = (value: T | ((prev: T) => T)) => void;

export type CurrencyCode = "inr" | "usd";

export interface DateRangeFilter {
    from?: Date;
    to?: Date;
}
