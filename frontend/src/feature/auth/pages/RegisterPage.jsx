import AuthLayout from "../../../shared/ui/layouts/auth/AuthLayout.jsx";
import RegisterForm from "../../../shared/ui/forms/register/RegisterForm.jsx";
import LoadingLayout from "../../../shared/ui/layouts/loading/LoadingLayout.jsx";
import { fetchRegister } from "../api/auth.api.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    if (loading) return <LoadingLayout/>

    async function handleSubmit(registerData) {
        try {
            setLoading(true);

            await fetchRegister(registerData);
            navigate("/login");
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthLayout>
            <RegisterForm handleSubmit={handleSubmit}/>
        </AuthLayout>
    )
}

export default RegisterPage;