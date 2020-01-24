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

            let crewSuccess;
            if (newEvent.staff.length > 0) {
                crewSuccess = await this.saveCrew(newEvent.staff, eventID);
            } else {
                crewSuccess = true;
            }

            const performanceIDs = await this.savePerformance(
                newEvent.artists,
                eventID,
                newEvent.times[0],
                newEvent.times[1]
            );

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

            // Upload contracts to the given artists.
            if (newEvent.contracts) {
                this.uploadFiles(newEvent.contracts, eventID, performanceIDs);
            }

            return (
                eventID &&
                ticketsSuccess &&
                crewSuccess &&
                riderSuccess &&
                performanceIDs
            );
        } catch (err) {
            console.log(err);
        }
    };

    async uploadFiles(files, eventID, performanceIDs) {
        // this.setState({ uploadProgress: {}, uploading: true });

        const promises = [];
        files.forEach((file, index) => {
            if (file) {
                promises.push(
                    this.sendRequest(file[0], eventID, performanceIDs[index])
                );
            }
        });
        if (promises.length > 0) {
            try {
                console.log('Promises');
                console.log(promises);
                await Promise.all(promises);

                //this.setState({ successfullUploaded: true, uploading: false });
            } catch (e) {
                //this.setState({ successfullUploaded: true, uploading: false });
            }
        } else {
            return 1;
        }
    }

    sendRequest(file, eventId, performanceId) {
        console.log('Request:');
        console.log(file);
        console.log(eventId);
        console.log(performanceId);
        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();

            const formData = new FormData();
            formData.append('file', file, file.name);

            req.open(
                'PUT',
                '/api/event/' +
                    eventId +
                    '/performance/' +
                    performanceId +
                    '/contract'
            );

            req.setRequestHeader(
                'x-access-token',
                window.sessionStorage.getItem('jwt')
            );

            req.send(formData);
        });
    }

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
                let userID;

                if (!(artist.id > -1)) {
                    userID = null;
                } else {
                    userID = parseInt(artist.id);
                }

                const performance = await eventService.createPerformance(
                    userID,
                    eventID,
                    startTime,
                    endTime,
                    artist.name
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
