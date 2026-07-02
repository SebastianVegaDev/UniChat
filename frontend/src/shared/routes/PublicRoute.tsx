import { Navigate } from "react-router-dom";
import { hasAuthSession } from "../auth/sessionStorage.js";
import type { ReactNode } from "react";

function PublicRoute({ children }: { children: ReactNode }) {
    if (hasAuthSession()) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default PublicRoute;
