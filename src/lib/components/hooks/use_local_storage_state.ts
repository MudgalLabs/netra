import { useEffect, useState } from "react";
import { isFunction } from "@tanstack/react-table";

import { useDebounce } from "./use_debounce";
import { loadFromLocalStorage, saveToLocalStorage } from "../shared/utils";

interface Options<T> {
    /** Use this function to modify the state however you want before it is persisted. */
    saveFn?: (value: T) => Partial<T>;
    // TOOD: We can do a similar function called `loadFn` to allow logic to run when loading.
}

export function useLocalStorageState<T>(
    /** Unique key that will be used to persist state in LocalStorage. */
    key: string,
    /**
     * Default value to fallback to in case we don't have anything stored
     * in the LocalStorage. This can also be considered as initial state.
     */
    defaultValue: T,
    /**
     * Additional options that can be passed to modify the default behaviour.
     */
    options?: Options<T>
): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [state, setState] = useState<T>(() => {
        const loadedValue = loadFromLocalStorage<T>(key);

        if (loadedValue === null) {
            return defaultValue;
        } else {
            return loadedValue;
        }
    });

    const debouncedState = useDebounce(state, 300);

    // Sync LocalStorage when state changes.
    useEffect(() => {
        let toSave: Partial<T> = debouncedState;

        if (isFunction(options?.saveFn)) {
            toSave = options.saveFn(debouncedState);
        }

        saveToLocalStorage(key, JSON.stringify(toSave));
    }, [debouncedState]);

    return [state, setState];
}
