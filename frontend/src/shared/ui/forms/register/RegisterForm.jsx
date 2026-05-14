import "./RegisterForm.css"
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom"

function RegisterForm() {
    const navigate = useNavigate()

    return (
        <form className="register-form">
            <h1>Create an account</h1>
            <div className="register-form-inputs">
                <div className="register-form-inputs-name">
                    <input className="register-form-input" htmlFor="register-first-name" placeHolder="First name"></input>
                    <input className="register-form-input" htmlFor="register-last-name" placeHolder="Last name"></input>
                </div>
                <input className="register-form-input" placeHolder="87654321@aloe.ulima.edu.pe"></input>
                <input className="register-form-input" placeHolder="Password"></input>
                <input className="register-form-input" placeHolder="Confirm password"></input>
            </div>
            <div className="register-form-buttons">
                <button className="register-form-button-code">Continue with email</button>
                <button className="register-form-button-gmail" type="button">
                    <FcGoogle className="register-form-google-icon" aria-hidden="true" />
                    Continue with Google
                </button>
            </div>
            <p className="register-form-footer">Already have an account? <span className="register-form-footer-link" onClick={() => navigate("/login")}>Log in</span></p>
        </form>
    )
}

export default RegisterForm;
