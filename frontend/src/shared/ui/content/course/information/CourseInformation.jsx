import "./CourseInformation.css";

function CourseInformation({information}) {
    return (
        <div className="course-information">
            <p>INFORMATION</p>
            <div className="course-information-week">
                <h3>{information.currentWeek}</h3>
                <h4>Current Week</h4>
            </div>
            <div className="course-information-details">
                <div>
                    <h3>Professor</h3>
                    <p>{information.professor}</p>
                </div>
                <div>
                    <h3>Delegates</h3>
                    <p>{information.delegates}</p>
                </div>
                <div>
                    <h3>Activity</h3>
                    <p>{information.activity}</p>
                </div>
            </div>
        </div>
    );
}

export default CourseInformation;
