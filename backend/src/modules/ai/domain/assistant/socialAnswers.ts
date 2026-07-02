import type { AiIntent } from "../../types/ai.types.js";

export function getSocialAnswer(intent: AiIntent): string {
    if (intent === "gratitude") {
        return "De nada, para eso estamos. Cuando quieras, te ayudo con exámenes, tareas, recursos o tu próxima clase.";
    }

    if (intent === "farewell") {
        return "Hasta luego, mucho éxito con tus cursos.";
    }

    if (intent === "greeting") {
        return "Hola, qué necesitas. Cuéntame de exámenes, tareas, recursos o tu próxima clase.";
    }

    return "";
}
