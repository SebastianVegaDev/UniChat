import { SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import { createPollyClient } from "./polly.client.js";
import { env } from "../../../../config/env.js";

const DEFAULT_VOICE_ID = "Enrique";
const DEFAULT_OUTPUT_FORMAT = "mp3";
const DEFAULT_SAMPLE_RATE = "24000";

async function streamToBuffer(stream) {
    const chunks = [];

    for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
    }

    return Buffer.concat(chunks);
}

function getContentType(outputFormat) {
    if (outputFormat === "ogg_vorbis") return "audio/ogg";
    if (outputFormat === "pcm") return "audio/pcm";

    return "audio/mpeg";
}

async function synthesizeWithEngine({ text, engine }) {
    const outputFormat = env.aws.polly.outputFormat;
    const voiceId = env.aws.polly.voiceId;
    const command = new SynthesizeSpeechCommand({
        Text: text,
        TextType: "text",
        Engine: engine,
        VoiceId: voiceId,
        OutputFormat: outputFormat,
        SampleRate: env.aws.polly.sampleRate
    });
    const response = await createPollyClient().send(command);
    const audioBuffer = await streamToBuffer(response.AudioStream);

    return {
        audioBase64: audioBuffer.toString("base64"),
        contentType: getContentType(outputFormat),
        engine,
        voiceId
    };
}

export async function synthesizeSpeechWithPolly({ text }) {
    const preferredEngine = env.aws.polly.engine
    const fallbackEngine = preferredEngine === "standard" ? "neural" : "standard";

    try {
        return await synthesizeWithEngine({
            text,
            engine: preferredEngine
        });
    } catch (error) {
        const canFallback = ["neural", "standard"].includes(preferredEngine);

        if (!canFallback) throw error;

        return await synthesizeWithEngine({
            text,
            engine: fallbackEngine
        });
    }
}