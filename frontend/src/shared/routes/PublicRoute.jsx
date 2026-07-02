import { Navigate } from "react-router-dom";
import { hasAuthSession } from "../auth/sessionStorage.js";

function PublicRoute({ children }) {
    if (hasAuthSession()) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default PublicRoute;