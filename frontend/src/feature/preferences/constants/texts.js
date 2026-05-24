const ENGLISH_TEXTS = {
    locale: "en-US",
    common: {
        user: "User",
        unknownUser: "Unknown user",
        unknownAuthor: "Unknown author",
        course: "Course",
        noClassroom: "No classroom",
        cancel: "Cancel",
        delete: "Delete",
        edit: "Edit",
        save: "Save",
        available: "Available",
        unavailable: "Unavailable",
        assignment: "Assignment",
        exam: "Exam",
        reminder: "Reminder",
        announcement: "Announcement",
        other: "Other",
        classSession: "Class session",
        untitledEvent: "Untitled event",
        pendingItem: "Pending item"
    },
    sidebar: {
        home: "Home",
        news: "News",
        logout: "Log out",
        logoutSuccess: "Logout successful!"
    },
    topbar: {
        user: "User",
        created: "Created"
    },
    home: {
        title: "My Day",
        welcome: "Welcome",
        teacherShortName: "Prof.",
        pendingClasses: "pending classes",
        classInProgress: "class in progress",
        classes: "Classes",
        nextClass: "Next Class",
        openCourse: "Open Course",
        latestNews: "Latest news",
        untitledNews: "Untitled news",
        statuses: {
            now: "now",
            upcoming: "upcoming",
            finished: "finished"
        }
    },
    news: {
        eyebrow: "News",
        title: "News of the University",
        description: "Announcements published by offices and academic departments.",
        untitled: "Untitled news",
        categories: {
            academic: "Academic",
            event: "Event",
            general: "General",
            announcement: "Announcement"
        }
    },
    course: {
        course: "Course",
        students: "students",
        delegates: "delegates",
        courseChat: "Course chat",
        calendar: "Calendar",
        unreadMessages: "unread messages",
        pendingThisMonth: "pending this month",
        information: "INFORMATION",
        currentWeek: "Current Week",
        professor: "Professor",
        activity: "Activity",
        resourcesByWeek: "RESOURCES BY WEEK",
        folders: "folders",
        week: "Week",
        uploadedBy: "Uploaded by",
        addResource: "Add Resource",
        toggleAvailability: "Toggle availability",
        noDelegates: "No delegates",
        noRecentActivity: "No recent activity",
        updatedJustNow: "Updated just now",
        updatedMinutesAgo: (value) => `Updated ${value} min ago`,
        updatedHoursAgo: (value) => `Updated ${value} ${value === 1 ? "hour" : "hours"} ago`,
        updatedDaysAgo: (value) => `Updated ${value} ${value === 1 ? "day" : "days"} ago`,
        updatedWeeksAgo: (value) => `Updated ${value} ${value === 1 ? "week" : "weeks"} ago`,
        updatedMonthsAgo: (value) => `Updated ${value} ${value === 1 ? "month" : "months"} ago`,
        resource: "Resource",
        untitledResource: "Untitled resource",
        resourceKinds: {
            ppt: "PowerPoint",
            pdf: "Official PDF",
            video: "Video",
            photo: "Photo",
            sql: "SQL",
            doc: "Document"
        }
    },
    calendar: {
        eyebrow: "Calendar",
        title: "Calendar",
        description: "Upcoming classes, assignments, and academic events.",
        pendingThisMonth: "Pending this month",
        createEvent: "Create event",
        editEvent: "Edit event",
        saveEvent: "Save event",
        createDescription: "Add a new activity to this course calendar.",
        editDescription: "Update this course calendar activity.",
        titlePlaceholder: "Title",
        descriptionPlaceholder: "Description",
        type: "Type",
        eventTypes: {
            assignment: "Assignment",
            exam: "Exam",
            reminder: "Reminder",
            announcement: "Announcement",
            other: "Other",
            class: "Class"
        }
    },
    forms: {
        resource: {
            addResource: "Add resource",
            editResource: "Edit resource",
            saveResource: "Save resource",
            addDescription: "Add a new resource to this course.",
            editDescription: "Update this course resource.",
            titlePlaceholder: "Title",
            weekPlaceholder: "Week",
            uploadFile: "Upload file",
            replaceFile: "Replace file",
            uploadHelp: "Choose the resource file from your device.",
            replaceHelp: "Choose a new file if needed."
        }
    },
    preferences: {
        title: "Preferences",
        general: "General",
        language: "Language",
        chatAppearance: "Chat Appearance",
        chatWallpaper: "Chat wallpaper",
        chatWallpaperDescription: "Upload an image for chat backgrounds.",
        noWallpaperSelected: "No wallpaper selected",
        colorPalette: "Color palette",
        chatFontSize: "Chat font size",
        messageBehavior: "Message behavior",
        showReadCheck: "Show read check",
        reset: "Reset",
        save: "Save",
        close: "Close preferences",
        languageOptions: {
            English: "English",
            Spanish: "Spanish",
            Portuguese: "Portuguese"
        },
        paletteLabels: {
            dark: "Dark",
            white: "White",
            pink: "Pink",
            gamer: "Gamer"
        },
        fontSizeLabels: {
            Small: "Small",
            Medium: "Medium",
            Large: "Large"
        }
    },
    chat: {
        pinnedMessage: "Pinned message",
        backToCourse: "Back to course",
        searchChat: "Search chat",
        noChatsFound: "No chats found",
        lockedBadge: "Chat locked",
        lockedPlaceholder: "Chat is locked",
        messagePlaceholder: "Write your message...",
        selectFile: "Select a file",
        selectPhoto: "Select a photo",
        selectVideo: "Select a video",
        lockChat: "Lock chat",
        unlockChat: "Unlock chat",
        copy: "Copy",
        pin: "Pin",
        delete: "Delete",
        deletedMessage: "This message was deleted",
        me: "Me",
        unknownUser: "Unknown user",
        user: "User",
        course: "Course",
        noClassroom: "No classroom",
        courseChat: "Course chat",
        unreadMessages: "Unread messages",
        today: "Today",
        yesterday: "Yesterday",
        daysAgo: (days) => `${days} days ago`,
        roles: {
            teacher: "Teacher",
            delegate: "Delegate",
            student: "Student"
        },
        channelTypes: {
            group: "Group",
            announcement: "Announcement",
            private: "Private"
        },
        channelTitles: {
            group: "General",
            announcement: "Announcements",
            private: "Private groups"
        },
        channelDescriptions: {
            group: "General course discussion.",
            announcement: "Official course announcements.",
            private: "Private group conversations."
        }
    }
};

export const LANGUAGE_TEXTS = {
    English: ENGLISH_TEXTS,
    Spanish: {
        locale: "es-PE",
        common: {
            user: "Usuario",
            unknownUser: "Usuario desconocido",
            unknownAuthor: "Autor desconocido",
            course: "Curso",
            noClassroom: "Sin aula",
            cancel: "Cancelar",
            delete: "Eliminar",
            edit: "Editar",
            save: "Guardar",
            available: "Disponible",
            unavailable: "No disponible",
            assignment: "Tarea",
            exam: "Examen",
            reminder: "Recordatorio",
            announcement: "Aviso",
            other: "Otro",
            classSession: "Clase",
            untitledEvent: "Evento sin titulo",
            pendingItem: "Pendiente"
        },
        sidebar: {
            home: "Inicio",
            news: "Noticias",
            logout: "Cerrar sesion",
            logoutSuccess: "Sesion cerrada"
        },
        topbar: {
            user: "Usuario",
            created: "Creado"
        },
        home: {
            title: "Mi dia",
            welcome: "Bienvenido",
            teacherShortName: "Prof.",
            pendingClasses: "clases pendientes",
            classInProgress: "clase en curso",
            classes: "Clases",
            nextClass: "Siguiente clase",
            openCourse: "Abrir curso",
            latestNews: "Ultimas noticias",
            untitledNews: "Noticia sin titulo",
            statuses: {
                now: "ahora",
                upcoming: "pendiente",
                finished: "terminada"
            }
        },
        news: {
            eyebrow: "Noticias",
            title: "Noticias de la universidad",
            description: "Avisos publicados por oficinas y areas academicas.",
            untitled: "Noticia sin titulo",
            categories: {
                academic: "Academico",
                event: "Evento",
                general: "General",
                announcement: "Aviso"
            }
        },
        course: {
            course: "Curso",
            students: "estudiantes",
            delegates: "delegados",
            courseChat: "Chat del curso",
            calendar: "Calendario",
            unreadMessages: "mensajes no leidos",
            pendingThisMonth: "pendientes este mes",
            information: "INFORMACION",
            currentWeek: "Semana actual",
            professor: "Profesor",
            activity: "Actividad",
            resourcesByWeek: "RECURSOS POR SEMANA",
            folders: "carpetas",
            week: "Semana",
            uploadedBy: "Subido por",
            addResource: "Agregar recurso",
            toggleAvailability: "Cambiar disponibilidad",
            noDelegates: "Sin delegados",
            noRecentActivity: "Sin actividad reciente",
            updatedJustNow: "Actualizado ahora",
            updatedMinutesAgo: (value) => `Actualizado hace ${value} min`,
            updatedHoursAgo: (value) => `Actualizado hace ${value} ${value === 1 ? "hora" : "horas"}`,
            updatedDaysAgo: (value) => `Actualizado hace ${value} ${value === 1 ? "dia" : "dias"}`,
            updatedWeeksAgo: (value) => `Actualizado hace ${value} ${value === 1 ? "semana" : "semanas"}`,
            updatedMonthsAgo: (value) => `Actualizado hace ${value} ${value === 1 ? "mes" : "meses"}`,
            resource: "Recurso",
            untitledResource: "Recurso sin titulo",
            resourceKinds: {
                ppt: "PowerPoint",
                pdf: "PDF oficial",
                video: "Video",
                photo: "Foto",
                sql: "SQL",
                doc: "Documento"
            }
        },
        calendar: {
            eyebrow: "Calendario",
            title: "Calendario",
            description: "Clases, tareas y eventos academicos proximos.",
            pendingThisMonth: "Pendientes este mes",
            createEvent: "Crear evento",
            editEvent: "Editar evento",
            saveEvent: "Guardar evento",
            createDescription: "Agrega una nueva actividad al calendario del curso.",
            editDescription: "Actualiza esta actividad del calendario.",
            titlePlaceholder: "Titulo",
            descriptionPlaceholder: "Descripcion",
            type: "Tipo",
            eventTypes: {
                assignment: "Tarea",
                exam: "Examen",
                reminder: "Recordatorio",
                announcement: "Aviso",
                other: "Otro",
                class: "Clase"
            }
        },
        forms: {
            resource: {
                addResource: "Agregar recurso",
                editResource: "Editar recurso",
                saveResource: "Guardar recurso",
                addDescription: "Agrega un nuevo recurso a este curso.",
                editDescription: "Actualiza este recurso del curso.",
                titlePlaceholder: "Titulo",
                weekPlaceholder: "Semana",
                uploadFile: "Subir archivo",
                replaceFile: "Reemplazar archivo",
                uploadHelp: "Elige el archivo desde tu dispositivo.",
                replaceHelp: "Elige un archivo nuevo si hace falta."
            }
        },
        preferences: {
            title: "Preferencias",
            general: "General",
            language: "Idioma",
            chatAppearance: "Apariencia del chat",
            chatWallpaper: "Fondo del chat",
            chatWallpaperDescription: "Sube una imagen para el fondo del chat.",
            noWallpaperSelected: "Sin fondo seleccionado",
            colorPalette: "Paleta de colores",
            chatFontSize: "Tamano del texto",
            messageBehavior: "Comportamiento",
            showReadCheck: "Mostrar visto",
            reset: "Reiniciar",
            save: "Guardar",
            close: "Cerrar preferencias",
            languageOptions: {
                English: "Ingles",
                Spanish: "Espanol",
                Portuguese: "Portugues"
            },
            paletteLabels: {
                dark: "Oscuro",
                white: "Blanco",
                pink: "Rosado",
                gamer: "Gamer"
            },
            fontSizeLabels: {
                Small: "Pequeno",
                Medium: "Mediano",
                Large: "Grande"
            }
        },
        chat: {
            pinnedMessage: "Mensaje fijado",
            backToCourse: "Volver al curso",
            searchChat: "Buscar chat",
            noChatsFound: "No se encontraron chats",
            lockedBadge: "Chat bloqueado",
            lockedPlaceholder: "Chat bloqueado",
            messagePlaceholder: "Escribe tu mensaje...",
            selectFile: "Seleccionar archivo",
            selectPhoto: "Seleccionar foto",
            selectVideo: "Seleccionar video",
            lockChat: "Bloquear chat",
            unlockChat: "Desbloquear chat",
            copy: "Copiar",
            pin: "Fijar",
            delete: "Eliminar",
            deletedMessage: "Este mensaje fue eliminado",
            me: "Yo",
            unknownUser: "Usuario desconocido",
            user: "Usuario",
            course: "Curso",
            noClassroom: "Sin aula",
            courseChat: "Chat del curso",
            unreadMessages: "Mensajes no leidos",
            today: "Hoy",
            yesterday: "Ayer",
            daysAgo: (days) => `Hace ${days} dias`,
            roles: {
                teacher: "Profesor",
                delegate: "Delegado",
                student: "Estudiante"
            },
            channelTypes: {
                group: "Grupo",
                announcement: "Avisos",
                private: "Privado"
            },
            channelTitles: {
                group: "General",
                announcement: "Avisos",
                private: "Grupos privados"
            },
            channelDescriptions: {
                group: "Conversacion general del curso.",
                announcement: "Avisos oficiales del curso.",
                private: "Conversaciones de grupos privados."
            }
        }
    },
    Portuguese: {
        locale: "pt-BR",
        common: {
            user: "Usuario",
            unknownUser: "Usuario desconhecido",
            unknownAuthor: "Autor desconhecido",
            course: "Curso",
            noClassroom: "Sem sala",
            cancel: "Cancelar",
            delete: "Excluir",
            edit: "Editar",
            save: "Salvar",
            available: "Disponivel",
            unavailable: "Indisponivel",
            assignment: "Tarefa",
            exam: "Prova",
            reminder: "Lembrete",
            announcement: "Aviso",
            other: "Outro",
            classSession: "Aula",
            untitledEvent: "Evento sem titulo",
            pendingItem: "Pendente"
        },
        sidebar: {
            home: "Inicio",
            news: "Noticias",
            logout: "Sair",
            logoutSuccess: "Sessao encerrada"
        },
        topbar: {
            user: "Usuario",
            created: "Criado"
        },
        home: {
            title: "Meu dia",
            welcome: "Bem-vindo",
            teacherShortName: "Prof.",
            pendingClasses: "aulas pendentes",
            classInProgress: "aula em andamento",
            classes: "Aulas",
            nextClass: "Proxima aula",
            openCourse: "Abrir curso",
            latestNews: "Ultimas noticias",
            untitledNews: "Noticia sem titulo",
            statuses: {
                now: "agora",
                upcoming: "pendente",
                finished: "finalizada"
            }
        },
        news: {
            eyebrow: "Noticias",
            title: "Noticias da universidade",
            description: "Avisos publicados por setores e areas academicas.",
            untitled: "Noticia sem titulo",
            categories: {
                academic: "Academico",
                event: "Evento",
                general: "Geral",
                announcement: "Aviso"
            }
        },
        course: {
            course: "Curso",
            students: "estudantes",
            delegates: "delegados",
            courseChat: "Chat do curso",
            calendar: "Calendario",
            unreadMessages: "mensagens nao lidas",
            pendingThisMonth: "pendentes este mes",
            information: "INFORMACOES",
            currentWeek: "Semana atual",
            professor: "Professor",
            activity: "Atividade",
            resourcesByWeek: "RECURSOS POR SEMANA",
            folders: "pastas",
            week: "Semana",
            uploadedBy: "Enviado por",
            addResource: "Adicionar recurso",
            toggleAvailability: "Alterar disponibilidade",
            noDelegates: "Sem delegados",
            noRecentActivity: "Sem atividade recente",
            updatedJustNow: "Atualizado agora",
            updatedMinutesAgo: (value) => `Atualizado ha ${value} min`,
            updatedHoursAgo: (value) => `Atualizado ha ${value} ${value === 1 ? "hora" : "horas"}`,
            updatedDaysAgo: (value) => `Atualizado ha ${value} ${value === 1 ? "dia" : "dias"}`,
            updatedWeeksAgo: (value) => `Atualizado ha ${value} ${value === 1 ? "semana" : "semanas"}`,
            updatedMonthsAgo: (value) => `Atualizado ha ${value} ${value === 1 ? "mes" : "meses"}`,
            resource: "Recurso",
            untitledResource: "Recurso sem titulo",
            resourceKinds: {
                ppt: "PowerPoint",
                pdf: "PDF oficial",
                video: "Video",
                photo: "Foto",
                sql: "SQL",
                doc: "Documento"
            }
        },
        calendar: {
            eyebrow: "Calendario",
            title: "Calendario",
            description: "Aulas, tarefas e eventos academicos proximos.",
            pendingThisMonth: "Pendentes este mes",
            createEvent: "Criar evento",
            editEvent: "Editar evento",
            saveEvent: "Salvar evento",
            createDescription: "Adicione uma nova atividade ao calendario do curso.",
            editDescription: "Atualize esta atividade do calendario.",
            titlePlaceholder: "Titulo",
            descriptionPlaceholder: "Descricao",
            type: "Tipo",
            eventTypes: {
                assignment: "Tarefa",
                exam: "Prova",
                reminder: "Lembrete",
                announcement: "Aviso",
                other: "Outro",
                class: "Aula"
            }
        },
        forms: {
            resource: {
                addResource: "Adicionar recurso",
                editResource: "Editar recurso",
                saveResource: "Salvar recurso",
                addDescription: "Adicione um novo recurso a este curso.",
                editDescription: "Atualize este recurso do curso.",
                titlePlaceholder: "Titulo",
                weekPlaceholder: "Semana",
                uploadFile: "Enviar arquivo",
                replaceFile: "Substituir arquivo",
                uploadHelp: "Escolha o arquivo do seu dispositivo.",
                replaceHelp: "Escolha um arquivo novo se precisar."
            }
        },
        preferences: {
            title: "Preferencias",
            general: "Geral",
            language: "Idioma",
            chatAppearance: "Aparencia do chat",
            chatWallpaper: "Fundo do chat",
            chatWallpaperDescription: "Envie uma imagem para o fundo do chat.",
            noWallpaperSelected: "Sem fundo selecionado",
            colorPalette: "Paleta de cores",
            chatFontSize: "Tamanho do texto",
            messageBehavior: "Comportamento",
            showReadCheck: "Mostrar visto",
            reset: "Reiniciar",
            save: "Salvar",
            close: "Fechar preferencias",
            languageOptions: {
                English: "Ingles",
                Spanish: "Espanhol",
                Portuguese: "Portugues"
            },
            paletteLabels: {
                dark: "Escuro",
                white: "Branco",
                pink: "Rosa",
                gamer: "Gamer"
            },
            fontSizeLabels: {
                Small: "Pequeno",
                Medium: "Medio",
                Large: "Grande"
            }
        },
        chat: {
            pinnedMessage: "Mensagem fixada",
            backToCourse: "Voltar ao curso",
            searchChat: "Buscar chat",
            noChatsFound: "Nenhum chat encontrado",
            lockedBadge: "Chat bloqueado",
            lockedPlaceholder: "Chat bloqueado",
            messagePlaceholder: "Escreva sua mensagem...",
            selectFile: "Selecionar arquivo",
            selectPhoto: "Selecionar foto",
            selectVideo: "Selecionar video",
            lockChat: "Bloquear chat",
            unlockChat: "Desbloquear chat",
            copy: "Copiar",
            pin: "Fixar",
            delete: "Excluir",
            deletedMessage: "Esta mensagem foi excluida",
            me: "Eu",
            unknownUser: "Usuario desconhecido",
            user: "Usuario",
            course: "Curso",
            noClassroom: "Sem sala",
            courseChat: "Chat do curso",
            unreadMessages: "Mensagens nao lidas",
            today: "Hoje",
            yesterday: "Ontem",
            daysAgo: (days) => `Ha ${days} dias`,
            roles: {
                teacher: "Professor",
                delegate: "Delegado",
                student: "Estudante"
            },
            channelTypes: {
                group: "Grupo",
                announcement: "Avisos",
                private: "Privado"
            },
            channelTitles: {
                group: "Geral",
                announcement: "Avisos",
                private: "Grupos privados"
            },
            channelDescriptions: {
                group: "Conversa geral do curso.",
                announcement: "Avisos oficiais do curso.",
                private: "Conversas de grupos privados."
            }
        }
    }
};

function mergeTextSection(defaultSection, currentSection) {
    if (!defaultSection || typeof defaultSection !== "object") return currentSection ?? defaultSection;
    if (!currentSection || typeof currentSection !== "object") return defaultSection;

    return Object.entries(defaultSection).reduce((result, [key, value]) => {
        result[key] = mergeTextSection(value, currentSection[key]);
        return result;
    }, { ...currentSection });
}

export function getPreferenceTexts(language) {
    return mergeTextSection(ENGLISH_TEXTS, LANGUAGE_TEXTS[language] ?? ENGLISH_TEXTS);
}
