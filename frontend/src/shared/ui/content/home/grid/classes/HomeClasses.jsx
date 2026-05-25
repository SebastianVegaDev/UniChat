import "./HomeClasses.css";
import { Link } from "react-router-dom";
import { usePreferenceTexts } from "../../../../../../feature/preferences/context/PreferencesContext.js";

function HomeClasses({todayClasses}) {
    const { home } = usePreferenceTexts();

    return (
        <div className="home-grid-classes">
            <p>{home.classes}</p>
            { todayClasses.map((classItem) => (
                <Link to={classItem.route} className="home-grid-class" key={classItem.id}>
                    <div className={`home-grid-class-info ${classItem.statusLabel}`}>
                        <div>
                            <p className="home-grid-class-time">{classItem.startTime} {classItem.endTime}</p>
                        </div>
                        <div>
                            <p className="home-grid-class-course">{classItem.title}</p>
                            <p className="home-grid-class-description">{classItem.topic}</p>
                        </div>
                    </div>
                    <div className={`home-grid-class-badges`}>
                        <p className="home-grid-class-classroom">{classItem.classroom}</p>
                        <p className={`home-grid-class-state ${classItem.statusLabel}`}>{classItem.statusText}</p>
                    </div>
                </Link>
            )) }

        </div>
    );
}

export default HomeClasses;
