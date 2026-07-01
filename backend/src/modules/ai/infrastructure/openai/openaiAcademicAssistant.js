import { getAiFallbackAnswer } from "../../domain/assistant/fallbackAnswers.js";
import { askOpenAi } from "./openai.client.js";

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

export async function answerWithOpenAi({ question, analysis, context, maxOutputTokens = 300 }) {
    const result = await askOpenAi({
        maxOutputTokens,
        instructions: ACADEMIC_ASSISTANT_INSTRUCTIONS,
        input: buildAcademicAnswerInput({ question, analysis, context })
    }).catch(() => null);

    return result?.text || getAiFallbackAnswer(analysis.currentIntent);
}

export async function createResourceDefinitionWithOpenAi(resourceInfo) {
    return askOpenAi({
        maxOutputTokens: 260,
        instructions: RESOURCE_DEFINITION_INSTRUCTIONS,
        input: resourceInfo
    }).catch(() => null);
}

function buildAcademicAnswerInput({ question, analysis, context }) {
    return [
        `INTENCION: ${analysis.currentIntent}`,
        context ? `CONTEXTO:\n${context}` : "",
        `PREGUNTA: ${question}`
    ].filter(Boolean).join("\n\n");
}