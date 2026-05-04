import SectionLayout from "../../../shared/ui/layouts/section/SectionLayout.jsx";
import SectionHero from "../../../shared/ui/heroes/section/SectionHero.jsx";
import HomeContent from "../../../shared/ui/content/home/HomeContent.jsx";

function HomePage() {
    return (
        <SectionLayout>
            <SectionHero
                eyebrow={"Welcome"}
                title={"My Day"}
                description={"Wednesday, Apr 29 · 4 enrolled courses · 1 class in progress"}
            />
            <HomeContent />
        </SectionLayout>
    );
}

export default HomePage;
<ho></ho>
