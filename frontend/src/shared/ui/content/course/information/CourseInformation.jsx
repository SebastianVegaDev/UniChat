import "./CourseInformation.css";

function CourseInformation() {
    return (
        <div className="course-information">
            <p>INFORMATION</p>
            <div className="course-information-week">
                <h3>1</h3>
                <h4>Current Week</h4>
            </div>
            <div className="course-information-details">
                <div>
                    <h3>Professor</h3>
                    <p>Prof. Carmen Ruiz</p>
                </div>
                <div>
                    <h3>Delegates</h3>
                    <p>Valeria Paredes, Marco Leon</p>
                </div>
                <div>
                    <h3>Activity</h3>
                    <p>Updated 18 min ago</p>
                </div>
            </div>
        </div>
    );
}

export default CourseInformation;
