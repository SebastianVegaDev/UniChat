import { filterResourcesByAnalysis } from "./resourceSelector.js";
import type { AiResource, QuestionAnalysis } from "../../types/ai.types.js";

export function buildResourcesAnswer(resources: readonly AiResource[], analysis: QuestionAnalysis): string {
    const filteredResources = filterResourcesByAnalysis(resources, analysis);
    const courseSuffix = analysis.courseFilter?.courseTitle ? ` de ${analysis.courseFilter.courseTitle}` : "";

    if (filteredResources.length === 0) {
        return `No tienes recursos disponibles${analysis.courseFilter ? " en este curso" : ""}.`;
    }

    const lines = filteredResources.slice(0, 6).map((resource) => {
        return `- Semana ${resource.weekNumber}: ${resource.title}`;
    });
    const extraCount = filteredResources.length - lines.length;

    if (extraCount > 0) {
        lines.push(`- Y ${extraCount} recursos mas.`);
    }

    return [`Estos son tus recursos${courseSuffix}:`, ...lines].join("\n");
}
