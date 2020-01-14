import { eventService } from './services';

class NewEventHandler {
    handleNewEvent = async newEvent => {
        try {
            const eventID = await this.saveEvent(
                newEvent.title,
                newEvent.location,
                newEvent.category,
                newEvent.times[0],
                newEvent.times[1]
            );
        } catch (err) {
            console.log(err.message);
        }
    };

    saveEvent = async (name, location, description, startTime, endTime) => {
        const event = await eventService.createEvent(
            name,
            1,
            1,
            location,
            description,
            startTime,
            endTime
        );

        return event.insertId;
    };

    saveTickets = async () => {};

    savePerformance = async () => {};

    saveRiders = async () => {};

    saveCrew = async () => {};
}

export default new NewEventHandler();
