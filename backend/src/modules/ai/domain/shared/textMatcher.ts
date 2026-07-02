import { normalizeText } from "./textNormalizer.js";

export function includesAny(cleanQuestion: string, keywords: readonly string[]): boolean {
    return keywords.some((keyword) => cleanQuestion.includes(keyword));
}

export function includesToken(cleanQuestion: string, token?: string | null): boolean {
    if (!token) return false;

    return cleanQuestion
        .split(/\s+/)
        .filter(Boolean)
        .includes(token);
}

export function getWordCount(cleanQuestion: string): number {
    return cleanQuestion.split(/\s+/).filter(Boolean).length;
}

export function getQuestionTokens(question: string): string[] {
    return normalizeText(question)
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((word) => word.length > 2);
}

export function getTextMatchScore(value: string | null | undefined, tokens: readonly string[]): number {
    const cleanValue = normalizeText(value ?? "");

    return tokens.reduce((score, token) => {
        return cleanValue.includes(token) ? score + 1 : score;
    }, 0);
}
