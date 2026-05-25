import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, redirectTo = "/login" }) {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to={redirectTo} replace />
    }

    return children;
}

export default ProtectedRoute;
