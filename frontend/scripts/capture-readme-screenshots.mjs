import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.UNICHAT_SCREENSHOT_URL ?? "http://localhost:5173";
const outputDir = path.resolve("../docs/screenshots");

function todayAt(hour, minute = 0) {
    const date = new Date();

    date.setHours(hour, minute, 0, 0);

    return date.toISOString();
}

function dayOffset(days, hour, minute = 0) {
    const date = new Date();

    date.setDate(date.getDate() + days);
    date.setHours(hour, minute, 0, 0);

    return date.toISOString();
}

function hoursFromNow(hours) {
    const date = new Date();

    date.setMinutes(0, 0, 0);
    date.setHours(date.getHours() + hours);

    return date.toISOString();
}

const adminUser = {
    id: 1,
    code: "00000001",
    firstName: "Admin",
    lastName: "UniChat",
    email: "admin@unichat.dev",
    role: "admin",
    createdAt: "2026-01-12T10:00:00.000Z"
};

const studentUser = {
    id: 3,
    code: "00000003",
    firstName: "Mateo",
    lastName: "Silva",
    email: "mateo.silva@unichat.dev",
    role: "student",
    avatarUrl: "",
    createdAt: "2026-02-03T08:00:00.000Z"
};

let activeUser = studentUser;

const bootstrapData = {
    session: {
        currentUserId: studentUser.id,
        activeChatChannels: [
            {
                courseId: 10,
                channelId: 100
            }
        ]
    },
    users: [
        adminUser,
        {
            id: 2,
            code: "00000002",
            firstName: "Valeria",
            lastName: "Ramos",
            email: "valeria.ramos@unichat.dev",
            role: "teacher",
            avatarUrl: "",
            createdAt: "2026-01-09T14:15:00.000Z"
        },
        studentUser,
        {
            id: 4,
            code: "00000004",
            firstName: "Lucia",
            lastName: "Paredes",
            email: "lucia.paredes@unichat.dev",
            role: "student",
            avatarUrl: "",
            createdAt: "2026-02-10T08:00:00.000Z"
        }
    ],
    classrooms: [
        {
            id: 20,
            name: "Aula A101",
            type: "classroom"
        },
        {
            id: 21,
            name: "Zoom Sistemas",
            type: "online"
        }
    ],
    courses: [
        {
            id: 10,
            shortName: "SO",
            title: "Sistemas Operativos",
            slug: "sistemas-operativos",
            teacherId: 2,
            classroomId: 20,
            secondaryClassroomId: 21,
            currentWeek: 3
        }
    ],
    courseMembers: [
        {
            id: 30,
            courseId: 10,
            userId: 1,
            courseRole: "delegate",
            status: "active",
            joinedAt: "2026-03-01T12:00:00.000Z"
        },
        {
            id: 31,
            courseId: 10,
            userId: 3,
            courseRole: "student",
            status: "active",
            joinedAt: "2026-03-01T12:00:00.000Z"
        },
        {
            id: 32,
            courseId: 10,
            userId: 4,
            courseRole: "delegate",
            status: "pending_delegate",
            joinedAt: "2026-03-05T12:00:00.000Z"
        }
    ],
    courseStats: [
        {
            courseId: 10,
            studentsCount: 32,
            delegatesCount: 2,
            unreadMessagesCount: 7,
            pendingItemsCount: 4,
            foldersCount: 3,
            lastActivityAt: dayOffset(0, 9, 45)
        }
    ],
    classSessions: [
        {
            id: 40,
            courseId: 10,
            classroomId: 20,
            topic: "Procesos, hilos y planificacion",
            startsAt: hoursFromNow(-1),
            endsAt: hoursFromNow(1)
        },
        {
            id: 41,
            courseId: 10,
            classroomId: 21,
            topic: "Laboratorio de scheduling",
            startsAt: hoursFromNow(3),
            endsAt: hoursFromNow(5)
        }
    ],
    calendarEvents: [
        {
            id: 50,
            courseId: 10,
            createdById: 2,
            title: "Practica calificada 1",
            description: "Evaluacion sobre procesos e hilos.",
            eventType: "exam",
            startsAt: dayOffset(3, 15, 0),
            endsAt: dayOffset(3, 17, 0),
            status: "pending"
        },
        {
            id: 51,
            courseId: 10,
            createdById: 2,
            title: "Tarea de planificacion",
            description: "Resolver ejercicios sobre Round Robin y prioridades.",
            eventType: "assignment",
            startsAt: dayOffset(6, 23, 59),
            endsAt: null,
            status: "pending"
        },
        {
            id: 52,
            courseId: 10,
            createdById: 2,
            title: "Recordatorio: lectura semana 3",
            description: "Leer el capitulo de concurrencia.",
            eventType: "reminder",
            startsAt: dayOffset(1, 18, 0),
            endsAt: null,
            status: "published"
        }
    ],
    resources: [
        {
            id: 60,
            courseId: 10,
            weekNumber: 1,
            title: "Introduccion a Sistemas Operativos",
            kind: "pdf",
            sizeBytes: 1800000,
            uploadedById: 2,
            fileUrl: "/uploads/resources/intro-sistemas-operativos.pdf",
            status: "available",
            createdAt: "2026-06-05T16:00:00.000Z"
        },
        {
            id: 61,
            courseId: 10,
            weekNumber: 2,
            title: "Procesos e hilos",
            kind: "pdf",
            sizeBytes: 2400000,
            uploadedById: 2,
            fileUrl: "/uploads/resources/procesos-hilos.pdf",
            status: "available",
            createdAt: "2026-06-12T16:00:00.000Z"
        },
        {
            id: 62,
            courseId: 10,
            weekNumber: 3,
            title: "Planificacion de CPU",
            kind: "pdf",
            sizeBytes: 3100000,
            uploadedById: 2,
            fileUrl: "/uploads/resources/scheduling.pdf",
            status: "available",
            createdAt: "2026-06-19T16:00:00.000Z"
        }
    ],
    announcements: [
        {
            id: 70,
            title: "Bienvenido a UniChat",
            body: "Nuevo entorno para centralizar clases, chat, recursos y tareas del curso.",
            category: "general",
            authorId: 1,
            publishedAt: dayOffset(-1, 12, 0),
            status: "published"
        },
        {
            id: 71,
            title: "Practica calificada programada",
            body: "La practica de procesos e hilos ya aparece en el calendario del curso.",
            category: "academic",
            authorId: 2,
            publishedAt: dayOffset(0, 8, 30),
            status: "published"
        }
    ],
    chatChannels: [
        {
            id: 100,
            courseId: 10,
            name: "Chat grupal",
            description: "Conversacion general del curso.",
            type: "group",
            isLocked: false
        },
        {
            id: 101,
            courseId: 10,
            name: "Anuncios",
            description: "Avisos oficiales del profesor.",
            type: "announcement",
            isLocked: true
        }
    ],
    chatMessages: [
        {
            id: 200,
            channelId: 100,
            senderId: 2,
            body: "Subi el material de planificacion de CPU para la semana 3.",
            isPinned: true,
            isDeleted: false,
            createdAt: dayOffset(0, 8, 15),
            reactions: [
                {
                    emoji: "👍",
                    count: 8,
                    reactedByMe: true
                }
            ],
            readBy: [1, 3]
        },
        {
            id: 201,
            channelId: 100,
            senderId: 3,
            body: "Profe, podemos repasar Round Robin antes de la practica?",
            isPinned: false,
            isDeleted: false,
            createdAt: dayOffset(0, 8, 40),
            reactions: [
                {
                    emoji: "🔥",
                    count: 3,
                    reactedByMe: false
                }
            ],
            readBy: [1]
        },
        {
            id: 202,
            channelId: 100,
            senderId: 1,
            body: "Ya agregue un resumen con los ejemplos del laboratorio.",
            isPinned: false,
            isDeleted: false,
            createdAt: dayOffset(0, 9, 10),
            reactions: [],
            readBy: [2, 3, 4]
        }
    ]
};

async function preparePage(page) {
    await page.route("**/api/bootstrap", async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
                ...bootstrapData,
                session: {
                    ...bootstrapData.session,
                    currentUserId: activeUser.id
                }
            })
        });
    });

    await page.route("**/api/preferences", async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
                language: "English",
                chatWallpaperName: "",
                chatWallpaperUrl: "",
                colorPalette: "aurora",
                chatFontSize: "md",
                showReadCheck: true,
                updatedAt: "2026-07-01T10:00:00.000Z"
            })
        });
    });

    await page.route("**/api/ai/resources/ask", async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
                answer: "Para estudiar planificacion de CPU, revisa el PDF de semana 3 y practica Round Robin con distintos quantum. Tambien tienes una practica programada en calendario.",
                intent: "study_help",
                courseFilter: "sistemas-operativos",
                resources: [
                    {
                        title: "Planificacion de CPU",
                        url: "/uploads/resources/scheduling.pdf",
                        course: "Sistemas Operativos"
                    }
                ]
            })
        });
    });

    await page.route("**/socket.io/**", async (route) => {
        await route.fulfill({
            status: 204,
            body: ""
        });
    });

    await page.addInitScript((user) => {
        window.localStorage.setItem("token", "readme-demo-token");
        window.localStorage.setItem("user", JSON.stringify(user));
    }, studentUser);
}

async function setActiveUser(page, user) {
    activeUser = user;

    await page.evaluate((nextUser) => {
        window.localStorage.setItem("token", "readme-demo-token");
        window.localStorage.setItem("user", JSON.stringify(nextUser));
        Object.keys(window.localStorage)
            .filter((key) => key.startsWith("unichat_bootstrap_cache_"))
            .forEach((key) => window.localStorage.removeItem(key));
    }, user);
}

async function capture(page, route, fileName, options = {}) {
    await page.goto(`${baseUrl}${route}`, {
        waitUntil: "networkidle"
    });

    await page.waitForTimeout(options.delay ?? 600);

    if (options.ai) {
        await page.locator(".ai-widget-button").click();
        await page.locator(".ai-question-input").fill("Que debo estudiar para la practica?");
        await page.locator(".ai-question-form button[type='submit']").click();
        await page.waitForSelector(".ai-resource-list", {
            timeout: 5000
        });
        await page.waitForTimeout(400);
    }

    await page.screenshot({
        path: path.join(outputDir, fileName),
        fullPage: options.fullPage ?? false
    });
}

await fs.mkdir(outputDir, {
    recursive: true
});

const browser = await chromium.launch();
const page = await browser.newPage({
    viewport: {
        width: 1600,
        height: 950
    },
    deviceScaleFactor: 1
});

await preparePage(page);

await capture(page, "/", "cover.png");
await capture(page, "/", "dashboard.png");
await capture(page, "/course/sistemas-operativos", "course.png");
await capture(page, "/course/sistemas-operativos/chat", "chat.png");
await capture(page, "/course/sistemas-operativos/calendar", "calendar.png");
await setActiveUser(page, adminUser);
await capture(page, "/admin", "admin.png");
await setActiveUser(page, studentUser);
await capture(page, "/", "ai-assistant.png", {
    ai: true
});

await browser.close();

console.log(`Screenshots saved in ${outputDir}`);
