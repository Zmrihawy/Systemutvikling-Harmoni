//@flow

/**
 * Event class
 */
export class Event {
    id: number;
    name: string;
    hostId: number;
    active: number;
    location: string;
    longitude: number;
    latitude: number;
    description: string;
    startTime: string;
    endTime: string;
    picture: string;

    firstName: string;
    surname: string;

    constructor(
        id: number,
        name: string,
        hostId: number,
        active: number,
        location: string,
        longitude: number,
        latitude: number,
        description: string,
        startTime: string,
        endTime: string,
        picture: string
    ) {
        this.id = id;
        this.name = name;
        this.hostId = hostId;
        this.active = active;
        this.location = location;
        this.longitude = longitude;
        this.latitude = latitude;
        this.description = description;
        this.startTime = startTime;
        this.endTime = endTime;
        this.picture = picture;
    }
}

/**
 * Ticket class
 */
export class Ticket {
    name: string;
    eventId: number;
    price: number;
    amount: number;

    constructor(name: string, eventId: number, price: number, amount: number) {
        this.name = name;
        this.eventId = eventId;
        this.price = price;
        this.amount = amount;
    }
}

/**
 * Rider class
 */
export class Rider {
    id: number;
    name: string;
    amount: number;
    confirmed: number;

    performanceName: string;

    constructor(id: number, name: string, amount: number, confirmed: number) {
        this.id = id;
        this.name = name;
        this.amount = amount;
        this.confirmed = confirmed;
    }
}

/**
 * Performance class
 */
export class Performance {
    id: number;
    userId: number;
    eventId: number;
    startTime: string;
    endTime: string;
    contract: string;
    username: string;
    name: string;
    picture: string;

    constructor(
        id: number,
        userId: number,
        eventId: number,
        startTime: string,
        endTime: string,
        contract: string,
        username: string,
        name: string,
        picture: string
    ) {
        this.id = id;
        this.userId = userId;
        this.eventId = eventId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.contract = contract;
        this.username = username;
        this.name = name;
        this.picture = picture;
    }
}

/**
 * User class
 */
export class User {
    id: number;
    username: string;
    email: string;
    phone: string;
    firstName: string;
    surname: string;
    artist: number;
    picture: string;

    constructor(
        id: number,
        username: string,
        email: string,
        phone: string,
        firstName: string,
        surname: string,
        artist: number,
        picture: string
    ) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.phone = phone;
        this.firstName = firstName;
        this.surname = surname;
        this.artist = artist;
        this.picture = picture;
    }
}

/**
 * crew class
 */
export class Crew {
    id: number;
    profession: string;
    name: string;
    contactInfo: string;
    eventId: number;

    constructor(
        id: number,
        profession: string,
        name: string,
        contactInfo: string,
        eventId: number
    ) {
        this.id = id;
        this.profession = profession;
        this.name = name;
        this.contactInfo = contactInfo;
        this.eventId = eventId;
    }
}

/**
 * EventService class
 */
class EventService {
    //GET

    /**
     * This function gets an event from the database via server
     */
    getEvent(id: number): Promise<any> {
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + id, {
                method: 'GET',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    isError = isErrorRequest(response);
                    return response.json();
                })
                .then(json => {
                    if (json.jwt != undefined) refreshToken(json.jwt);
                    if (isError) return reject(json);
                    resolve(handleGetEventResponse(json.data[0]));
                })
                .catch(error => console.error('Error: ', error));
        });

        function handleGetEventResponse(json) {
            let pictureUrl: string = bufferToPicture(json.picture);
            let event: Event = new Event(
                json.event_id,
                json.name,
                json.host_id,
                json.active,
                json.location,
                json.longitude,
                json.latitude,
                json.description,
                json.start_time,
                json.end_time,
                pictureUrl
            );
            event.firstName = json.first_name;
            event.surname = json.surname;
            return event;
        }
    }

    /**
     * This function gets all performances for a specific event from the database via server
     */
    getEventPerformances(eventId: number): Promise<any> {
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId + '/performance', {
                method: 'GET',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    isError = isErrorRequest(response);
                    return response.json();
                })
                .then(json => {
                    if (json.jwt != undefined) refreshToken(json.jwt);
                    if (isError) return reject(json);
                    resolve(handleGetPerformanceResponse(json.data));
                })
                .catch(error => console.error('Error: ', error));
        });

        function handleGetPerformanceResponse(json) {
            return json.map(
                data =>
                    new Performance(
                        data.performance_id,
                        data.user_id,
                        data.event_id,
                        data.start_time,
                        data.end_time,
                        '',
                        data.username,
                        data.name,
                        bufferToPicture(data.picture)
                    )
            );
        }
    }

    /**
     * This function gets a contract from the database via server
     */
    getContract(eventId: number, performanceId: number): Promise<any> {
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch(
                '/api/event/' +
                    eventId +
                    '/performance/' +
                    performanceId +
                    '/contract',
                {
                    method: 'GET',
                    headers: {
                        'x-access-token': window.sessionStorage.getItem('jwt'),
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    }
                }
            )
                .then(response => {
                    isError = isErrorRequest(response);
                    return response.json();
                })
                .then(json => {
                    if (json.jwt != undefined) refreshToken(json.jwt);
                    if (isError) return reject(json);
                    resolve(handleGetContractResponse(json.data));
                })
                .catch(error => console.error('Error: ', error));
        });

        function handleGetContractResponse(json) {
            if (!json) return false;
            var arrayBufferView = new Uint8Array(json.data);
            var blob = new Blob([arrayBufferView], { type: 'application/pdf' });
            var urlCreator = window.URL || window.webkitURL;
            var contractUrl = urlCreator.createObjectURL(blob);
            urlCreator.revokeObjectURL(blob);
            return contractUrl;
        }
    }

    /**
     * This function gets all tickets in an event from the database via server
     */
    getEventTickets(eventId: number): Promise<any> {
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId + '/ticket', {
                method: 'GET',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    isError = isErrorRequest(response);
                    return response.json();
                })
                .then(json => {
                    if (json.jwt != undefined) refreshToken(json.jwt);
                    if (isError) return reject(json);
                    resolve(handleGetEventTicketsResponse(json));
                })
                .catch(error => console.error('Error: ', error));
        });

        function handleGetEventTicketsResponse(json) {
            return json.data.map(
                data =>
                    new Ticket(
                        data.name,
                        data.event_id,
                        data.price,
                        data.amount
                    )
            );
        }
    }

    /**
     * This function gets all riders in a performance from the database via server
     */
    getPerformanceRiders(eventId: number, performanceId: number): Promise<any> {
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId + '/performance/' + performanceId, {
                method: 'GET',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    isError = isErrorRequest(response);
                    return response.json();
                })
                .then(json => {
                    if (json.jwt != undefined) refreshToken(json.jwt);
                    if (isError) return reject(json);
                    resolve(handleGetPerformanceRidersResponse(json.data));
                })
                .catch(error => console.error('Error: ', error));
        });

        function handleGetPerformanceRidersResponse(json) {
            return json.map(data => {
                let rider: Rider = new Rider(
                    data.performance_id,
                    data.name,
                    data.amount,
                    data.confirmed
                );
                rider.performanceName = data.performance_name;
                return rider;
            });
        }
    }

    /**
     * This function gets all events linked to a specific user from the databse via server
     */
    getUsersEvents(userId: number, active: number): Promise<any> {
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/user/' + userId + '/event/' + active, {
                method: 'GET',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    isError = isErrorRequest(response);
                    return response.json();
                })
                .then(json => {
                    if (json.jwt != undefined) refreshToken(json.jwt);
                    if (isError) return reject(json);
                    resolve(handleGetUsersEventsResponse(json.data));
                })
                .catch(error => console.error('Error: ', error));
        });

        function handleGetUsersEventsResponse(json) {
            return json.map(data => {
                let pictureUrl: string = bufferToPicture(data.picture);
                return new Event(
                    data.event_id,
                    data.name,
                    userId,
                    active,
                    data.location,
                    0,
                    0,
                    '',
                    data.start_time,
                    data.end_time,
                    pictureUrl
                );
            });
        }
    }

    /**
     * This function gets all crews in an event from the database via server
     */
    getCrew(eventId: number): Promise<any> {
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId + '/crew', {
                method: 'GET',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    isError = isErrorRequest(response);
                    return response.json();
                })
                .then(json => {
                    if (json.jwt != undefined) refreshToken(json.jwt);
                    if (isError) return reject(json);
                    resolve(handleGetCrewResponse(json));
                })
                .catch(error => console.error('Error: ', error));
        });

        function handleGetCrewResponse(json) {
            return json.data.map(
                data =>
                    new Crew(
                        data.crew_id,
                        data.profession,
                        data.name,
                        data.contact_info,
                        data.event_id
                    )
            );
        }
    }

    //POST

    /**
     * This function sends a new event to the database via server
     */
    createEvent(
        userId: number,
        eventName: string,
        location: string,
        longitude: number,
        latitude: number,
        description: string,
        startTime: string,
        endTime: string
    ): Promise<any> {
        let data = {
            userId: userId,
            eventName: eventName,
            location: location,
            longitude: longitude,
            latitude: latitude,
            description: description,
            startTime: startTime,
            endTime: endTime
        };
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event', {
                method: 'POST',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    isError = isErrorRequest(response);
                    return response.json();
                })
                .then(json => {
                    if (json.jwt != undefined) refreshToken(json.jwt);
                    if (isError) return reject(json);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error('Error: ', error));
        });
    }

    /**
     * This function sends a new ticket to the database via server
     */
    createTicket(
        name: string,
        eventId: number,
        price: number,
        amount: number
    ): Promise<any> {
        let data = {
            name: name,
            price: price,
            amount: amount
        };
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId + '/ticket', {
                method: 'POST',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    isError = isErrorRequest(response);
                    return response.json();
                })
                .then(json => {
                    if (json.jwt != undefined) refreshToken(json.jwt);
                    if (isError) return reject(json);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error('Error: ', error));
        });
    }

    /**
     * This function sends a performance to the database via server
     */
    createPerformance(
        userId: number,
        eventId: number,
        startTime: string,
        endTime: string,
        name: string
    ): Promise<any> {
        let data = {
            userId: userId,
            startTime: startTime,
            endTime: endTime,
            name: name
        };
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId + '/performance', {
                method: 'POST',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    isError = isErrorRequest(response);
                    return response.json();
                })
                .then(json => {
                    if (json.jwt != undefined) refreshToken(json.jwt);
                    if (isError) return reject(json);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error('Error: ', error));
        });
    }

    /**
     * This function sends a new rider to the database via server
     */
    createRider(
        performanceId: number,
        eventId: number,
        name: string,
        amount: number
    ): Promise<any> {
        let data = { name: name, amount: amount };
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch(
                '/api/event/' +
                    eventId +
                    '/performance/' +
                    performanceId +
                    '/rider',
                {
                    method: 'POST',
                    headers: {
                        'x-access-token': window.sessionStorage.getItem('jwt'),
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }
            )
                .then(response => {
                    isError = isErrorRequest(response);
                    return response.json();
                })
                .then(json => {
                    if (json.jwt != undefined) refreshToken(json.jwt);
                    if (isError) return reject(json);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error('Error: ', error));
        });
    }

    /**
     * This function sends a new crew to the datbase via server
     */
    createCrew(
        eventId: number,
        profession: string,
        name: string,
        contactInfo: string
    ): Promise<any> {
        let data = {
            profession: profession,
            name: name,
            contactInfo: contactInfo
        };
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId + '/crew', {
                method: 'POST',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    isError = isErrorRequest(response);
                    return response.json();
                })
                .then(json => {
                    if (json.jwt != undefined) refreshToken(json.jwt);
                    if (isError) return reject(json);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error('Error: ', error));
        });
    }

    //DELETE

    /**
     * This function deletes a crew from the database via the server
     */
    deleteCrew(eventId: number, crewId: number): Promise<any> {
        let isError: boolean = false;
        let data = { crewId: crewId };
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId + '/crew', {
                method: 'DELETE',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    isError = isErrorRequest(response);
                    return response.json();
                })
                .then(json => {
                    if (json.jwt != undefined) refreshToken(json.jwt);
                    if (isError) return reject(json);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error('Error: ', error));
        });
    }

    /**
     * This function deletes a rider from the database via the server
     */
    deleteRider(
        eventId: number,
        performanceId: number,
        name: string
    ): Promise<any> {
        let data = { name: name };
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch(
                '/api/event/' +
                    eventId +
                    '/performance/' +
                    performanceId +
                    '/rider',
                {
                    method: 'DELETE',
                    headers: {
                        'x-access-token': window.sessionStorage.getItem('jwt'),
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }
            )
                .then(response => {
                    isError = isErrorRequest(response);
                    return response.json();
                })
                .then(json => {
                    if (json.jwt != undefined) refreshToken(json.jwt);
                    if (isError) return reject(json);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error('Error: ', error));
        });
    }

    /**
     * This function deletes an event from the database via the server
     */
    deleteEvent(eventId: number): Promise<any> {
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId, {
                method: 'DELETE',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    isError = isErrorRequest(response);
                    return response.json();
                })
                .then(json => {
                    if (json.jwt != undefined) refreshToken(json.jwt);
                    if (isError) return reject(json);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error('Error: ', error));
        });
    }

    //PUT

    /**
     * This function updates a ticket in the database via the server
     */
    updateTicket(
        oldName: string,
        name: string,
        eventId: number,
        price: number,
        amount: number
    ): Promise<any> {
        let data = {
            oldName: oldName,
            name: name,
            price: price,
            amount: amount
        };
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId + '/ticket', {
                method: 'PUT',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    isError = isErrorRequest(response);
                    return response.json();
                })
                .then(json => {
                    if (json.jwt != undefined) refreshToken(json.jwt);
                    if (isError) return reject(json);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error('Error: ', error));
        });
    }

    /**
     * This function updates a rider in the database via the server
     */
    updateRider(
        oldName: string,
        performanceId: number,
        eventId: number,
        name: string,
        amount: number,
        confirmed: number
    ): Promise<any> {
        let data = {
            oldName: oldName,
            name: name,
            amount: amount,
            confirmed: confirmed
        };
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch(
                '/api/event/' +
                    eventId +
                    '/performance/' +
                    performanceId +
                    '/rider',
                {
                    method: 'PUT',
                    headers: {
                        'x-access-token': window.sessionStorage.getItem('jwt'),
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }
            )
                .then(response => {
                    isError = isErrorRequest(response);
                    return response.json();
                })
                .then(json => {
                    if (json.jwt != undefined) refreshToken(json.jwt);
                    if (isError) return reject(json);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error('Error: ', error));
        });
    }

    /**
     * This function updates an eventpicture in the database via the server
     */
    updatePicture(file: File, eventId: number): Promise<any> {
        return new Promise(resolve => {
            const req: XMLHttpRequest = new XMLHttpRequest();

            const formData: FormData = new FormData();
            formData.append('file', file, file.name);

            req.open('PUT', '/api/event/' + eventId + '/picture');

            req.setRequestHeader(
                'x-access-token',
                window.sessionStorage.getItem('jwt')
            );

            req.send(formData);

            return resolve('updatePicture done');
        });
    }

    /**
     * This function updates an event in the database via the server
     */
    updateEvent(
        eventId: number,
        name: string,
        hostId: number,
        active: number,
        location: string,
        longitude: number,
        latitude: number,
        description: string,
        startTime: string,
        endTime: string
    ): Promise<any> {
        let data = {
            eventName: name,
            hostId: hostId,
            active: active,
            location: location,
            longitude: longitude,
            latitude: latitude,
            description: description,
            startTime: startTime,
            endTime: endTime
        };
        let isError: boolean = false;
        console.log(data);
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId, {
                method: 'PUT',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    isError = isErrorRequest(response);
                    return response.json();
                })
                .then(json => {
                    if (json.jwt != undefined) refreshToken(json.jwt);
                    if (isError) return reject(json);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error('Error: ', error));
        });
    }

    /**
     * This function updates a contract in the database via the server
     */
    updateContract(
        file: File,
        eventId: number,
        performanceId: number
    ): Promise<any> {
        return new Promise(resolve => {
            const req: XMLHttpRequest = new XMLHttpRequest();

            const formData: FormData = new FormData();
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

            return resolve('updateContract done');
        });
    }

    /**
     * This function updates a performance in the database via the server
     */
    updatePerformance(
        performanceId: number,
        eventId: number,
        startTime: string,
        endTime: string,
        name: string
    ): Promise<any> {
        let data = {
            startTime: startTime,
            endTime: endTime,
            name: name
        };
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId + '/performance/' + performanceId, {
                method: 'PUT',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    isError = isErrorRequest(response);
                    return response.json();
                })
                .then(json => {
                    if (json.jwt != undefined) refreshToken(json.jwt);
                    if (isError) return reject(json);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error('Error: ', error));
        });
    }

    /**
     * This function updates a crew in the database via the server
     */
    updateCrew(
        oldName: string,
        eventId: number,
        crewId: number,
        profession: string,
        name: string,
        contactInfo: string
    ): Promise<any> {
        let data = {
            oldName: oldName,
            profession: profession,
            name: name,
            contactInfo: contactInfo,
            crewId: crewId
        };
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId + '/crew', {
                method: 'PUT',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    isError = isErrorRequest(response);
                    return response.json();
                })
                .then(json => {
                    if (json.jwt != undefined) refreshToken(json.jwt);
                    if (isError) return reject(json);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error('Error: ', error));
        });
    }

    /**
     * This function delets a ticket from the database via the server
     */
    deleteTicket(name: string, eventId: number): Promise<any> {
        let data = { name: name, eventId: eventId };
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId + '/ticket', {
                method: 'DELETE',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    isError = isErrorRequest(response);
                    return response.json();
                })
                .then(json => {
                    if (json.jwt != undefined) refreshToken(json.jwt);
                    if (isError) return reject(json);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error('Error: ', error));
        });
    }

    /**
     * This function deletes a performance from the database via the server
     */
    deletePerformance(eventId: number, performanceId: number): Promise<any> {
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId + '/performance/' + performanceId, {
                method: 'DELETE',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    isError = isErrorRequest(response);
                    return response.json();
                })
                .then(json => {
                    if (json.jwt != undefined) refreshToken(json.jwt);
                    if (isError) return reject(json);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error('Error: ', error));
        });
    }
}

/**
 * UserService class
 */
class UserService {
    //GET

    /**
     * This function gets a user from the database via server
     */
    getUser(userId: number): Promise<any> {
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/user/' + userId, {
                method: 'GET',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    isError = isErrorRequest(response);
                    return response.json();
                })
                .then(json => {
                    if (json.jwt != undefined) refreshToken(json.jwt);
                    if (isError) return reject(json);
                    setArtist(json.data[0].artist);
                    resolve(handleGetUserResponse(json.data[0]));
                })
                .catch(error => console.error('Error: ', error));
        });

        function handleGetUserResponse(json: *) {
            let pictureUrl: string = bufferToPicture(json.picture);
            return new User(
                json.user_id,
                json.username,
                json.email,
                json.phone,
                json.first_name,
                json.surname,
                json.artist,
                pictureUrl
            );
        }
    }

    /**
     * This function gets all artists from the database via the server
     */
    getAllArtists(): Promise<any> {
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/user', {
                method: 'GET',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    isError = isErrorRequest(response);
                    return response.json();
                })
                .then(json => {
                    if (json.jwt != undefined) refreshToken(json.jwt);
                    if (isError) return reject(json);
                    resolve(handleGetAllUsersResponse(json.data));
                })
                .catch(error => console.error('Error: ', error));
        });

        function handleGetAllUsersResponse(json: *) {
            return json.map(
                data =>
                    new User(
                        data.user_id,
                        data.username,
                        '',
                        '',
                        data.first_name,
                        data.surname,
                        1,
                        ''
                    )
            );
        }
    }

    //DELETE

    /**
     * This function deletes a user from the database via server
     */
    deleteUser(userId: number, password: string): Promise<any> {
        let isError: boolean = false;
        let data = { password: password };
        return new Promise((resolve, reject) => {
            fetch('/api/user/' + userId, {
                method: 'DELETE',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    isError = isErrorRequest(response);
                    return response.json();
                })
                .then(json => {
                    if (isError) return reject(json);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error('Error: ', error));
        });
    }

    //PUT

    /**
     * This function updates a user in the database via the server
     */
    updateUser(
        userId: number,
        username: string,
        email: string,
        phone: string,
        firstName: string,
        lastName: string,
        artist: number
    ): Promise<any> {
        let data = {
            username: username,
            email: email,
            phone: phone,
            firstName: firstName,
            lastName: lastName,
            artist: artist
        };
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/user/' + userId, {
                method: 'PUT',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    isError = isErrorRequest(response);
                    console.log(response);
                    return response.json();
                })
                .then(json => {
                    if (json.jwt != undefined) refreshToken(json.jwt);
                    if (isError) return reject(json);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error('Error: ', error));
        });
    }

    /**
     * This function tells the server to send a new autogenerated password by email
     */
    forgotPassword(email: string): Promise<any> {
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/user/' + email, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    isError = isErrorRequest(response);
                    if (isError) return reject(response.status);
                    resolve(response.status);
                })
                .catch(error => console.error('Error: ', error));
        });
    }

    /**
     * This function updates a password in the database via the server
     */
    updatePassword(
        userId: string,
        oldPassword: string,
        newPassword: string
    ): Promise<any> {
        let data = {
            oldPassword: oldPassword,
            newPassword: newPassword
        };
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/user/' + userId + '/password', {
                method: 'PUT',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    isError = isErrorRequest(response);
                    return response.json();
                })
                .then(json => {
                    if (json.jwt != undefined) refreshToken(json.jwt);
                    if (isError) return reject(json);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error('Error: ', error));
        });
    }

    /**
     * This function updates a profilepicture in the database via server
     */
    updatePicture(file: File, userId: number): Promise<any> {
        return new Promise(resolve => {
            const req: XMLHttpRequest = new XMLHttpRequest();

            const formData: FormData = new FormData();
            formData.append('file', file, file.name);

            req.open('PUT', '/api/user/' + userId + '/picture');

            req.setRequestHeader(
                'x-access-token',
                window.sessionStorage.getItem('jwt')
            );

            req.send(formData);

            return resolve('updatePicture done');
        });
    }

    //POST

    /**
     * This function posts a new user to the database via the server
     */
    createUser(
        username: string,
        password: string,
        email: string,
        phone: string,
        firstName: string,
        lastName: string,
        artist: number
    ): Promise<any> {
        let data = {
            username: username,
            password: password,
            email: email,
            phone: phone,
            firstName: firstName,
            lastName: lastName,
            artist: artist
        };
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/user', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    isError = isErrorRequest(response);
                    return response.json();
                })
                .then(json => {
                    if (json.jwt != undefined) refreshToken(json.jwt);
                    if (isError) return reject(json);
                    console.log('services' + json);
                    resolve(json);
                })
                .catch(error => console.log(error));
        });
    }

    /**
     * This function logs in a user via server
     */
    loginUser(password: string, email: string): Promise<any> {
        let data = {
            password: password,
            email: email
        };

        console.log('pw ' + password + ' email ' + email);
        console.log(JSON.stringify(data));

        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/login', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    isError = isErrorRequest(response);
                    return response.json();
                })
                .then(json => {
                    if (json.jwt != undefined) refreshToken(json.jwt);
                    if (isError) return reject(json);
                    console.log(json);
                    setUser(Number(json.userId));
                    resolve(json);
                })
                .catch(error => console.error('Error: ', error));
        });
    }
}

/**
 * This function converts a buffer to a picture
 */
function bufferToPicture(buffer: *) {
    if (buffer == null) return '';
    let arrayBufferView = new Uint8Array(buffer.data);
    let blob = new Blob([arrayBufferView], { type: 'image' });
    let urlCreator = window.URL || window.webkitURL;
    let pictureUrl = urlCreator.createObjectURL(blob);
    urlCreator.revokeObjectURL(blob);
    return pictureUrl;
}

/**
 * This function returns error messages
 */
function isErrorRequest(response: *): boolean {
    //TODO use the error component here instead of the return true?
    switch (response.status) {
        case 200:
            console.log(response.status + ': Successful request');
            return false;
        case 400:
            printError(response, 'Bad request');
            return true;
        case 401:
            // printError(response, 'You are unauthorized');
            console.log('Unauthorised!');
            return true;
        case 403:
            printError(response, 'Forbidden request!');
            return true;
        case 409:
            // printError(response, 'Conflict error');
            return true;
        case 500:
            printError(response, 'SQL-error!');
            return true;
        default:
            console.log(
                'Unhandled status: ' +
                    response.status +
                    '. Possibly an error, but treated as a success request.'
            );
            return false;
    }

    function printError(response: *, errorMsg: string): void {
        response.json().then(json => {
            // console.log(response.status + ': ' + errorMsg);
            // console.log(json.error);
            alert(response.status + ': ' + errorMsg + '\n' + json.error);
        });
    }
}

/**
 * This function refreshes the passed token
 */
function refreshToken(jwt) {
    window.sessionStorage.setItem('jwt', jwt);
}

/**
 * This function sets user in sessionstorage
 */
function setUser(userId: number) {
    window.sessionStorage.setItem('user', userId);
}

function setArtist(artist: number | string) {
    window.sessionStorage.setItem('artist', artist);
}

export let userService = new UserService();
export let eventService = new EventService();
