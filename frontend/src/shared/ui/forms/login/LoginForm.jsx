import "./LoginForm.css";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

function LoginForm({ handleSubmit, handleGoogleSubmit }) {
    const navigate = useNavigate();

    function onSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const loginData = {
            code: formData.get("code"),
            password: formData.get("password")
        };

        handleSubmit(loginData);
    }

    return (
        <form className="login-form" onSubmit={onSubmit}>
            <h1>Welcome Back</h1>
            <div className="login-form-inputs">
                <input
                    className="login-form-input"
                    name="code"
                    placeholder="87654321"
                />
                <input
                    className="login-form-input"
                    name="password"
                    type="password"
                    placeholder="Password"
                />
            </div>
            <div className="login-form-buttons">
                <button className="login-form-button-code" type="submit">Continue with Code</button>
                <button className="login-form-button-gmail" type="button" onClick={handleGoogleSubmit}>
                    <FcGoogle className="login-form-google-icon" aria-hidden="true" />
                    Continue with Google
                </button>
            </div>
            <p className="login-form-footer">
                Don't have an account?{" "}
                <span className="login-form-footer-link" onClick={() => navigate("/register")}>
                    Create one
                </span>
            </p>
        </form>
    );
}

export default LoginForm;
