import "./NotFoundState.css";
import { Home, SearchX } from "lucide-react";
import { NavLink } from "react-router-dom";
import { usePreferenceTexts } from "../../preferences/context/PreferencesContext.js";

function NotFoundState() {
    const { notFound } = usePreferenceTexts();

    return (
        <div className="not-found-state">
            <div className="not-found-state-icon">
                <SearchX />
            </div>

            <p>{notFound.eyebrow}</p>
            <h2>{notFound.title}</h2>
            <span>{notFound.description}</span>

            <NavLink to="/" className="not-found-state-action">
                <Home />
                {notFound.goHome}
            </NavLink>
        </div>
    );
}

export default NotFoundState;