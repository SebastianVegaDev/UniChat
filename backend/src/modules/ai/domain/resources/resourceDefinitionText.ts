import type { AiResource } from "../../types/ai.types.js";

export function getResourceInfo(resource: AiResource): string {
    return [
        `Curso: ${resource.courseTitle}`,
        `Semana: ${resource.weekNumber}`,
        `Recurso: ${resource.title}`,
        `Tipo: ${resource.kind}`,
        `Archivo: ${resource.fileUrl}`
    ].join("\n");
}

export function buildFallbackDefinition(resource: AiResource): string {
    return [
        `El recurso "${resource.title}" pertenece al curso "${resource.courseTitle}" y a la semana ${resource.weekNumber}.`,
        `Es un material de tipo ${resource.kind}.`,
        "Todavia no tiene una definicion generada con IA porque falta configurar OPENAI_API_KEY."
    ].join(" ");
}

export function buildDefinitionsContext(resources: readonly AiResource[], definitions: readonly string[]): string {
    if (resources.length === 0) return "";

    const resourcesContext = resources.map((resource, index) => {
        return [
            `${resource.title} (Semana ${resource.weekNumber})`,
            `Curso: ${resource.courseTitle}`,
            `Resumen: ${definitions[index]}`
        ].join("\n");
    }).join("\n---\n");

    return `## RECURSOS\n${resourcesContext}`;
}
