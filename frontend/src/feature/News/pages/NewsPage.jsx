import SectionLayout from "../../../shared/ui/layouts/section/SectionLayout.jsx";
import SectionHero from "../../../shared/ui/heroes/section/SectionHero.jsx";
import NewsContent from "../../../shared/ui/content/news/NewsContent.jsx";
import { useBootstrapData } from "../../bootstrap/hooks/useBootstrapData.js";
import { mapNewsData } from "../mappers/news.mapper.js";

function NewsPage() {
    const { data, isLoading, error } = useBootstrapData();

    if (isLoading) return <p>Loading...</p>
    if (error) return <p>{error}</p>

    const calendarData = mapNewsData(data);
    const { hero, news } = calendarData

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
