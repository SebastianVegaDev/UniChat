import "./PublicAiWidget.css";
import { Bot, Send, X, Loader, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { apiPost } from "../../api/client.js";

const initialMessage = {
    id: "intro",
    type: "bot",
    body: "Hola, soy UniChat IA. Preguntame por recursos, tareas, examenes o tu proxima clase."
};
const AI_CHAT_CACHE_VERSION = 1;
const MAX_CACHED_MESSAGES = 40;

function getAiChatCacheKey() {
    try {
        const user = JSON.parse(localStorage.getItem("user") || "null");

        return `unichat_ai_chat_cache_${user?.id ?? "guest"}`;
    } catch {
        return "unichat_ai_chat_cache_guest";
    }
}

function normalizeCachedMessages(messages) {
    if (!Array.isArray(messages) || messages.length === 0) return [initialMessage];

    return messages
        .slice(-MAX_CACHED_MESSAGES)
        .map((message) => ({
            id: message.id || `${message.type ?? "bot"}-${Date.now()}`,
            type: message.type === "user" ? "user" : "bot",
            body: typeof message.body === "string" ? message.body : "",
            resources: Array.isArray(message.resources) ? message.resources : undefined,
            intent: typeof message.intent === "string" ? message.intent : undefined,
            courseFilter: message.courseFilter ?? null
        }))
        .filter((message) => message.body);
}

function getCachedMessages() {
    try {
        const cache = JSON.parse(localStorage.getItem(getAiChatCacheKey()) || "null");

        if (cache?.version !== AI_CHAT_CACHE_VERSION) return [initialMessage];

        return normalizeCachedMessages(cache.messages);
    } catch {
        localStorage.removeItem(getAiChatCacheKey());
        return [initialMessage];
    }
}

function saveCachedMessages(messages) {
    try {
        const cache = {
            version: AI_CHAT_CACHE_VERSION,
            savedAt: Date.now(),
            messages: normalizeCachedMessages(messages)
        };

        localStorage.setItem(getAiChatCacheKey(), JSON.stringify(cache));
    } catch {
        // If storage is unavailable, the chat still works for the current page session.
    }
}

function PublicAiWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState(() => getCachedMessages());
    const [question, setQuestion] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [speakingMessageId, setSpeakingMessageId] = useState("");
    const widgetRef = useRef(null);
    const messagesEndRef = useRef(null);
    const audioRef = useRef(null);
    const audioUrlRef = useRef("");
    const pollyAudioCacheRef = useRef(new Map());
    const speechRequestIdRef = useRef(0);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    useEffect(() => {
        saveCachedMessages(messages);
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

    function openWidget() {
        stopSpeech();
        if (messages.length === 0) {
            setMessages([initialMessage]);
        }
        setQuestion("");
        setIsOpen(true);
    }

    function getSpeechText(text = "") {
        return text
            .replace(/[*_`#>]/g, "")
            .replace(/^- /gm, "")
            .replace(/\n{2,}/g, ". ")
            .replace(/\n/g, ". ")
            .replace(/  +/g, " ")
            .trim()
            .split(/[.!?]+/)
            .map(s => s.trim())
            .filter(s => s.length > 0)
            .join(". ");
    }

    function revokeCurrentAudioUrl() {
        if (audioUrlRef.current) {
            URL.revokeObjectURL(audioUrlRef.current);
            audioUrlRef.current = "";
        }
    }

    function clearCurrentAudio({ resetSource = true } = {}) {
        const audio = audioRef.current;

        if (audio) {
            audio.onended = null;
            audio.onerror = null;

            if (resetSource) {
                audio.pause();
                audio.removeAttribute("src");
                audio.load();
            }

            audioRef.current = null;
        }

        revokeCurrentAudioUrl();
    }

    function stopSpeech() {
        speechRequestIdRef.current += 1;
        clearCurrentAudio();

        setSpeakingMessageId("");
    }

    function closeWidget() {
        stopSpeech();
        setIsOpen(false);
    }

    function speakMessage(message) {
        speakMessageWithPolly(message);
    }

    function getAudioUrlFromBase64(audioBase64, contentType = "audio/mpeg") {
        const byteCharacters = atob(audioBase64);
        const byteNumbers = Array.from(byteCharacters, (character) => character.charCodeAt(0));
        const byteArray = new Uint8Array(byteNumbers);
        const audioBlob = new Blob([byteArray], { type: contentType });

        return URL.createObjectURL(audioBlob);
    }

    async function playAudioUrl({ messageId, audioUrl, requestId }) {
        const audio = new Audio(audioUrl);

        audioRef.current = audio;
        audio.onended = () => {
            if (speechRequestIdRef.current !== requestId || audioRef.current !== audio) return;

            clearCurrentAudio({ resetSource: false });
            setSpeakingMessageId("");
        };
        audio.onerror = () => {
            if (speechRequestIdRef.current !== requestId || audioRef.current !== audio || audio.ended) return;

            const errorCode = audio.error?.code;
            clearCurrentAudio({ resetSource: false });
            setSpeakingMessageId("");

            if (errorCode !== 1) {
                toast.error("No pude reproducir el audio de Polly.");
            }
        };

        setSpeakingMessageId(messageId);
        await audio.play();
    }

    async function speakMessageWithPolly(message) {
        const cleanText = getSpeechText(message.body);

        if (!cleanText) return;

        if (speakingMessageId === message.id) {
            stopSpeech();
            return;
        }

        stopSpeech();

        const requestId = speechRequestIdRef.current + 1;
        speechRequestIdRef.current = requestId;

        try {
            const cachedAudio = pollyAudioCacheRef.current.get(cleanText);
            const result = cachedAudio ?? await apiPost("/ai/speech", {
                text: cleanText
            });
            const audioUrl = getAudioUrlFromBase64(result.audioBase64, result.contentType);

            if (speechRequestIdRef.current !== requestId) {
                URL.revokeObjectURL(audioUrl);
                return;
            }

            pollyAudioCacheRef.current.set(cleanText, result);
            audioUrlRef.current = audioUrl;
            await playAudioUrl({
                messageId: message.id,
                audioUrl,
                requestId
            });
        } catch {
            if (speechRequestIdRef.current === requestId) {
                toast.error("No pude generar o reproducir audio con Amazon Polly.");
                stopSpeech();
            }
        }
    }

    async function submitQuestion(event) {
        event.preventDefault();

        const cleanQuestion = question.trim();

        if (!cleanQuestion || isLoading) return;

        const history = messages.slice(-8).map((message) => ({
            type: message.type,
            body: message.body,
            intent: message.intent,
            courseFilter: message.courseFilter
        }));
        const userMessage = {
            id: `user-${Date.now()}`,
            type: "user",
            body: cleanQuestion
        };

        setMessages((currentMessages) => [...currentMessages, userMessage]);
        setQuestion("");
        setIsLoading(true);

        try {
            const result = await apiPost("/ai/resources/ask", {
                question: cleanQuestion,
                history
            });

            setMessages((currentMessages) => [
                ...currentMessages,
                {
                    id: `bot-${Date.now()}`,
                    type: "bot",
                    body: result.answer,
                    resources: result.resources,
                    intent: result.intent,
                    courseFilter: result.courseFilter
                }
            ]);
        } catch (error) {
            setMessages((currentMessages) => [
                ...currentMessages,
                {
                    id: `error-${Date.now()}`,
                    type: "bot",
                    body: "Error: " + (error.message || "No pude procesar tu pregunta. Intenta de nuevo.")
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="public-ai-widget" ref={widgetRef}>
            {isOpen && (
                <div className="public-ai-panel">
                    <div className="public-ai-header">
                        <div>
                            <Bot size={20} />
                            <span>UniChat IA</span>
                        </div>
                        <button type="button" onClick={closeWidget} className="close-btn">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="public-ai-messages">
                        {messages.map((message) => (
                            <div key={message.id} className={`public-ai-message-wrapper ${message.type}`}>
                                <div className={`public-ai-message-row ${message.type}`}>
                                    <p className={`public-ai-message ${message.type}`}>
                                        {message.body}
                                    </p>
                                    {message.type === "bot" && (
                                        <button
                                            type="button"
                                            className={`public-ai-speech-btn ${speakingMessageId === message.id ? "speaking" : ""}`}
                                            onMouseDown={(event) => {
                                                event.preventDefault();
                                                event.stopPropagation();
                                            }}
                                            onPointerDown={(event) => {
                                                event.preventDefault();
                                                event.stopPropagation();
                                            }}
                                            onClick={(event) => {
                                                event.preventDefault();
                                                event.stopPropagation();
                                                speakMessage(message);
                                            }}
                                            title={speakingMessageId === message.id ? "Detener voz" : "Hablar"}
                                            aria-label={speakingMessageId === message.id ? "Detener voz" : "Hablar"}
                                        >
                                            <Volume2 size={16} />
                                        </button>
                                    )}
                                </div>
                                {message.resources && message.resources.length > 0 && (
                                    <div className="public-ai-resources">
                                        <small>Recursos relacionados:</small>
                                        {message.resources.map((res) => (
                                            <small key={res.id} className="public-ai-resource-tag">
                                                {res.title}
                                            </small>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="public-ai-message-wrapper bot">
                                <p className="public-ai-message bot typing">
                                    <Loader size={16} className="spinner" />
                                    <span>Pensando...</span>
                                </p>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <form className="public-ai-composer" onSubmit={submitQuestion}>
                        <input
                            value={question}
                            disabled={isLoading}
                            placeholder="Pregunta por recursos, eventos o temas..."
                            onChange={(event) => setQuestion(event.target.value)}
                            className="ai-input"
                        />
                        <button type="submit" disabled={isLoading} className="ai-send-btn">
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}
            <button
                className="public-ai-launcher"
                type="button"
                onClick={() => {
                    if (isOpen) {
                        closeWidget();
                    } else {
                        openWidget();
                    }
                }}
                title="Asistente IA"
            >
                <img src="/ia.png" alt="IA" />
            </button>
        </div>
    );
}

export default PublicAiWidget;
