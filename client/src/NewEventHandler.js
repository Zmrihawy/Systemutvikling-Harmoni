import { eventService } from './services';

class NewEventHandler {
    handleNewEvent = async newEvent => {
        try {
            const event = await this.saveEvent(
                newEvent.title,
                newEvent.location,
                newEvent.category,
                newEvent.times[0],
                newEvent.times[1]
            );
            console.log(event);
        } catch (err) {
            console.log(err.message);
        }
    };

    saveEvent = async (name, location, description, startTime, endTime) => {
        const event = eventService.createEvent(
            name,
            1,
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

export default new NewEventHandler();
