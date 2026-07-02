import type { AiIntent } from "../../types/ai.types.js";
import type { CourseFilter } from "../../../../shared/types/domain.types.js";

export function getAiFallbackAnswer(intent: AiIntent): string {
    if (intent === "preferences") {
        return "Puedo ayudarte con preferencias, pero no tengo acciones directas desde este chat. Abre el panel de preferencias para cambiar idioma, colores, fondo o tamano de texto.";
    }

    if (intent === "chat_help") {
        return "Puedo orientarte sobre el chat, pero no tengo suficientes datos para cambiar mensajes desde aqui.";
    }

    return "No estoy seguro con los datos actuales. Prueba preguntando por un curso, recurso, tarea o examen especifico.";
}

export function getAmbiguousCourseAnswer(courseFilter: CourseFilter | null): string {
    const courseName = courseFilter?.courseTitle ? ` de ${courseFilter.courseTitle}` : "";

    return `No sé bien si buscas exámenes, tareas o recursos${courseName}. Cuéntame exactamente qué necesitas, por ejemplo "exámenes de este curso" o "recursos de este curso".`;
}
