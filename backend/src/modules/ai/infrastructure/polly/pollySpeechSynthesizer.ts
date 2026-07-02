import { SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import type { Engine, OutputFormat, VoiceId } from "@aws-sdk/client-polly";
import type { Readable } from "node:stream";
import { createPollyClient } from "./polly.client.js";
import { env } from "../../../../config/env.js";

const DEFAULT_VOICE_ID = "Enrique";
const DEFAULT_OUTPUT_FORMAT = "mp3";
const DEFAULT_SAMPLE_RATE = "24000";

interface SynthesizeWithEngineInput {
    text: string;
    engine: Engine;
}

interface PollySpeechResult {
    audioBase64: string;
    contentType: string;
    engine: Engine;
    voiceId: VoiceId;
}

async function streamToBuffer(stream: AsyncIterable<Uint8Array> | Readable | undefined): Promise<Buffer> {
    const chunks: Buffer[] = [];

    if (!stream) return Buffer.alloc(0);

    for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
    }

    return Buffer.concat(chunks);
}

function getContentType(outputFormat: OutputFormat): string {
    if (outputFormat === "ogg_vorbis") return "audio/ogg";
    if (outputFormat === "pcm") return "audio/pcm";

    return "audio/mpeg";
}

async function synthesizeWithEngine({ text, engine }: SynthesizeWithEngineInput): Promise<PollySpeechResult> {
    const outputFormat = env.aws.polly.outputFormat as OutputFormat;
    const voiceId = env.aws.polly.voiceId as VoiceId;
    const command = new SynthesizeSpeechCommand({
        Text: text,
        TextType: "text",
        Engine: engine,
        VoiceId: voiceId,
        OutputFormat: outputFormat,
        SampleRate: env.aws.polly.sampleRate
    });
    const response = await createPollyClient().send(command);
    const audioBuffer = await streamToBuffer(
        response.AudioStream as AsyncIterable<Uint8Array> | undefined
    );

    return {
        audioBase64: audioBuffer.toString("base64"),
        contentType: getContentType(outputFormat),
        engine,
        voiceId
    };
}

export async function synthesizeSpeechWithPolly({ text }: { text: string }): Promise<PollySpeechResult> {
    const preferredEngine = env.aws.polly.engine as Engine;
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
