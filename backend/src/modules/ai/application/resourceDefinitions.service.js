import { buildFallbackDefinition, getResourceInfo } from "../domain/resources/resourceDefinitionText.js";
import { createResourceDefinitionWithOpenAi } from "../infrastructure/openai/openaiAcademicAssistant.js";
import { saveResourceDefinition } from "../repositories/resourceDefinitions.repository.js";

export async function getOrCreateDefinition(resource) {
    const hasBadFallback = resource.definition?.includes("falta configurar OPENAI_API_KEY");

    if (resource.definition && !hasBadFallback && resource.definitionModel !== "local-fallback") {
        return resource.definition;
    }

    const result = await createResourceDefinitionWithOpenAi(getResourceInfo(resource));
    const definition = result?.text || buildFallbackDefinition(resource);

    await saveResourceDefinition({
        resourceId: resource.id,
        definition,
        model: result?.text ? result.model : "local-fallback"
    });

    return definition;
}