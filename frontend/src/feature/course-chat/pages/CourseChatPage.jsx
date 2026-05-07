import SectionLayout from "../../../shared/ui/layouts/section/SectionLayout.jsx";
import ChatContent from "../../../shared/ui/content/chat/ChatContent.jsx";
import { course, channels, pinnedMessage, timeline, activeChannel } from "../db/courseChat.db.json";

function CourseChatPage() {
    return (
        <SectionLayout>
            <ChatContent 
                course={course}
                channels={channels}
                pinnedMessage={pinnedMessage}
                timeline={timeline}
                activeChannel={activeChannel}
            />
        </SectionLayout>
    );
}

export default CourseChatPage;
