import { eventService } from './services';

class NewEventHandler {
    handleNewEvent = async newEvent => {
        try {
            console.log(newEvent);
            const eventID = await this.saveEvent(
                newEvent.title,
                newEvent.location,
                newEvent.longitude,
                newEvent.latitude,
                newEvent.description,
                newEvent.times[0],
                newEvent.times[1]
            );
            console.log('Event:');
            console.log(eventID);

            let ticketsSuccess;
            if (newEvent.tickets.length > 0) {
                ticketsSuccess = await this.saveTickets(
                    newEvent.tickets,
                    eventID
                );
            } else {
                ticketsSuccess = true;
            }
            console.log('Tickets:');
            console.log(ticketsSuccess);

            const crewSuccess = await this.saveCrew(newEvent.staff, eventID);
            console.log('Crew:');
            console.log(crewSuccess);

            const performanceIDs = await this.savePerformance(
                newEvent.artists,
                eventID,
                newEvent.times[0],
                newEvent.times[1]
            );
            console.log(performanceIDs);

            const riderSuccess = await this.saveRiders(
                newEvent.artists,
                performanceIDs
            );
            console.log('Riders:');
            console.log(riderSuccess);
        } catch (err) {
            console.log(err);
        }
    };

    saveEvent = async (
        name,
        location,
        longitude,
        latitude,
        description,
        startTime,
        endTime
    ) => {
        const event = await eventService.createEvent(
            1, //userID
            name,
            1,
            location,
            longitude,
            latitude,
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

    saveCrew = async (staff, eventID) => {
        const staffID = staff.map(async staff => {
            return await eventService.createCrew(
                eventID,
                staff.profession,
                staff.name,
                staff.contact
            );
        });
        return staffID.length > 0;
    };

    savePerformance = async (artists, eventID, startTime, endTime) => {
        return this.getData(artists, eventID, startTime, endTime).then(data => {
            console.log(data);

            return data;
        });
    };

    getData = async (artists, eventID, startTime, endTime) => {
        return Promise.all(
            artists.map(async artist => {
                const performance = await eventService.createPerformance(
                    1,
                    eventID,
                    startTime,
                    endTime,
                    artist.name,
                    ''
                );
                return performance.data.insertId;
            })
        );
    };

    saveRiders = async (artists, performanceIDs) => {
        console.log('[PerformanceIDS]:');
        console.log(performanceIDs);
        const riderIDs = artists.map(async (artist, index) => {
            console.log('[SaveRiders]');
            console.log(artist);
            return await artist.riders.map(async rider => {
                return await eventService.createRider(
                    performanceIDs[index],
                    rider.description,
                    rider.amount
                );
            });
        });

        return riderIDs.length > 0;
    };
}

export default new NewEventHandler();
