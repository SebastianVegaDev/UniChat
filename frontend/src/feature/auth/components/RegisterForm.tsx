import "./RegisterForm.css";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

function RegisterForm({ handleSubmit, handleGoogleSubmit, showGoogleLogin = true }) {
    const navigate = useNavigate();

    function onSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const registerData = {
            firstName: formData.get("firstName"),
            lastName: formData.get("lastName"),
            email: formData.get("email"),
            password: formData.get("password"),
            repeatPassword: formData.get("repeatPassword")
        };

        handleSubmit(registerData);
    }

    return (
        <form className="register-form" onSubmit={onSubmit}>
            <h1>Create an account</h1>

            <div className="register-form-inputs">
                <div className="register-form-inputs-name">
                    <input
                        className="register-form-input"
                        name="firstName"
                        placeholder="First name"
                    />

                    <input
                        className="register-form-input"
                        name="lastName"
                        placeholder="Last name"
                    />
                </div>

                <input
                    className="register-form-input"
                    placeholder="87654321@aloe.ulima.edu.pe"
                    name="email"
                    type="email"
                />

                <input
                    className="register-form-input"
                    placeholder="Password"
                    type="password"
                    name="password"
                />

                <input
                    className="register-form-input"
                    placeholder="Confirm password"
                    type="password"
                    name="repeatPassword"
                />
            </div>

            <div className="register-form-buttons">
                <button className="register-form-button-code" type="submit">
                    Continue with email
                </button>

                {showGoogleLogin && (
                    <button className="register-form-button-gmail" type="button" onClick={handleGoogleSubmit}>
                        <FcGoogle className="register-form-google-icon" aria-hidden="true" />
                        Continue with Google
                    </button>
                )}
            </div>

            <p className="register-form-footer">
                Already have an account?{" "}
                <span className="register-form-footer-link" onClick={() => navigate("/login")}>
                    Log in
                </span>
            </p>
        </form>
    );
}

export default RegisterForm;