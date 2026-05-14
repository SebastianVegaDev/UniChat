import "./LoginForm.css"
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom"

function LoginForm() {
    const navigate = useNavigate()

    return (
        <form className="login-form">
            <h1>Welcome Back</h1>
            <div className="login-form-inputs">
                <input className="login-form-input" placeHolder="87654321@aloe.ulima.edu.pe"></input>
                <input className="login-form-input" placeHolder="Password"></input>
            </div>
            <div className="login-form-buttons">
                <button className="login-form-button-code" type="button">Continue with email</button>
                <button className="login-form-button-gmail" type="button">
                    <FcGoogle className="login-form-google-icon" aria-hidden="true" />
                    Continue with Google
                </button>
            </div>
            <p className="login-form-footer">Don't have an account? <span className="login-form-footer-link" onClick={() => navigate("/register")}>Create one</span></p>
        </form>
    )
}

export default LoginForm;
