    import "./ChatMessageOptions.css";
import { Copy, Pin, Trash2 } from "lucide-react";

function ChatMessageOptions({ body, isMyMessage, closeOptions,currentUser }) {
    async function copyMessage() {
        await navigator.clipboard.writeText(body);
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
                        <button type="button" onClick={closeOptions}>
                            <Pin />
                            Fijar
                        </button> : null
                    }
                    <button type="button" onClick={closeOptions}>
                        <Trash2 />
                        Eliminar
                    </button>
                </>
            )}
        </div>
    );
}

export default ChatMessageOptions;
