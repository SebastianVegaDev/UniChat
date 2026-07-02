import { useContext } from "react";
import { BootstrapContext } from "../context/BootstrapContext.js";

export function useBootstrap() {
    const context = useContext(BootstrapContext);

    if (!context) {
        throw new Error("useBootstrap must be used within BootstrapProvider");
    }

    return context;
}
