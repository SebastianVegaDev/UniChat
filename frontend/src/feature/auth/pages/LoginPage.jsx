import AuthLayout from "../../../shared/ui/layouts/auth/AuthLayout.jsx";
import LoginForm from "../../../shared/ui/forms/login/LoginForm.jsx";
import LoadingLayout from "../../../shared/ui/layouts/loading/LoadingLayout.jsx";
import { fetchLogin } from "../api/auth.api.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    if (loading) return <LoadingLayout />

    async function handleSubmit(loginData) {
        try {
            setLoading(true);

            const data = await fetchLogin(loginData);

            if (data?.token) {
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("token", data.token);
                navigate("/");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthLayout>
            <LoginForm handleSubmit={handleSubmit}/>
        </AuthLayout>
    )
}

export default LoginPage;