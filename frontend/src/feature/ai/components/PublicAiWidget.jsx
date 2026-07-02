import "./PublicAiWidget.css";
import { useEffect, useRef, useState } from "react";
import { askAiResources } from "../api/ai.api.js";
import { useAiSpeech } from "../hooks/useAiSpeech.js";
import AiWidgetButton from "./AiWidgetButton.jsx";
import AiWidgetPanel from "./AiWidgetPanel.jsx";
import { getCachedAiMessages, saveCachedAiMessages } from "../helpers/aiChatCache.js";
import {
    INITIAL_AI_MESSAGE,
    createAiErrorMessage,
    createBotAiMessage,
    createUserAiMessage,
    getRecentAiHistory
} from "../helpers/aiMessages.js";

function PublicAiWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState(() => getCachedAiMessages());
    const [question, setQuestion] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const widgetRef = useRef(null);
    const messagesEndRef = useRef(null);
    const {
        speakingMessageId,
        speakMessage,
        stopSpeech
    } = useAiSpeech();

    function scrollToBottom() {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    function openWidget() {
        stopSpeech();

        if (messages.length === 0) {
            setMessages([INITIAL_AI_MESSAGE]);
        }

        setQuestion("");
        setIsOpen(true);
    }

    function closeWidget() {
        stopSpeech();
        setIsOpen(false);
    }

    async function submitQuestion(event) {
        event.preventDefault();

        const cleanQuestion = question.trim();

        if (!cleanQuestion || isLoading) return;

        const history = getRecentAiHistory(messages);
        const userMessage = createUserAiMessage(cleanQuestion);

        setMessages((currentMessages) => [...currentMessages, userMessage]);
        setQuestion("");
        setIsLoading(true);

        try {
            const result = await askAiResources({
                question: cleanQuestion,
                history
            });

            setMessages((currentMessages) => [
                ...currentMessages,
                createBotAiMessage(result)
            ]);
        } catch (error) {
            setMessages((currentMessages) => [
                ...currentMessages,
                createAiErrorMessage(error)
            ]);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    useEffect(() => {
        saveCachedAiMessages(messages);
    }, [messages]);

    useEffect(() => {
        if (!isOpen) return;

        function closeOnOutsideClick(event) {
            if (!widgetRef.current?.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", closeOnOutsideClick);

        return () => {
            document.removeEventListener("mousedown", closeOnOutsideClick);
        };
    }, [isOpen]);

    return (
        <div className="public-ai-widget" ref={widgetRef}>
            {isOpen && (
                <AiWidgetPanel
                    closeWidget={closeWidget}
                    messages={messages}
                    isLoading={isLoading}
                    messagesEndRef={messagesEndRef}
                    speakingMessageId={speakingMessageId}
                    speakMessage={speakMessage}
                    question={question}
                    setQuestion={setQuestion}
                    submitQuestion={submitQuestion}
                />
            )}

            <AiWidgetButton
                isOpen={isOpen}
                openWidget={openWidget}
                closeWidget={closeWidget}
            />
        </div>
    );
}

export default PublicAiWidget;