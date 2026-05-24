import "./CourseInformation.css";
import { usePreferenceTexts } from "../../../../../feature/preferences/context/PreferencesContext.js";

function CourseInformation({information}) {
    const { course } = usePreferenceTexts();

    return (
        <div className="course-information">
            <p>{course.information}</p>
            <div className="course-information-week">
                <h3>{information.currentWeek}</h3>
                <h4>{course.currentWeek}</h4>
            </div>
            <div className="course-information-details">
                <div>
                    <h3>{course.professor}</h3>
                    <p>{information.professor}</p>
                </div>
                <div>
                    <h3>{course.delegates}</h3>
                    <p>{information.delegates}</p>
                </div>
                <div>
                    <h3>{course.activity}</h3>
                    <p>{information.activity}</p>
                </div>
            </div>
        </div>
    );
}

export default CourseInformation;
