import "./HomeNextClass.css";
import { useNavigate } from "react-router-dom";
import { usePreferenceTexts } from "../../../../../../feature/preferences/context/PreferencesContext.js";

function HomeNextClass({nextClass}) {
    const navigate = useNavigate();
    const { home } = usePreferenceTexts();

    if (!nextClass) {
        return (
            <div className="home-grid-next-class">
                <h3>{home.nextClass}</h3>
            </div>
        );
    }

    return (
        <div className="home-grid-next-class">
            <h3>{home.nextClass}</h3>
            <h2>{nextClass.title}</h2>
            <p>{nextClass.startTime} - {nextClass.endTime} · {nextClass.classroom} · {nextClass.teacher}</p>
            <button type="button" onClick={() => { navigate(nextClass.route) }}>{home.openCourse}</button>
        </div>
    );
}

export default HomeNextClass;
