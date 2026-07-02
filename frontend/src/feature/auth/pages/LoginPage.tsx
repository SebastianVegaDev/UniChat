import AuthLayout from "../components/AuthLayout.jsx";
import LoginForm from "../components/LoginForm.jsx";
import LoadingLayout from "../../../shared/ui/layouts/loading/LoadingLayout.jsx";
import { fetchGoogleAuth, fetchLogin } from "../api/auth.api.js";
import { isGoogleAuthEnabled } from "../../../shared/config/env.js";
import { saveAuthSession } from "../../../shared/auth/sessionStorage.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../../shared/types/app.types.js";

function LoginPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const googleLogin = useGoogleLogin({
        scope: "openid email profile",
        onSuccess: handleGoogleSubmit,
        onError: () => toast.error("Google login failed")
    });

    function saveSession(data, message) {
        if (!data?.token) return;

        saveAuthSession(data);
        navigate("/");
        toast.success(message);
    }

    async function handleSubmit(loginData) {
        try {
            setLoading(true);

            const data = await fetchLogin(loginData);

            saveSession(data, "Successful login!");
        } catch (error) {
            toast.error(getErrorMessage(error));
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
            toast.error(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    }

    function handleGoogleButtonClick() {
        if (!isGoogleAuthEnabled) {
            toast.error("Google login is not configured");
            return;
        }

        googleLogin();
    }

    if (loading) return <LoadingLayout />;

    return (
        <AuthLayout>
            <LoginForm
                handleSubmit={handleSubmit}
                handleGoogleSubmit={handleGoogleButtonClick}
                showGoogleLogin={isGoogleAuthEnabled}
            />
        </AuthLayout>
    );
}

export default LoginPage;
