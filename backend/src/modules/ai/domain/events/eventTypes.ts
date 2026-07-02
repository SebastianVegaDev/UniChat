import type { EventType } from "../../types/ai.types.js";

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
    assignment: "Tarea",
    exam: "Examen",
    reminder: "Recordatorio",
    announcement: "Anuncio",
    other: "Evento"
};

export function getEventTypeLabel(eventType: EventType): string {
    return EVENT_TYPE_LABELS[eventType] ?? EVENT_TYPE_LABELS.other;
}
