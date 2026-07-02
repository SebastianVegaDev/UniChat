import SectionLayout from "../../../shared/ui/layouts/section/SectionLayout.jsx";
import SectionHero from "../../../shared/ui/heroes/section/SectionHero.jsx";
import LoadingLayout from "../../../shared/ui/layouts/loading/LoadingLayout.jsx";
import NewsContent from "../components/NewsContent.jsx";
import { useBootstrap } from "../../bootstrap/hooks/useBootstrap.js";
import { mapNewsData } from "../mappers/news.mapper.js";
import { usePreferenceTexts } from "../../preferences/context/PreferencesContext.js";

function NewsPage() {
    const { data, isLoading, error } = useBootstrap();
    const texts = usePreferenceTexts();

    if (isLoading) return <LoadingLayout />;
    if (error) return <p>{error}</p>;

    const newsData = mapNewsData(data, texts);
    const { hero, news } = newsData;

    return (
        <SectionLayout>
            <SectionHero
                eyebrow={hero.eyebrow}
                title={hero.title}
                description={hero.description}
            />

            <NewsContent news={news} />
        </SectionLayout>
    );
}

export default NewsPage;