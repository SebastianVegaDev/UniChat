import "./CourseActionCard.css";
import { ChevronRight } from "lucide-react";
import { NavLink } from "react-router-dom";

function CourseActionCard({ icon: Icon, route, title, description, variant = "default" }) {
    return (
        <NavLink to={route} className={`course-action-card course-action-card-${variant}`}>
            <div className="course-action-card-info">
                <span className="course-action-card-icon">
                    <Icon />
                </span>

                <div>
                    <p>{title}</p>
                    <span>{description}</span>
                </div>
            </div>

            <ChevronRight className="course-action-card-arrow" />
        </NavLink>
    );
}

export default CourseActionCard;