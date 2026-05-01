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
                        <p className="home-grid-class-course">Diseno X</p>
                        <p className="home-grid-class-description">Revision de avances</p>
                    </div>
                </div>
                <div className="home-grid-class-badges">
                    <p className="home-grid-class-classroom">Aula 405</p>
                    <p className="home-grid-class-state">Ahora</p>
                </div>
            </div>
        </div>
    );
}

export default HomeClasses;
