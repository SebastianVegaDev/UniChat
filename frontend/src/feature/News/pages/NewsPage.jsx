import SectionLayout from "../../../shared/ui/layouts/section/SectionLayout.jsx";
import SectionHero from "../../../shared/ui/heroes/section/SectionHero.jsx";
import NewsContent from "../../../shared/ui/content/news/NewsContent.jsx";

function NewsPage() {
    return (
        <SectionLayout>
            <SectionHero
                title={"News"}
                description={"Announcements published by offices and academic departments."}
            />
            <NewsContent/>
        </SectionLayout>
    );
}

export default NewsPage;