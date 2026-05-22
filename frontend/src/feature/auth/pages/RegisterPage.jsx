import AuthLayout from "../../../shared/ui/layouts/auth/AuthLayout.jsx";
import RegisterForm from "../../../shared/ui/forms/register/RegisterForm.jsx";
import LoadingLayout from "../../../shared/ui/layouts/loading/LoadingLayout.jsx";
import { fetchGoogleAuth, fetchRegister } from "../api/auth.api.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";

function RegisterPage() {
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

    async function handleSubmit(registerData) {
        try {
            setLoading(true);

            await fetchRegister(registerData);
            navigate("/login");
            toast.success("Successful register!");
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

    if (loading) return <LoadingLayout/>

    return (
        <AuthLayout>
            <RegisterForm
                handleSubmit={handleSubmit}
                handleGoogleSubmit={() => googleLogin()}
            />
        </AuthLayout>
    )
}

export default RegisterPage;
