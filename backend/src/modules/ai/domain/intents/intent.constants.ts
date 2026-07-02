export const EVENT_TYPE_KEYWORDS = {
    assignment: ["tarea", "tareas", "trabajo", "trabajos", "entrega", "entregas", "proyecto"],
    exam: ["examen", "examenes", "parcial", "final", "practica calificada", "pc", "evaluacion", "evaluaciones", "quiz", "quizzes"],
    reminder: ["recordatorio", "recordatorios", "recordar"],
    announcement: ["anuncio", "anuncios", "aviso", "avisos", "comunicado"]
};

export const NEXT_CLASS_KEYWORDS = [
    "proxima clase",
    "proximo curso",
    "siguiente clase",
    "siguiente sesion",
    "clase siguiente",
    "para la clase",
    "para mi clase"
];

export const RESOURCE_KEYWORDS = [
    "recurso",
    "recursos",
    "pdf",
    "pdfs",
    "archivo",
    "archivos",
    "material",
    "materiales",
    "diapositiva",
    "diapositivas"
];

export const STUDY_HELP_KEYWORDS = [
    "explica",
    "explicame",
    "ensename",
    "ayudame a entender",
    "que es",
    "como funciona",
    "resumen de",
    "estudiar",
    "repasar"
];

export const PREFERENCE_KEYWORDS = [
    "preferencia",
    "preferencias",
    "configuracion",
    "color",
    "colores",
    "paleta",
    "fondo",
    "wallpaper",
    "idioma",
    "tamano de texto",
    "tamaño de texto"
];

export const CHAT_HELP_KEYWORDS = [
    "chat",
    "mensaje",
    "mensajes",
    "fijado",
    "fijar",
    "reaccion",
    "reacciones",
    "canal"
];

export const GRATITUDE_KEYWORDS = [
    "gracias",
    "muchas gracias",
    "thanks",
    "thank you",
    "te agradezco"
];

export const FAREWELL_KEYWORDS = [
    "adios",
    "adiós",
    "chau",
    "chao",
    "hasta luego",
    "nos vemos",
    "bye"
];

export const GREETING_KEYWORDS = [
    "hola",
    "buenas",
    "buenos dias",
    "buenos días",
    "buenas tardes",
    "buenas noches"
];

export const FOLLOW_UP_KEYWORDS = [
    "y en",
    "solo",
    "tambien",
    "también",
    "mas especifico",
    "más especifico",
    "mas específico",
    "más específico",
    "ahora",
    "ese curso",
    "este curso"
];

export const FOLLOWABLE_INTENTS = new Set<FollowableIntent>(["exams", "tasks", "events", "resources"]);

export const GENERIC_QUERY_WORDS = new Set([
    "a",
    "al",
    "algo",
    "algun",
    "alguna",
    "algunos",
    "algunas",
    "con",
    "cual",
    "cuales",
    "cuando",
    "de",
    "del",
    "dime",
    "donde",
    "el",
    "en",
    "es",
    "esta",
    "este",
    "fecha",
    "hay",
    "la",
    "las",
    "lo",
    "los",
    "mes",
    "mi",
    "mis",
    "para",
    "pendiente",
    "pendientes",
    "por",
    "que",
    "se",
    "su",
    "sus",
    "tal",
    "tengo",
    "tienes",
    "tu",
    "tus",
    "un",
    "una",
    "universidad",
    "clase"
]);
import type { FollowableIntent } from "../../types/ai.types.js";
