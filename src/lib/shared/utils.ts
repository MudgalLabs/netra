import qs from "qs";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { CurrencyCode, DateRangeFilter } from "./types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function isProd(): boolean {
    return process.env.NODE_ENV === "production";
}

export function saveToLocalStorage(key: string, value: string) {
    localStorage.setItem(key, value);
}

export function loadFromLocalStorage<T>(key: string): T | null {
    try {
        const valueStr = localStorage.getItem(key);

        if (valueStr == null) {
            return null;
        }

        const value: T = JSON.parse(valueStr);

        return value;
    } catch (err) {
        console.error("Failed to load from LocalStorage: ", err);
        return null;
    }
}

interface formatDateOptions {
    time?: boolean;
}

export function formatDate(date: Date, options: formatDateOptions = {}) {
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    const month = months[date.getMonth()];

    const formattedDate = `${month} ${day}, ${year}`;

    if (options.time) {
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${formattedDate}, ${hours}:${minutes}`;
    }

    return formattedDate;
}

/**
 * Rounds a Date object to the nearest 15-minute increment.
 * Adjusts the hour if needed and resets seconds and milliseconds.
 *
 * @param date - A Date instance to be rounded.
 * @returns A new Date object rounded to the nearest 15 minutes.
 */
export function roundToNearest15Minutes(date: Date): Date {
    const result = new Date(date); // Clone original to avoid mutation

    const minutes: number = result.getMinutes();
    const roundedMinutes: number = Math.round(minutes / 15) * 15;

    if (roundedMinutes === 60) {
        result.setHours(result.getHours() + 1);
        result.setMinutes(0);
    } else {
        result.setMinutes(roundedMinutes);
    }

    result.setSeconds(0);
    result.setMilliseconds(0);

    return result;
}

/**
 * Represents the time difference between two dates in
 * days, hours, minutes, seconds, and milliseconds.
 */
interface TimeElapsed {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
}

/**
 * Calculates the time elapsed between two Date objects and returns the breakdown
 * in days, hours, minutes, seconds, and milliseconds.
 */
export function getElapsedTime(start: Date, end: Date): TimeElapsed {
    if (start > end) {
        console.error(
            "getElapsedTime: start date must be earlier than end date."
        );
        return { days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };
    }

    const diffMs = Math.abs(end.getTime() - start.getTime()); // in ms
    let diff = diffMs / 1000; // in seconds

    const days = Math.floor(diff / 86400);
    diff -= days * 86400;
    const hours = Math.floor(diff / 3600);
    diff -= hours * 3600;
    const minutes = Math.floor(diff / 60);
    diff -= minutes * 60;
    const seconds = Math.floor(diff);
    diff -= seconds;

    // Remaining milliseconds
    const milliseconds = Math.floor(diff * 1000);

    return { days, hours, minutes, seconds, milliseconds };
}

type AnyObject = Record<string, any>;

export function deepMerge<T extends AnyObject, U extends AnyObject>(
    obj1: T,
    obj2: U
): T & U {
    const result: AnyObject = { ...obj1 };

    for (const key in obj2) {
        if (Object.prototype.hasOwnProperty.call(obj2, key)) {
            const val1 = obj1[key];
            const val2 = obj2[key];

            if (isPlainObject(val1) && isPlainObject(val2)) {
                result[key] = deepMerge(val1, val2);
            } else {
                result[key] = val2;
            }
        }
    }

    return result as T & U;
}

// Helper to check if a value is a plain (non-array, non-null) object
function isPlainObject(value: any): value is AnyObject {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isSameDay(date1: Date, date2: Date): boolean {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

export function removeAtIndex<T>(array: T[], index: number): T[] {
    if (index < 0 || index >= array.length) return array;
    return [...array.slice(0, index), ...array.slice(index + 1)];
}

export function formatCurrency(
    amount: string | number,
    {
        currency = "inr",
        hideSymbol = false,
        locale = "en-IN",
        localizationOpts = {},
        compact = false,
    }: {
        currency?: CurrencyCode;
        hideSymbol?: boolean;
        locale?: string;
        localizationOpts?: Intl.NumberFormatOptions;
        compact?: boolean;
    } = {}
): string {
    const _amount = Number(amount);

    if (compact) {
        const absAmount = Math.abs(_amount);
        let formatted = "";

        if (absAmount >= 1_00_00_000) {
            formatted = `${(_amount / 1_00_00_000).toFixed(2)}Cr`; // Crores
        } else if (absAmount >= 1_00_000) {
            formatted = `${(_amount / 1_00_000).toFixed(2)}L`; // Lakhs
        } else if (absAmount >= 1_000) {
            formatted = `${(_amount / 1_000).toFixed(2)}k`; // Thousands
        } else {
            formatted = _amount.toFixed(2); // Default formatting for smaller values
        }

        return hideSymbol
            ? formatted
            : `${getCurrencySymbol(currency)}${formatted}`;
    }

    const options = deepMerge(
        {
            style: hideSymbol ? "decimal" : "currency",
            currency: currency,
            maximumFractionDigits: 2,
        },
        localizationOpts
    );

    return new Intl.NumberFormat(locale, options).format(_amount);
}

export function removeFormatCurrency(formatted: string): string {
    // Remove anything that isn't a digit or a dot
    const cleaned = formatted.replace(/[^0-9.]/g, "");

    return cleaned;
}

export function getCurrencySymbol(
    currencyCode: CurrencyCode,
    locale = "en"
): string {
    const formatted = new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(1);

    // Remove all digits, commas, periods, and whitespace to isolate the symbol
    const symbol = formatted.replace(/[\d.,\s]/g, "").trim();
    return symbol;
}

let counter = 0;

export function generateId(prefix = "id") {
    const timestamp = Date.now();
    const uniquePart = counter++;
    return `${prefix}-${timestamp}-${uniquePart}`;
}

export function isFunction(value: any): value is Function {
    return typeof value === "function";
}

export function datesArrayToDateRangeFilter(dates: Date[]): DateRangeFilter {
    if (!dates || dates.length === 0) return {};

    const from = dates[0];
    const to = dates[1];

    if (from && to) {
        return { from, to };
    } else if (from) {
        return { from };
    } else if (to) {
        return { to };
    }

    return {};
}

export function dateRangeFilterToDatesArray(
    filter: DateRangeFilter | undefined
): Date[] {
    if (!filter) return [];

    const dates: Date[] = [];
    const from: Date | undefined = filter?.from;
    const to: Date | undefined = filter?.to;
    if (from) {
        dates.push(from);
    }
    if (to) {
        dates.push(to);
    }
    return dates;
}

export function loadFromURL<T>(
    key: string,
    defaultValue?: T,
    customParsers?: LoadFromURLParser
): T {
    const raw = qs.parse(location.search, {
        ignoreQueryPrefix: true,
        allowDots: true,
    })[key] as T;
    const parsedQuery = deepParseObject<T>(raw, customParsers);

    if (
        raw === "" ||
        raw === undefined ||
        parsedQuery === "" ||
        parsedQuery === undefined
    ) {
        // No value in URL, return default value.
        return defaultValue as T;
    }

    if (
        Object.keys(parsedQuery as object).length === 0 &&
        parsedQuery !== undefined
    ) {
        // We found a value in URL, but it's not an object (e.g., empty string).
        return parsedQuery as T;
    }

    if (Object.keys(parsedQuery as object).length > 0) {
        // Parsed query is an object with keys, return it.
        return { ...defaultValue, ...parsedQuery };
    }

    // Fallback to default value if nothing else matches.
    return defaultValue as T;
}

export function saveToURL<T>(key: string, value: T) {
    const currentQuery = qs.parse(location.search, {
        ignoreQueryPrefix: true,
        allowDots: true,
    });

    const updatedQuery = {
        ...currentQuery,
        [key]: value,
    };

    const queryString = qs.stringify(updatedQuery, {
        encodeValuesOnly: true,
        skipNulls: true,
        allowDots: true,
    });

    const newUrl = `${window.location.pathname}?${queryString}`;
    window.history.replaceState(null, "", newUrl);
}

export type LoadFromURLParser = {
    [key: string]: (value: any) => any;
};

function deepParseObject<T>(
    input: T,
    customParsers?: LoadFromURLParser,
    path: string = ""
): T {
    if (Array.isArray(input)) {
        return input.map((item, idx) =>
            deepParseObject(item, customParsers, `${path}[${idx}]`)
        ) as any;
    }

    if (input && typeof input === "object" && !(input instanceof Date)) {
        const result: any = {};
        for (const key in input) {
            const fullPath = path ? `${path}.${key}` : key;
            const value = (input as any)[key];
            result[key] = deepParseObject(value, customParsers, fullPath);
        }
        return result;
    }

    // String leaf node — apply built-in parsing
    if (typeof input === "string") {
        // Custom parser takes precedence
        if (customParsers?.[path]) {
            return customParsers[path](input);
        }

        // Date ISO check
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(input)) {
            const date = new Date(input) as any;
            return isNaN(date.getTime()) ? input : date;
        }

        // Number check — skip empty strings
        if (input.trim() !== "" && !isNaN(Number(input))) {
            return Number(input) as any;
        }

        // Boolean check
        if (input === "true") return true as any;
        if (input === "false") return false as any;
    }

    return input;
}

export const BROWSER_TIMEZONE = getUserTimezone();

export function getUserTimezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone; // e.g. "Asia/Kolkata"
}

// Eg: formatTimeAgo(new Date(Date.now() - 1000 * 60 * 5)); // "5 minutes ago"
export function formatTimeAgo(date: Date): string {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) {
        return "less than a minute ago";
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
        return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    }

    const days = Math.floor(hours / 24);
    if (days < 30) {
        return `${days} day${days === 1 ? "" : "s"} ago`;
    }

    const months = Math.floor(days / 30);
    if (months < 12) {
        return `${months} month${months === 1 ? "" : "s"} ago`;
    }

    const years = Math.floor(months / 12);
    return `${years} year${years === 1 ? "" : "s"} ago`;
}

// formatNumber(1000000) // → "1,000,000"
// formatNumber(1000000, { notation: "compact" }) // → "1M"
export function formatNumber(
    value: number,
    options: {
        locale?: string;
        notation?: "standard" | "compact";
    } = {}
) {
    const { locale = "en-US", notation = "standard" } = options;

    return new Intl.NumberFormat(locale, {
        notation,
        compactDisplay: "short",
    }).format(value);
}

export type TimeUnit = "ms" | "s" | "m" | "h" | "d";

/**
 * Formats the duration between two dates as a human-friendly string.
 * Examples: "450ms", "45s 120ms", "1m 10s 250ms", "1h 1m 12s", "5d 12h 28m 5s"
 *
 * @param from - Start date
 * @param to - End date
 * @param options - Optional: specify smallestUnit and largestUnit (e.g. "ms", "s", "m", "h", "d")
 */
export function formatDuration(
    from: Date,
    to: Date,
    options: {
        smallestUnit?: TimeUnit;
        largestUnit?: TimeUnit;
    } = {}
): string {
    const { smallestUnit = "ms", largestUnit = "d" } = options;
    const order = ["d", "h", "m", "s", "ms"];
    const labels: Record<string, string> = {
        d: "d",
        h: "h",
        m: "m",
        s: "s",
        ms: "ms",
    };

    const startIdx = order.indexOf(largestUnit);
    const endIdx = order.indexOf(smallestUnit);

    // Defensive: if invalid units, fallback to full range
    const units = order.slice(
        startIdx >= 0 ? startIdx : 0,
        endIdx >= 0 ? endIdx + 1 : order.length
    );

    const elapsed = getElapsedTime(from, to);

    const parts: string[] = [];
    for (const unit of units) {
        const value =
            elapsed[
                unit === "d"
                    ? "days"
                    : unit === "h"
                    ? "hours"
                    : unit === "m"
                    ? "minutes"
                    : unit === "s"
                    ? "seconds"
                    : "milliseconds"
            ];
        if (value || parts.length > 0 || unit === smallestUnit) {
            parts.push(`${value}${labels[unit]}`);
        }
    }

    // If all values are zero, show "0ms"
    if (parts.length === 0) return "0ms";
    return parts.join(" ");
}
