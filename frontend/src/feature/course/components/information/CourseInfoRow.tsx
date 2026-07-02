import "./CourseInfoRow.css";

function CourseInfoRow({ label, value }) {
    return (
        <div className="course-info-row">
            <h4>{label}</h4>
            <p>{value}</p>
        </div>
    );
}

export default CourseInfoRow;