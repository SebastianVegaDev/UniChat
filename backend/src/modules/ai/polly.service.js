import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";

const DEFAULT_VOICE_ID = "Enrique";
const DEFAULT_OUTPUT_FORMAT = "mp3";
const DEFAULT_SAMPLE_RATE = "24000";

function getPollyClient() {
    return new PollyClient({
        region: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "us-east-1"
    });
}

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
    const outputFormat = process.env.AWS_POLLY_OUTPUT_FORMAT || DEFAULT_OUTPUT_FORMAT;
    const command = new SynthesizeSpeechCommand({
        Text: text,
        TextType: "text",
        Engine: engine,
        VoiceId: process.env.AWS_POLLY_VOICE_ID || DEFAULT_VOICE_ID,
        OutputFormat: outputFormat,
        SampleRate: process.env.AWS_POLLY_SAMPLE_RATE || DEFAULT_SAMPLE_RATE
    });
    const response = await getPollyClient().send(command);
    const audioBuffer = await streamToBuffer(response.AudioStream);

    return {
        audioBase64: audioBuffer.toString("base64"),
        contentType: getContentType(outputFormat),
        engine,
        voiceId: process.env.AWS_POLLY_VOICE_ID || DEFAULT_VOICE_ID
    };
}

export async function synthesizeSpeechService({ text }) {
    const preferredEngine = process.env.AWS_POLLY_ENGINE || "neural";
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
