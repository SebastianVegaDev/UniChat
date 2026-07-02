import "./AiWidgetPanel.css";
import { Bot, X } from "lucide-react";
import IconButton from "../../../shared/ui/primitives/icon-button/IconButton.jsx";
import AiMessageList from "./AiMessageList.jsx";
import AiQuestionForm from "./AiQuestionForm.jsx";

function AiWidgetPanel({ closeWidget, messages, isLoading, messagesEndRef, speakingMessageId, speakMessage, question, setQuestion, submitQuestion }) {
    return (
        <div className="ai-widget-panel">
            <header className="ai-widget-panel-header">
                <div>
                    <Bot />
                    <span>UniChat IA</span>
                </div>

                <IconButton
                    icon={X}
                    label="Cerrar"
                    size="sm"
                    variant="secondary"
                    onClick={closeWidget}
                />
            </header>

            <AiMessageList
                messages={messages}
                isLoading={isLoading}
                messagesEndRef={messagesEndRef}
                speakingMessageId={speakingMessageId}
                speakMessage={speakMessage}
            />

            <AiQuestionForm
                question={question}
                setQuestion={setQuestion}
                isLoading={isLoading}
                submitQuestion={submitQuestion}
            />
        </div>
    );
}

export default AiWidgetPanel;