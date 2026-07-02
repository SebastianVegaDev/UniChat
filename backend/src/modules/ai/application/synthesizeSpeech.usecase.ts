import { synthesizeSpeechWithPolly } from "../infrastructure/polly/pollySpeechSynthesizer.js";

interface SynthesizeSpeechInput {
    text: string;
}

export async function synthesizeSpeechUseCase({ text }: SynthesizeSpeechInput): Promise<{
    provider: "amazon-polly";
    audioBase64: string;
    contentType: string;
    engine: string;
    voiceId: string;
}> {
    const result = await synthesizeSpeechWithPolly({ text });

    return {
        provider: "amazon-polly",
        ...result
    };
}
