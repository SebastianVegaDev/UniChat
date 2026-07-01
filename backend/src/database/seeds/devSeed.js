import bcrypt from "bcrypt";

const PASSWORD = "123456";

export async function createDevSeedData() {
    const passwordHash = await bcrypt.hash(PASSWORD, 10);

    return {
        password: PASSWORD,
        users: [
            {
                code: "00000001",
                firstName: "Admin",
                lastName: "UniChat",
                email: "00000001@aloe.ulima.edu.pe",
                passwordHash,
                role: "admin"
            },
            {
                code: "00000002",
                firstName: "Profesor",
                lastName: "Demo",
                email: "00000002@aloe.ulima.edu.pe",
                passwordHash,
                role: "teacher"
            },
            {
                code: "00000003",
                firstName: "Alumno",
                lastName: "Demo",
                email: "00000003@aloe.ulima.edu.pe",
                passwordHash,
                role: "student"
            }
        ],
        classrooms: [
            {
                name: "Aula A101",
                type: "classroom"
            },
            {
                name: "Zoom Sistemas",
                type: "online"
            }
        ],
        courses: [
            {
                shortName: "SO",
                title: "Sistemas Operativos",
                slug: "sistemas-operativos",
                teacherCode: "00000002",
                classroomName: "Aula A101",
                secondaryClassroomName: "Zoom Sistemas",
                currentWeek: 3
            }
        ],
        resources: [
            {
                courseSlug: "sistemas-operativos",
                weekNumber: 1,
                title: "Introducción a Sistemas Operativos",
                kind: "pdf",
                sizeBytes: 0,
                uploadedByCode: "00000002",
                fileUrl: "/uploads/resources/demo-sistemas-operativos-semana-1.pdf"
            },
            {
                courseSlug: "sistemas-operativos",
                weekNumber: 3,
                title: "Procesos e Hilos",
                kind: "pdf",
                sizeBytes: 0,
                uploadedByCode: "00000002",
                fileUrl: "/uploads/resources/demo-procesos-e-hilos.pdf"
            }
        ],
        calendarEvents: [
            {
                courseSlug: "sistemas-operativos",
                createdByCode: "00000002",
                title: "Práctica calificada 1",
                description: "Evaluación sobre procesos e hilos.",
                eventType: "exam",
                startsAt: "2026-07-15T15:00:00-05:00",
                endsAt: "2026-07-15T17:00:00-05:00"
            },
            {
                courseSlug: "sistemas-operativos",
                createdByCode: "00000002",
                title: "Tarea de planificación de procesos",
                description: "Resolver ejercicios sobre scheduling.",
                eventType: "assignment",
                startsAt: "2026-07-10T23:59:00-05:00",
                endsAt: null
            }
        ],
        classSessions: [
            {
                courseSlug: "sistemas-operativos",
                classroomName: "Aula A101",
                topic: "Procesos, hilos y planificación",
                startsAt: "2026-07-08T10:00:00-05:00",
                endsAt: "2026-07-08T12:00:00-05:00"
            }
        ],
        announcements: [
            {
                title: "Bienvenido a UniChat",
                body: "Este es un entorno de desarrollo con datos iniciales.",
                category: "general",
                authorCode: "00000001",
                status: "published"
            }
        ]
    };
}