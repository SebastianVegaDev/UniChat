import {
    addCalendarEvent,
    cancelCalendarEvent,
    editCalendarEvent,
    removeCalendarEvent
} from "../../bootstrap/updaters/bootstrap.updaters.js";
import {
    fetchCancelCalendarEvent,
    fetchCreateCalendarEvent,
    fetchDeleteCalendarEvent,
    fetchEditCalendarEvent
} from "../api/courseCalendar.api.js";

export function useCourseCalendarActions({ updateBootstrap }) {
    async function handleCreateEvent(calendarEventData) {
        try {
            const createdEvent = await fetchCreateCalendarEvent(calendarEventData);

            if (createdEvent) {
                updateBootstrap((currentData) => addCalendarEvent(currentData, {
                    ...calendarEventData,
                    id: createdEvent.id,
                    status: "pending"
                }));

                return true;
            }
        } catch (error) {
            console.log(error)
        }

        return false;
    }

    async function handleEditEvent(calendarEventData) {
        try {
            const editedEvent = await fetchEditCalendarEvent(calendarEventData);

            if (editedEvent) {
                updateBootstrap((currentData) => editCalendarEvent(currentData, calendarEventData));

                return true;
            }
        } catch (error) {
            console.log(error)
        }

        return false;
    }

    async function handleCancelEvent(calendarEventData) {
        try {
            const canceledEvent = await fetchCancelCalendarEvent(calendarEventData);

            if (canceledEvent) {
                updateBootstrap((currentData) => cancelCalendarEvent(currentData, calendarEventData.calendarEventId));
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function handleDeleteEvent(calendarEventData) {
        try {
            const deletedEvent = await fetchDeleteCalendarEvent(calendarEventData);

            if (deletedEvent) {
                updateBootstrap((currentData) => removeCalendarEvent(currentData, calendarEventData.calendarEventId));
            }
        } catch (error) {
            console.log(error)
        }
    }

    return {
        handleCreateEvent,
        handleEditEvent,
        handleCancelEvent,
        handleDeleteEvent
    };
}
