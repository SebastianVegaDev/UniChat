import "./SectionHero.css";

function SectionHero({ title, description }) {
    return (
        <div className="section-hero">
            <p>Welcome!</p>
            <h2>{title}</h2>
            <span>{description}</span>
        </div>
    );
}

export default SectionHero;