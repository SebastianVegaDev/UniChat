import AuthLayout from "../../../shared/ui/layouts/auth/AuthLayout.jsx";
import LoginForm from "../../../shared/ui/forms/login/LoginForm.jsx";
import LoadingLayout from "../../../shared/ui/layouts/loading/LoadingLayout.jsx";
import { fetchGoogleAuth, fetchLogin } from "../api/auth.api.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";

function LoginPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const googleLogin = useGoogleLogin({
        scope: "openid email profile",
        onSuccess: handleGoogleSubmit,
        onError: () => toast.error("Google login failed")
    });

    function saveSession(data, message) {
        if (data?.token) {
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.token);
            navigate("/");
            toast.success(message);
        }
    }

    async function handleSubmit(loginData) {
        try {
            setLoading(true);

            const data = await fetchLogin(loginData);

            saveSession(data, "Successful login!");
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleGoogleSubmit(response) {
        try {
            setLoading(true);

            const data = await fetchGoogleAuth({ accessToken: response.access_token });

            saveSession(data, "Successful Google login!");
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <LoadingLayout />

    return (
        <AuthLayout>
            <LoginForm
                handleSubmit={handleSubmit}
                handleGoogleSubmit={() => googleLogin()}
            />
        </AuthLayout>
    )
}

export default LoginPage;
