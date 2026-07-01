export const EVENT_TYPE_LABELS = {
    assignment: "Tarea",
    exam: "Examen",
    reminder: "Recordatorio",
    announcement: "Anuncio",
    other: "Evento"
};

export function getEventTypeLabel(eventType) {
    return EVENT_TYPE_LABELS[eventType] ?? EVENT_TYPE_LABELS.other;
}