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
            const ticketsSuccess = await this.saveTickets(
                newEvent.tickets,
                eventID
            );
            const performanceIDs = await this.savePerformance(
                newEvent.artists,
                eventID,
                newEvent.times[0],
                newEvent.times[1]
            );
            console.log(performanceIDs);
            const riderSuccess = await this.saveRiders(
                newEvent.artist,
                performanceIDs
            );
            console.log(riderSuccess);
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

    saveTickets = async (tickets, eventID) => {
        const ticketsID = tickets.map(async ticket => {
            return await eventService.createTicket(
                ticket.description,
                eventID,
                ticket.price,
                ticket.amount,
                ticket.description
            );
        });

        return ticketsID.length > 0;
    };

    savePerformance = async (artists, eventID, startTime, endTime) => {
        const performanceIDs = artists.map(async artist => {
            return await eventService.createPerformance(
                1,
                eventID,
                startTime,
                endTime,
                artist.name
            );
        });

        return performanceIDs.map(performanceIDs => performanceIDs.insertId);
    };

    saveRiders = async (artists, performanceIDs) => {
        const riderIDs = artists.map(async (artist, index) => {
            return artists.riders.map(async rider => {
                return await eventService.createRider(
                    performanceIDs[index],
                    rider.description,
                    rider.amount
                );
            });
        });

        return riderIDs.length > 0;
    };

    saveCrew = async () => {};
}

export default new NewEventHandler();
