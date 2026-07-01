import { normalizeText } from "./textNormalizer.js";

export function includesAny(cleanQuestion, keywords) {
    return keywords.some((keyword) => cleanQuestion.includes(keyword));
}

export function includesToken(cleanQuestion, token) {
    if (!token) return false;

    return cleanQuestion
        .split(/\s+/)
        .filter(Boolean)
        .includes(token);
}

export function getWordCount(cleanQuestion) {
    return cleanQuestion.split(/\s+/).filter(Boolean).length;
}

export function getQuestionTokens(question) {
    return normalizeText(question)
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((word) => word.length > 2);
}

export function getTextMatchScore(value, tokens) {
    const cleanValue = normalizeText(value ?? "");

    return tokens.reduce((score, token) => {
        return cleanValue.includes(token) ? score + 1 : score;
    }, 0);
}