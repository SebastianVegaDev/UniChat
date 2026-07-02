import { Navigate } from "react-router-dom";
import { hasAuthSession } from "../auth/sessionStorage.js";

function ProtectedRoute({ children, redirectTo = "/login" }) {
    if (!hasAuthSession()) {
        return <Navigate to={redirectTo} replace />;
    }

    return children;
}

export default ProtectedRoute;