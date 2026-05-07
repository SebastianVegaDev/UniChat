import SectionLayout from "../../../shared/ui/layouts/section/SectionLayout.jsx";
import SectionHero from "../../../shared/ui/heroes/section/SectionHero.jsx";
import NewsContent from "../../../shared/ui/content/news/NewsContent.jsx";
import { hero, news } from "../db/news.db.json";

function NewsPage() {
    return (
        <SectionLayout>
            <SectionHero
                eyebrow={hero.eyebrow}
                title={hero.title}
                description={hero.description}
            />
            <NewsContent
                news={news}
            />
        </SectionLayout>
    );
}

export default NewsPage;
