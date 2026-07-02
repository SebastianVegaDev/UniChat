import { env } from "../../../../config/env.js";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";

interface OpenAiOutputContent {
    type?: string;
    text?: string;
}

interface OpenAiOutputItem {
    content?: OpenAiOutputContent[];
}

interface OpenAiResponseJson {
    output_text?: string;
    output?: OpenAiOutputItem[];
}

interface AskOpenAiInput {
    instructions: string;
    input: unknown;
    maxOutputTokens?: number;
}

interface AskOpenAiResult {
    text: string;
    model: string;
}

function getOutputText(response: OpenAiResponseJson | null): string {
    if (response?.output_text) return response.output_text;

    const output = response?.output ?? [];

    return output
        .flatMap((item) => item.content ?? [])
        .filter((content) => content.type === "output_text")
        .map((content) => content.text ?? "")
        .join("\n")
        .trim();
}

type OpenAiRequestBody = {
    model: string;
    instructions: unknown;
    input: unknown;
    max_output_tokens: number;
    store: boolean;
    reasoning?: {
        effort: "minimal";
    };
};

type OpenAiErrorResponse = {
    error?: {
        message?: string;
    };
};

function buildOpenAiRequestBody({ instructions, input, maxOutputTokens }: AskOpenAiInput): OpenAiRequestBody {
    const model = env.openAi.model;
    const requestBody: OpenAiRequestBody = {
        model,
        instructions,
        input,
        max_output_tokens: Number(maxOutputTokens ?? env.openAi.maxOutputTokens),
        store: false
    };

    if (model.startsWith("gpt-5")) {
        requestBody.reasoning = { effort: "minimal" };
    }

    return requestBody;
}

export async function askOpenAi({
    instructions,
    input,
    maxOutputTokens
}: AskOpenAiInput): Promise<AskOpenAiResult | null> {
    const apiKey = env.openAi.apiKey;

    if (!apiKey) return null;

    const requestBody = buildOpenAiRequestBody({
        instructions,
        input,
        maxOutputTokens
    });

    const response = await fetch(OPENAI_RESPONSES_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
    });

    const result = await response.json().catch(() => null) as (OpenAiErrorResponse & OpenAiResponseJson) | null;

    if (!response.ok) {
        throw new Error(result?.error?.message || "OpenAI request failed");
    }

    return {
        text: getOutputText(result),
        model: requestBody.model
    };
}
