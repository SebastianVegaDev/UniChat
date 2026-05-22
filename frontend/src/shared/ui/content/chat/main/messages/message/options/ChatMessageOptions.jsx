import "./ChatMessageOptions.css";
import { Copy, Pin, Trash2 } from "lucide-react";

function ChatMessageOptions({ body, messageId, channelId, isMyMessage, closeOptions, currentUser, handleSetFixedMessage, handleDeleteMessage }) {
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
                Copiar
            </button>
            {isMyMessage && (
                <>
                    { currentUser.role === "teacher" ?
                        <button type="button" onClick={setFixedMessage}>
                            <Pin />
                            Fijar
                        </button> : null
                    }
                    <button type="button" onClick={deleteMessage}>
                        <Trash2 />
                        Eliminar
                    </button>
                </>
            )}
        </div>
    );
}

export default ChatMessageOptions;
