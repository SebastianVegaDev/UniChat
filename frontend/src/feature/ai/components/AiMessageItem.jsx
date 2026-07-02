import "./AiMessageItem.css";
import { Volume2 } from "lucide-react";
import IconButton from "../../../shared/ui/primitives/icon-button/IconButton.jsx";
import AiResourceList from "./AiResourceList.jsx";

function AiMessageItem({ message, speakingMessageId, speakMessage }) {
    const isBotMessage = message.type === "bot";
    const isSpeaking = speakingMessageId === message.id;

    function handleSpeechClick(event) {
        event.preventDefault();
        event.stopPropagation();
        speakMessage(message);
    }

    return (
        <div className={`ai-message-wrapper ${message.type}`}>
            <div className={`ai-message-row ${message.type}`}>
                <p className={`ai-message ${message.type}`}>
                    {message.body}
                </p>

                {isBotMessage && (
                    <IconButton
                        icon={Volume2}
                        label={isSpeaking ? "Detener voz" : "Hablar"}
                        size="sm"
                        variant="soft"
                        className={`ai-message-speech ${isSpeaking ? "speaking" : ""}`}
                        onMouseDown={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                        }}
                        onPointerDown={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                        }}
                        onClick={handleSpeechClick}
                    />
                )}
            </div>

            <AiResourceList resources={message.resources} />
        </div>
    );
}

export default AiMessageItem;