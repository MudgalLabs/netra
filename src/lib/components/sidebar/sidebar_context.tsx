import { createContext, PropsWithChildren, useContext } from "react";

import { useLocalStorageState } from "../../hooks/use_local_storage_state";

interface SidebarContextType {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
    isOpen: false,
    setIsOpen: () => {},
    toggleSidebar: () => {},
});

export function SidebarProvider({
    children,
    localStorageKey = "sidebar_open",
}: PropsWithChildren<{ localStorageKey?: string }>) {
    const [isOpen, setIsOpen] = useLocalStorageState<boolean>(
        localStorageKey,
        true
    );

    function toggleSidebar() {
        setIsOpen((prev) => !prev);
    }

    return (
        <SidebarContext.Provider
            value={{
                isOpen,
                setIsOpen,
                toggleSidebar,
            }}
        >
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar(): SidebarContextType {
    const context = useContext(SidebarContext);

    if (!context) {
        throw new Error("useSidebar: did you forget to use SidebarProvider?");
    }

    return context;
}
