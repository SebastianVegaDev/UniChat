import SectionLayout from "../../../shared/ui/layouts/section/SectionLayout.jsx";
import SectionHero from "../../../shared/ui/heroes/section/SectionHero.jsx";
import NewsContent from "../../../shared/ui/content/news/NewsContent.jsx";
import LoadingLayout from "../../../shared/ui/layouts/loading/LoadingLayout.jsx";
import { useBootstrap } from "../../bootstrap/hooks/useBootstrap.js";
import { mapNewsData } from "../mappers/news.mapper.js";

function NewsPage() {
    const { data, isLoading, error } = useBootstrap();

    if (isLoading) return <LoadingLayout />;
    if (error) return <p>{error}</p>;

    const newsData = mapNewsData(data);
    const { hero, news } = newsData;

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
