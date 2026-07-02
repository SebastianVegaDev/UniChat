import { useBootstrap } from "./useBootstrap.js";

export function useBootstrapData() {
    const bootstrap = useBootstrap();

    return {
        ...bootstrap,
        setData: bootstrap.updateBootstrap
    };
}
