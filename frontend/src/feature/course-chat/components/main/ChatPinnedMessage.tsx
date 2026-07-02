import "./ChatPinnedMessage.css";
import { usePreferenceTexts } from "../../../preferences/context/PreferencesContext.js";

function ChatPinnedMessage({ pinnedMessage, goToPinnedMessage }) {
    const { chat } = usePreferenceTexts();

    return (
        <button className="chat-pinned-message" type="button" onClick={goToPinnedMessage}>
            <span>{chat.pinnedMessage}</span>
            <p>{pinnedMessage.body}</p>
        </button>
    );
}

export default ChatPinnedMessage;