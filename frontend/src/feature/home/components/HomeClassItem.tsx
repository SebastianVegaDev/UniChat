import "./HomeClassItem.css";
import { Link } from "react-router-dom";
import StatusPill from "../../../shared/ui/primitives/status/StatusPill.jsx";

function HomeClassItem({ classItem }) {
    return (
        <Link to={classItem.route} className={`home-class-item home-class-item-${classItem.statusLabel}`}>
            <div className="home-class-item-main">
                <div className="home-class-item-time">
                    <strong>{classItem.startTime}</strong>
                    <span>{classItem.endTime}</span>
                </div>

                <div className="home-class-item-info">
                    <strong>{classItem.title}</strong>
                    <span>{classItem.topic}</span>
                </div>
            </div>

            <div className="home-class-item-badges">
                <StatusPill type="default">
                    {classItem.classroom}
                </StatusPill>

                <StatusPill type={classItem.statusLabel}>
                    {classItem.statusText}
                </StatusPill>
            </div>
        </Link>
    );
}

export default HomeClassItem;