import AuthLayout from "../components/AuthLayout.jsx";
import RegisterForm from "../components/RegisterForm.jsx";
import LoadingLayout from "../../../shared/ui/layouts/loading/LoadingLayout.jsx";
import { fetchGoogleAuth, fetchRegister } from "../api/auth.api.js";
import { isGoogleAuthEnabled } from "../../../shared/config/env.js";
import { saveAuthSession } from "../../../shared/auth/sessionStorage.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../../shared/types/app.types.js";

function RegisterPage() {
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

    async function handleSubmit(registerData) {
        try {
            setLoading(true);

            await fetchRegister(registerData);
            navigate("/login");
            toast.success("Successful register!");
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
            <RegisterForm
                handleSubmit={handleSubmit}
                handleGoogleSubmit={handleGoogleButtonClick}
                showGoogleLogin={isGoogleAuthEnabled}
            />
        </AuthLayout>
    );
}

export default RegisterPage;
