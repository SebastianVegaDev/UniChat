import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import { env } from "./shared/config/env.js";
import "./index.css";

createRoot(document.getElementById("root")).render(
    <GoogleOAuthProvider clientId={env.googleClientId}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </GoogleOAuthProvider>
);