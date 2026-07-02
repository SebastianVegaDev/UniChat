import { Navigate } from "react-router-dom";
import { hasAuthSession } from "../auth/sessionStorage.js";
import type { ReactNode } from "react";

function ProtectedRoute({ children, redirectTo = "/login" }: { children: ReactNode; redirectTo?: string }) {
    if (!hasAuthSession()) {
        return <Navigate to={redirectTo} replace />;
    }

    return children;
}

export default ProtectedRoute;
