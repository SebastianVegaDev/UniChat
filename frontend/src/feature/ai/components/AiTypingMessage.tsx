import "./AiTypingMessage.css";
import { Loader } from "lucide-react";

function AiTypingMessage() {
    return (
        <div className="ai-message-wrapper bot">
            <p className="ai-message bot ai-typing-message">
                <Loader className="ai-typing-spinner" />
                <span>Pensando...</span>
            </p>
        </div>
    );
}

export default AiTypingMessage;