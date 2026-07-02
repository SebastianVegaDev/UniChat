import { createContext } from "react";
import type { BootstrapData, Updater } from "../../../shared/types/app.types.js";

export interface BootstrapContextValue {
    data: BootstrapData | null;
    isLoading: boolean;
    error: string | null;
    updateBootstrap: (updater: Updater<BootstrapData>) => void;
}

export const BootstrapContext = createContext<BootstrapContextValue | null>(null);
