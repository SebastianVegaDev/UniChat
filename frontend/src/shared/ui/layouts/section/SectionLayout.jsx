import "./SectionLayout.css";
import SectionContent from "../../content/home/HomeContent.jsx";
import SectionHero from "../../heroes/section/SectionHero.jsx";

function SectionLayout({ title, description }) {
    return (
        <div className="section-layout">
            <SectionHero
                title={title}
                description={description}
            />
            <SectionContent />
        </div>
    );
}

export default SectionLayout;
