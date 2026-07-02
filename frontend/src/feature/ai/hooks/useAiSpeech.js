import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { fetchAiSpeech } from "../api/ai.api.js";
import { getAudioUrlFromBase64, getSpeechText } from "../helpers/aiSpeech.js";

export function useAiSpeech() {
    const [speakingMessageId, setSpeakingMessageId] = useState("");
    const audioRef = useRef(null);
    const audioUrlRef = useRef("");
    const pollyAudioCacheRef = useRef(new Map());
    const speechRequestIdRef = useRef(0);

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

    async function speakMessage(message) {
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
            const result = cachedAudio ?? await fetchAiSpeech(cleanText);
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

    useEffect(() => {
        return () => {
            speechRequestIdRef.current += 1;

            const audio = audioRef.current;

            if (audio) {
                audio.onended = null;
                audio.onerror = null;
                audio.pause();
                audio.removeAttribute("src");
                audio.load();
                audioRef.current = null;
            }

            if (audioUrlRef.current) {
                URL.revokeObjectURL(audioUrlRef.current);
                audioUrlRef.current = "";
            }
        };
    }, []);

    return {
        speakingMessageId,
        speakMessage,
        stopSpeech
    };
}