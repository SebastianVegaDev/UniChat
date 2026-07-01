import { synthesizeSpeechWithPolly } from "../infrastructure/polly/pollySpeechSynthesizer.js";

export async function synthesizeSpeechUseCase({ text }) {
    const result = await synthesizeSpeechWithPolly({ text });

    return {
        provider: "amazon-polly",
        ...result
    };
}