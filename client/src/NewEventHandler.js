import { eventService } from './services';

class NewEventHandler {
    handleError = message => {
        throw new Error(message);
    };

    handleNewEvent = async newEvent => {
        try {
            const userId = await window.sessionStorage.getItem('user');
            if (!userId) this.handleError('User ID invalid');

            const eventID = await this.saveEvent(
                userId,
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

            if (!eventID) this.handleError('Registering event failed');

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

            let crewSuccess;
            if (newEvent.staff.length > 0) {
                crewSuccess = await this.saveCrew(newEvent.staff, eventID);
            } else {
                crewSuccess = true;
            }

            console.log('Crew:');
            console.log(crewSuccess);

            const performanceIDs = await this.savePerformance(
                newEvent.artists,
                eventID,
                newEvent.times[0],
                newEvent.times[1]
            );

            console.log(performanceIDs);

            let riders = false;
            let riderSuccess;

            newEvent.artists.forEach(el => {
                if (el.riders.length > 0) riders = true;
            });
            if (riders) {
                riderSuccess = await this.saveRiders(
                    newEvent.artists,
                    performanceIDs,
                    eventID
                );
            } else {
                riderSuccess = true;
            }
            console.log('Riders:');
            console.log(riderSuccess);

            eventID &&
            ticketsSuccess &&
            crewSuccess &&
            riderSuccess &&
            performanceIDs
                ? console.log('Arrangement opprettet')
                : console.log('Failed arrangementoppretting');
        } catch (err) {
            console.log(err);
        }
    };

    saveEvent = async (
        id,
        name,
        location,
        longitude,
        latitude,
        description,
        startTime,
        endTime
    ) => {
        console.log(`Longitude: ${longitude}, Latitude: ${latitude}`);
        const event = await eventService.createEvent(
            id,
            name,
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
        const ticketsID = await tickets.map(async ticket => {
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
            return data;
        });
    };

    getData = async (artists, eventID, startTime, endTime) => {
        return Promise.all(
            artists.map(async artist => {
                let userID, artistName;

                if (!(artist.id > -1)) {
                    userID = null;
                    artistName = artist.name;
                } else {
                    userID = parseInt(artist.id);
                    artistName = null;
                }

                const performance = await eventService.createPerformance(
                    userID,
                    eventID,
                    startTime,
                    endTime,
                    artistName
                );

                return performance.data.insertId;
            })
        );
    };

    saveRiders = async (artists, performanceIDs, eventID) => {
        const riderIDs = artists.map(async (artist, index) => {
            return await artist.riders.map(async rider => {
                return await eventService.createRider(
                    performanceIDs[index],
                    eventID,
                    rider.description,
                    rider.amount
                );
            });
        });

        return riderIDs.length > 0;
    };
}

export default new NewEventHandler();
