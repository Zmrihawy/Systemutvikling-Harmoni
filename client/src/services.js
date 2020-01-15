//@flow

export class Event {
    constructor(
        id,
        name,
        hostId,
        active,
        location,
        description,
        startTime,
        endTime
    ) {
        this.id = id;
        this.name = name;
        this.hostId = hostId;
        this.active = active;
        this.location = location;
        this.description = description;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}

export class Ticket {
    name;
    eventId;
    price;
    amount;
    description;

    constructor(name, eventId, price, amount, description) {
        this.name = name;
        this.eventId = eventId;
        this.price = price;
        this.amount = amount;
        this.description = description;
    }
}

export class Rider {
    id;
    name;
    amount;

    constructor(id, name, amount) {
        this.id = id;
        this.name = name;
        this.amount = amount;
    }
}

export class Performance {
    id: number;
    userId: number;
    eventId: number;
    startTime: string;
    endTime: string;
    contract: string;

    constructor(
        id: number,
        userId: number,
        eventId: number,
        startTime: string,
        endTime: string,
        contract: string
    ) {
        this.id = id;
        this.userId = userId;
        this.eventId = eventId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.contract = contract;
    }
}

export class User {
    id;
    username;
    email;
    phone;
    firstName;
    surname;

    constructor(id, username, email, phone, firstName, surname) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.phone = phone;
        this.firstName = firstName;
        this.surname = surname;
    }
}

export class Crew {
    id;
    profession;
    name;
    contactInfo;
    eventId;

    constructor(id, profession, name, contactInfo, eventId) {
        this.id = id;
        this.profession = profession;
        this.name = name;
        this.contactInfo = contactInfo;
        this.eventId = eventId;
    }
}

class EventService {
    //GET
    getEvent(userId: number, id: number): Promise<any> {
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + id, {
                method: 'GET',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    userId: userId
                }
            })
                .then(response => {
                    isError = isErrorStatus(response.status);
                    return response.json();
                })
                .then(json => {
                    if (isError) return reject(json);
                    refreshToken(json.jwt);
                    resolve(handleGetEventResponse(json.data[0]));
                })
                .catch(error => console.error('Error: ', error));
        });

        function handleGetEventResponse(json) {
            return new Event(
                json.event_id,
                json.name,
                json.host_id,
                json.active,
                json.location,
                json.description,
                json.startTime,
                json.endTime
            );
        }
    }

    getAllEvents(userId: number): Promise<any> {
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/events/', {
                method: 'GET',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    userId: userId
                }
            })
                .then(response => {
                    isError = isErrorStatus(response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    if (isError) return reject(json);
                    resolve(handleGetAllEventsResponse(json));
                })
                .catch(error => console.error('Error: ', error));
        });

        function handleGetAllEventsResponse(json) {
            return json.map(
                data =>
                    new Event(
                        data.event_id,
                        data.name,
                        data.host_id,
                        data.active,
                        data.location,
                        data.description,
                        data.start_time,
                        data.end_time
                    )
            );
        }
    }

    getPerformance(userId: number, id: number): Promise<any> {
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/performance/' + id, {
                method: 'GET',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    userId: userId
                }
            })
                .then(response => {
                    isError = isErrorStatus(response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    if (isError) return reject(json);
                    resolve(handleGetPerformanceResponse(json.data[0]));
                })
                .catch(error => console.error('Error: ', error));
        });

        function handleGetPerformanceResponse(json) {
            return new Performance(
                json.performance_id,
                json.user_id,
                json.event_id,
                json.start_time,
                json.end_time
            );
        }
    }

    getAllRiders(userId: number, eventId: number): Promise<any> {
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId + '/rider', {
                method: 'GET',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    userId: userId
                }
            })
                .then(response => {
                    isError = isErrorStatus(response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    if (isError) return reject(json);
                    resolve(handleGetAllRidersResponse(json));
                })
                .catch(error => console.error('Error: ', error));
        });

        function handleGetAllRidersResponse(json) {
            return json.map(
                data => new Rider(data.rider_id, data.name, data.amount)
            );
        }
    }

    getContract(
        userId: number,
        eventId: number,
        artistId: number
    ): Promise<any> {
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId + '/user/' + artistId + '/contract', {
                method: 'GET',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    userId: userId
                }
            })
                .then(response => {
                    isError = isErrorStatus(response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    if (isError) return reject(json);
                    resolve(handleGetContractResponse(json.data[0]));
                })
                .catch(error => console.error('Error: ', error));
        });

        function handleGetContractResponse(json) {
            return JSON.stringify(json);
        }
    }

    getEventContracts(userId: number, eventId: number): Promise<any> {
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId + '/contracts', {
                method: 'GET',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    userId: userId
                }
            })
                .then(response => {
                    isError = isErrorStatus(response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    if (isError) return reject(json);
                    resolve(handleGetEventContractsResponse(json));
                })
                .catch(error => console.error('Error: ', error));
        });

        function handleGetEventContractsResponse(json) {
            return json.map(data => String(JSON.stringify(data)));
        }
    }

    getEventTickets(userId: number, eventId: number): Promise<any> {
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId + '/tickets', {
                method: 'GET',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    userId: userId
                }
            })
                .then(response => {
                    isError = isErrorStatus(response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    if (isError) return reject(json);
                    resolve(handleGetEventTicketsResponse(json));
                })
                .catch(error => console.error('Error: ', error));
        });

        function handleGetEventTicketsResponse(json) {
            return json.map(
                data =>
                    new Ticket(
                        data.name,
                        data.event_id,
                        data.price,
                        data.amount,
                        data.description
                    )
            );
        }
    }

    getPerformanceRiders(
        userId: number,
        eventId: number,
        performanceId: number
    ): Promise<any> {
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/user/event/' + eventId + '/' + performanceId, {
                method: 'GET',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    userId: userId
                }
            })
                .then(response => {
                    isError = isErrorStatus(response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    if (isError) return reject(json);
                    resolve(handleGetPerformanceRidersResponse(json));
                })
                .catch(error => console.error('Error: ', error));
        });

        function handleGetPerformanceRidersResponse(json) {
            return json.map(
                data => new Rider(data.rider_id, data.name, data.amount)
            );
        }
    }

    getUsersEvents(userId: number, active: number): Promise<any> {
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/user/' + userId + '/event/' + active, {
                method: 'GET',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    userId: userId
                }
            })
                .then(response => {
                    isError = isErrorStatus(response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    if (isError) return reject(json);
                    resolve(handleGetUsersEventsResponse(json));
                })
                .catch(error => console.error('Error: ', error));
        });

        function handleGetUsersEventsResponse(json) {
            return json.map(
                data =>
                    new Event(
                        data.event_id,
                        data.name,
                        data.host_id,
                        data.active,
                        data.location,
                        data.description,
                        data.startTime,
                        data.endTime
                    )
            );
        }
    }

    getCrew(userId: number, eventId: number): Promise<any> {
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId + '/crew', {
                method: 'GET',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    userId: userId
                }
            })
                .then(response => {
                    isError = isErrorStatus(response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    if (isError) return reject(json);
                    resolve(handleGetCrewResponse(json));
                })
                .catch(error => console.error('Error: ', error));
        });

        function handleGetCrewResponse(json) {
            return json.map(
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
    createEvent(
        userId: number,
        name: string,
        active: number,
        location: string,
        description: string,
        startTime: string,
        endTime: string
    ): Promise<any> {
        let data = {
            userId: userId,
            name: name,
            active: active,
            location: location,
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
                    'Content-Type': 'application/json',
                    userId: userId
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    isError = isErrorStatus(response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    if (isError) return reject(json);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error('Error: ', error));
        });
    }

    createTicket(
        userId: number,
        name: string,
        eventId: number,
        price: number,
        amount: number,
        description: string
    ): Promise<any> {
        let data = {
            name: name,
            eventId: eventId,
            price: price,
            amount: amount,
            description: description
        };
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId + '/ticket', {
                method: 'POST',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    userId: userId
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    isError = isErrorStatus(response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    if (isError) return reject(json);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error('Error: ', error));
        });
    }

    createPerformance(
        userId: number,
        eventId: number,
        startTime: string,
        endTime: string,
        contract: string
    ): Promise<any> {
        let data = {
            userId: userId,
            eventId: eventId,
            startTime: startTime,
            endTime: endTime,
            contract: contract
        };
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId + '/performance', {
                method: 'POST',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    userId: userId
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    isError = isErrorStatus(response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    if (isError) return reject(json);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error('Error: ', error));
        });
    }

    createRider(
        userId: number,
        performanceId: number,
        name: string,
        amount: number
    ): Promise<any> {
        let data = { userId: userId, name: name, amount: amount };
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/performance/' + performanceId + '/rider', {
                method: 'POST',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    userId: userId
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    isError = isErrorStatus(response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    if (isError) return reject(json);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error('Error: ', error));
        });
    }

    createCrew(
        userId: number,
        eventId: number,
        profession: string,
        name: string,
        contactInfo: string
    ): Promise<any> {
        let data = {
            userId: userId,
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
                    'Content-Type': 'application/json',
                    userId: userId
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    isError = isErrorStatus(response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    if (isError) return reject(json);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error('Error: ', error));
        });
    }

    //DELETE
    deleteRider(
        userId: number,
        eventId: number,
        performanceId: number,
        name: string
    ): Promise<any> {
        let data = { performanceId: performanceId, name: name };
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId + '/rider', {
                method: 'DELETE',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    userId: userId
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    isError = isErrorStatus(response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    if (isError) return reject(json);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error('Error: ', error));
        });
    }

    deleteEvent(userId: number, eventId: number): Promise<any> {
        let data = { userId: userId };
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId, {
                method: 'DELETE',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    userId: userId
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    isError = isErrorStatus(response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    if (isError) return reject(json);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error('Error: ', error));
        });
    }

    //PUT
    updateTicket(
        userId: number,
        name: string,
        eventId: number,
        price: number,
        amount: number,
        description: string
    ): Promise<any> {
        let data = {
            userId: userId,
            name: name,
            eventId: eventId,
            price: price,
            amount: amount,
            description: description
        };
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId + '/ticket', {
                method: 'PUT',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    userId: userId
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    isError = isErrorStatus(response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    if (isError) return reject(json);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error('Error: ', error));
        });
    }

    updateRider(
        userId: number,
        eventId: number,
        riderId: number,
        name: string,
        amount: number
    ): Promise<any> {
        let data = {
            userId: userId,
            riderId: riderId,
            name: name,
            amount: amount
        };
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId + '/rider', {
                method: 'PUT',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    userId: userId
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    isError = isErrorStatus(response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    if (isError) return reject(json);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error('Error: ', error));
        });
    }

    updateEvent(
        userId: number,
        eventId: number,
        name: string,
        active: number,
        location: string,
        description: string,
        startTime: string,
        endTime: string
    ): Promise<any> {
        let data = {
            userId: userId,
            eventId: eventId,
            name: name,
            active: active,
            location: location,
            description: description,
            startTime: startTime,
            endTime: endTime
        };
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId, {
                method: 'PUT',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    userId: userId
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    isError = isErrorStatus(response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    if (isError) return reject(json);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error('Error: ', error));
        });
    }

    updateContract(
        userId: number,
        eventId: number,
        contract: string
    ): Promise<any> {
        let data = { userId: userId, eventId: eventId, contract: contract };
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId + '/contract', {
                method: 'PUT',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    userId: userId
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    isError = isErrorStatus(response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    if (isError) return reject(json);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error('Error: ', error));
        });
    }

    updatePerformance(
        userId: number,
        performanceId: number,
        eventId: number,
        startTime: string,
        endTime: string,
        contract: string
    ): Promise<any> {
        let data = {
            userId: userId,
            performanceId: performanceId,
            eventId: eventId,
            startTime: startTime,
            endTime: endTime,
            contract: contract
        };
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId + '/performance', {
                method: 'PUT',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    userId: userId
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    isError = isErrorStatus(response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    if (isError) return reject(json);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error('Error: ', error));
        });
    }

    updateCrew(
        userId: number,
        eventId: number,
        crewId: number,
        profession: string,
        name: string,
        contactInfo: string
    ): Promise<any> {
        let data = {
            userId: userId,
            profession: profession,
            name: name,
            contactInfo: contactInfo,
            crewId: crewId
        };
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId + '/crew/' + crewId, {
                method: 'PUT',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    userId: userId
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    isError = isErrorStatus(response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    if (isError) return reject(json);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error('Error: ', error));
        });
    }

    deleteTicket(userId: number, name: string, eventId: number): Promise<any> {
        let data = { userId: userId, name: name, eventId: eventId };
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId + '/ticket', {
                method: 'DELETE',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    userId: userId
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    isError = isErrorStatus(response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    if (isError) return reject(json);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error('Error: ', error));
        });
    }

    deletePerformance(
        userId: number,
        eventId: number,
        artistId: number
    ): Promise<any> {
        let data = { userId: userId, artistId: artistId };
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId + '/performance', {
                method: 'DELETE',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    userId: userId
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    isError = isErrorStatus(response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    if (isError) return reject(json);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error('Error: ', error));
        });
    }
}

class UserService {
    //GET
    getUser(userId: number): Promise<any> {
        let data = { userId: userId };
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/user/' + userId, {
                method: 'GET',
                headers: {
                    'x-access-token': 'MASTER',
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    userId: userId
                }
            })
                .then(response => {
                    isError = isErrorStatus(response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    if (isError) return reject(json);
                    resolve(handleGetUserResponse(json.data[0]));
                })
                .catch(error => console.error('Error: ', error));
        });
        function handleGetUserResponse(json: *) {
            return new User(
                json.user_id,
                json.username,
                json.email,
                json.phone,
                json.first_name,
                json.surname
            );
        }
    }

    getAllUsers(userId: number): Promise<any> {
        let data = { userId: userId };
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/users', {
                method: 'GET',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    userId: userId
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    isError = isErrorStatus(response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    if (isError) return reject(json);
                    resolve(handleGetAllUsersResponse(json));
                })
                .catch(error => console.error('Error: ', error));
        });

        function handleGetAllUsersResponse(json: *) {
            return json.map(
                data =>
                    new User(
                        data.user_id,
                        data.username,
                        data.email,
                        data.phone,
                        data.first_name,
                        data.surname
                    )
            );
        }
    }

    //DELETE
    deleteUser(userId: number): Promise<any> {
        let data = { userId: userId };
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('api/user/' + userId, {
                method: 'DELETE',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    userId: userId
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    isError = isErrorStatus(response.status);
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
    updateUser(
        userId: number,
        username: string,
        email: string,
        phone: string,
        firstName: string,
        lastName: string
    ): Promise<any> {
        let data = {
            username: username,
            email: email,
            phone: phone,
            firstName: firstName,
            lastName: lastName,
            userId: userId
        };
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('api/user/' + userId, {
                method: 'PUT',
                headers: {
                    'x-access-token': 'MASTER',
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    userId: userId
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    isError = isErrorStatus(response.status);
                    console.log(response);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    if (isError) return reject(json);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error('Error: ', error));
        });
    }

    updatePassword(userId: number, userMail: string): Promise<any> {
        let data = { userId: userId };
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('api/user/' + userMail, {
                method: 'PUT',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    userId: userId
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    isError = isErrorStatus(response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    if (isError) return reject(json);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error('Error: ', error));
        });
    }

    //POST
    createUser(
        username: string,
        password: string,
        email: string,
        phone: string,
        firstName: string,
        lastName: string
    ): Promise<any> {
        let data = {
            username: username,
            password: password,
            email: email,
            phone: phone,
            firstName: firstName,
            lastName: lastName
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
                    isError = isErrorStatus(response.status);
                    return response.json();
                })
                .then(json => {
                    if (isError)
                        return reject({
                            error: json.errno,
                            sqlMessage: json.sqlMessage
                        });
                    refreshToken(json.jwt);
                    console.log('services' + json);
                    resolve(json);
                })
                .catch(error => console.log(error));
        });
    }

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
                    console.log(isError);
                    isError = isErrorStatus(response.status);
                    console.log(isError);
                    console.log(response);
                    return response.json();
                })
                .then(json => {
                    console.log(json);
                    if (isError) return reject(json);
                    refreshToken(json.jwt);
                    console.log(json);
                    setUser(Number(json.userId));
                    resolve(json);
                })
                .catch(error => console.error('Error: ', error));
        });
    }
}

function isErrorStatus(status) {
    switch (status) {
        case 401:
            return true;
        case 500:
            return true;
        case 400:
            return true;
        default:
            return false;
    }
}

function refreshToken(jwt) {
    window.sessionStorage.setItem('jwt', jwt);
}

function setUser(userId: number) {
    window.sessionStorage.setItem('user', userId);
}

export let userService = new UserService();
export let eventService = new EventService();
