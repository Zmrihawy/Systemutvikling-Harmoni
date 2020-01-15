import { eventService } from './services';

class NewEventHandler {
    handleNewEvent = async newEvent => {
        try {
            console.log(newEvent);
            const eventID = await this.saveEvent(
                newEvent.title,
                newEvent.location,
                newEvent.category,
                newEvent.times[0],
                newEvent.times[1]
            );
            console.log(eventID);
            const ticketsSuccess = await this.saveTickets(
                newEvent.tickets,
                eventID
            );
            console.log(ticketsSuccess);
            //const crewSuccess = await this.saveCrew(newEvent.staff, eventID);
            //console.log(crewSuccess);
            const performanceIDs = await this.savePerformance(
                newEvent.artists,
                eventID,
                newEvent.times[0],
                newEvent.times[1]
            );
            //console.log(performanceIDs);
            /* const riderSuccess = await this.saveRiders(
                newEvent.artist,
                performanceIDs
            ); */
            //console.log(riderSuccess);
        } catch (err) {
            console.log(err.message);
        }
    };

    saveEvent = async (name, location, description, startTime, endTime) => {
        const event = await eventService.createEvent(
            1, //userID
            name,
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
                1,
                ticket.description,
                eventID,
                ticket.price,
                ticket.amount,
                ticket.description
            );
        });

        return ticketsID.length > 0;
    };

    /* saveCrew = async (staff, eventID) => {
        const staffID = staff.map(async staff => {
            return await eventService.createCrew(
                1,
                eventID,
                staff.profession,
                staff.name,
                staff.contact
            );
        });
        return staffID.length > 0;
    }; */

    savePerformance = async (artists, eventID, startTime, endTime) => {
        const performanceIDs = await artists.map(async artist => {
            const performance = await eventService.createPerformance(
                1,
                eventID,
                startTime,
                endTime,
                artist.name
            );
            console.log('Performance:');
            console.log(performance);
            return performance;
        });
        return 1;
    };

    /* saveRiders = async (artists, performanceIDs) => {
        const riderIDs = artists.map(async (artist, index) => {
            return artists.riders.map(async rider => {
                return await eventService.createRider(
                    1,
                    performanceIDs[index],
                    rider.description,
                    rider.amount
                );
            });
        });

        return riderIDs.length > 0;
    }; */
}

export default new NewEventHandler();
