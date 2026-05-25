import dotenv from "dotenv";

dotenv.config();

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";

function getOutputText(response) {
    if (response.output_text) return response.output_text;

    const output = response.output ?? [];

    return output
        .flatMap((item) => item.content ?? [])
        .filter((content) => content.type === "output_text")
        .map((content) => content.text)
        .join("\n")
        .trim();
}

export async function askOpenAi({ instructions, input, maxOutputTokens }) {
    if (!process.env.OPENAI_API_KEY) {
        dotenv.config();
    }

    const apiKey = process.env.OPENAI_API_KEY?.trim();
    const model = process.env.OPENAI_MODEL || "gpt-5-nano";
    const requestBody = {
        model,
        instructions,
        input,
        max_output_tokens: Number(maxOutputTokens ?? process.env.OPENAI_MAX_OUTPUT_TOKENS ?? 500),
        store: false
    };

    if (model.startsWith("gpt-5")) {
        requestBody.reasoning = { effort: "minimal" };
    }

    if (!apiKey) return null;

    const response = await fetch(OPENAI_RESPONSES_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(result?.error?.message || "OpenAI request failed");
    }

    return {
        text: getOutputText(result),
        model
    };
}
