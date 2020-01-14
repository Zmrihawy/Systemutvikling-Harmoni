import { eventService } from './services';

export default class NewEventHandler {
    handleNewEvent = async (
        eventName,
        eventHostID,
        eventLocation,
        eventDescription,
        eventStartTime,
        eventEndTime
    ) => {
        try {
            const event = await this.saveEvent(
                eventName,
                eventLocation,
                eventDescription,
                eventStartTime,
                eventEndTime
            );
            console.log(event);
        } catch (err) {
            console.log(err.message);
        }
    };

    saveEvent = async (name, location, description, startTime, endTime) => {
        const event = eventService.createEvent(
            'DEFAULT_VALUE',
            name,
            123,
            1,
            location,
            description,
            startTime,
            endTime
        );

        return event;
    };

    saveTickets = async () => {};

    savePerformance = async () => {};

    saveRiders = async () => {};

    saveCrew = async () => {};
}
