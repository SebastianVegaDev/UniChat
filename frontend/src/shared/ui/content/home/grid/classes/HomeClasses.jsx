import "./HomeClasses.css";

function HomeClasses() {
    return (
        <div className="home-grid-classes">
            <p>Classes</p>
            <div className="home-grid-class">
                <div className="home-grid-class-info">
                    <div>
                        <p className="home-grid-class-time">08:00 - 09:40</p>
                    </div>
                    <div>
                        <p className="home-grid-class-course">X Design</p>
                        <p className="home-grid-class-description">Progress review</p>
                    </div>
                </div>
                <div className="home-grid-class-badges">
                    <p className="home-grid-class-classroom">Room 405</p>
                    <p className="home-grid-class-state">Now</p>
                </div>
            </div>
        </div>
    );
}

export default HomeClasses;
