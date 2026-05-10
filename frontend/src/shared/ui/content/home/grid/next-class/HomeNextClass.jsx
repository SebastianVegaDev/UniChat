import "./HomeNextClass.css";
import { useNavigate } from "react-router-dom";

function HomeNextClass({nextClass}) {
    const navigate = useNavigate();
    return (
        <div className="home-grid-next-class">
            <h3>Next Class</h3>
            <h2>{nextClass.title}</h2>
            <p>{nextClass.startTime} - {nextClass.endTime} · {nextClass.classroom} · {nextClass.teacher}</p>
            <button onClick={() => { navigate(nextClass.route) }}>Open Course</button>
        </div>
    );
}

export default HomeNextClass;
