import { getAiFallbackAnswer } from "../../domain/assistant/fallbackAnswers.js";
import { askOpenAi } from "./openai.client.js";
import type { QuestionAnalysis } from "../../types/ai.types.js";

const ACADEMIC_ASSISTANT_INSTRUCTIONS = [
    "Eres el asistente academico de UniChat.",
    "Responde en espanol, corto y directo.",
    "Usa el contexto solo si ayuda a responder la pregunta actual.",
    "No mezcles recursos, tareas, examenes o eventos si el usuario no los pidio.",
    "Si la pregunta es de estudio, explica simple para un estudiante nuevo.",
    "Si no tienes datos suficientes, dilo con honestidad."
].join(" ");

const RESOURCE_DEFINITION_INSTRUCTIONS = [
    "Eres un asistente academico de UniChat.",
    "Crea una definicion clara y reutilizable del recurso para estudiantes nuevos.",
    "Usa solo la metadata enviada. No inventes contenido que no aparece.",
    "Incluye para que sirve, tema probable, curso y semana.",
    "Respuesta en espanol, breve y facil de entender."
].join(" ");

interface AcademicAnswerInput {
    question: string;
    analysis: QuestionAnalysis;
    context: string;
    maxOutputTokens?: number;
}

export async function answerWithOpenAi({
    question,
    analysis,
    context,
    maxOutputTokens = 300
}: AcademicAnswerInput): Promise<string> {
    const result = await askOpenAi({
        maxOutputTokens,
        instructions: ACADEMIC_ASSISTANT_INSTRUCTIONS,
        input: buildAcademicAnswerInput({ question, analysis, context })
    }).catch(() => null);

    return result?.text || getAiFallbackAnswer(analysis.currentIntent);
}

export async function createResourceDefinitionWithOpenAi(resourceInfo: string): ReturnType<typeof askOpenAi> {
    return askOpenAi({
        maxOutputTokens: 260,
        instructions: RESOURCE_DEFINITION_INSTRUCTIONS,
        input: resourceInfo
    }).catch(() => null);
}

function buildAcademicAnswerInput({ question, analysis, context }: AcademicAnswerInput): string {
    return [
        `INTENCION: ${analysis.currentIntent}`,
        context ? `CONTEXTO:\n${context}` : "",
        `PREGUNTA: ${question}`
    ].filter(Boolean).join("\n\n");
}
