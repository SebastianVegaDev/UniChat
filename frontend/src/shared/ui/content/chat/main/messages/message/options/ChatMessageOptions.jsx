import "./ChatMessageOptions.css";
import { Copy, Pin, Trash2 } from "lucide-react";
import { usePreferenceTexts } from "../../../../../../../../feature/preferences/context/PreferencesContext.js";

function ChatMessageOptions({ body, messageId, channelId, isMyMessage, closeOptions, currentUser, handleSetFixedMessage, handleDeleteMessage }) {
    const { chat } = usePreferenceTexts();

    async function copyMessage() {
        await navigator.clipboard.writeText(body);
        closeOptions();
    }

    function setFixedMessage() {
        handleSetFixedMessage({
            messageId,
            channelId
        });
        closeOptions();
    }

    function deleteMessage() {
        handleDeleteMessage({
            messageId
        });
        closeOptions();
    }

    return (
        <div className="chat-message-options">
            <button type="button" onClick={copyMessage}>
                <Copy />
                {chat.copy}
            </button>
            {isMyMessage && (
                <>
                    { currentUser.role === "teacher" ?
                        <button type="button" onClick={setFixedMessage}>
                            <Pin />
                            {chat.pin}
                        </button> : null
                    }
                    <button type="button" onClick={deleteMessage}>
                        <Trash2 />
                        {chat.delete}
                    </button>
                </>
            )}
        </div>
    );
}

export default ChatMessageOptions;
