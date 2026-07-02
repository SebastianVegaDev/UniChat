import "./AuthLayout.css";
import visualPanel from "../../../assets/visual-panel.png";

function AuthLayout({ children }) {
    return (
        <div className="auth-layout">
            <div className="auth-layout-visual-panel">
                <img src={visualPanel} alt="UniChat visual panel" />
            </div>

            <div className="auth-layout-form">
                {children}
            </div>
        </div>
    );
}

export default AuthLayout;