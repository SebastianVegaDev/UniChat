import SectionLayout from "../../../shared/ui/layouts/section/SectionLayout.jsx";
import SectionHero from "../../../shared/ui/heroes/section/SectionHero.jsx";
import CourseChatContent from "../../../shared/ui/content/course-chat/CourseChatContent.jsx";

function CourseChatPage() {
    return (
        <SectionLayout>
            <SectionHero
                eyebrow={"Chat"}
                title={"Course Chat"}
                description={"Course conversations, channels, and class messages."}
            />
            <CourseChatContent />
        </SectionLayout>
    );
}

export default CourseChatPage;
