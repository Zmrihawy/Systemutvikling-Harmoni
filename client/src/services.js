//@flow

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

export class Ticket {
    name: string;
    eventId: number;
    price: number;
    amount: number;

    constructor(
        name: string,
        eventId: number,
        price: number,
        amount: number
    ) {
        this.name = name;
        this.eventId = eventId;
        this.price = price;
        this.amount = amount;
    }
}

export class Rider {
    id: number;
    name: string;
    amount: number;
    confirmed: number;

    constructor(id: number, name: string, amount: number, confirmed: number) {
        this.id = id;
        this.name = name;
        this.amount = amount;
        this.confirmed = confirmed;
    }
}

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

class EventService {
    //GET
    getEvent(id: number): Promise<any> {
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + id, {
                method: 'GET',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    'Accept': 'application/json',
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
            return new Event(
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
                pictureUrl,
                json.first_name,
                json.surname
            );
        }
    }

    getAllEvents(): Promise<any> {
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event', {
                method: 'GET',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    'Accept': 'application/json',
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
                    resolve(handleGetAllEventsResponse(json));
                })
                .catch(error => console.error('Error: ', error));
        });

        function handleGetAllEventsResponse(json) {
            return json.map(data => {
                    let pictureUrl: string = bufferToPicture(data.picture);
                    return new Event(
                        data.event_id,
                        data.name,
                        data.host_id,
                        data.active,
                        data.location,
                        data.longitude,
                        data.latitude,
                        data.description,
                        data.start_time,
                        data.end_time,
                        pictureUrl
                    )
                }
            );
        }
    }

    //har
    getEventPerformances(eventId: number): Promise<any> {
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId + '/performance', {
                method: 'GET',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    'Accept': 'application/json',
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

    getPicture(eventId: number): Promise<any> {
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId + '/picture', {
                method: 'GET',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    'Accept': 'application/json',
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
                    resolve(handleGetPictureResponse(json.data));
                })
                .catch(error => console.error('Error: ', error));
        });

        function handleGetPictureResponse(json) {
            let pictureUrl: string = bufferToPicture(json.picture);
            return pictureUrl;
        }
    }


    getContract(eventId: number, performanceId: number): Promise<any> {
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId + '/performance/' + performanceId + '/contract', {
                method: 'GET',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    'Accept': 'application/json',
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
                    resolve(handleGetContractResponse(json.data));
                })
                .catch(error => console.error('Error: ', error));
        });

        function handleGetContractResponse(json) {
            var arrayBufferView = new Uint8Array(json.data);
            var blob = new Blob([arrayBufferView], {type: 'application/pdf'});
            var urlCreator = window.URL || window.webkitURL;
            var contractUrl = urlCreator.createObjectURL(blob);
            urlCreator.revokeObjectURL(blob);
            return contractUrl;
        }
    }

    getAllRiders(eventId: number): Promise<any> {
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId + '/rider', {
                method: 'GET',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    'Accept': 'application/json',
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
                    resolve(handleGetAllRidersResponse(json));
                })
                .catch(error => console.error('Error: ', error));
        });

        function handleGetAllRidersResponse(json) {
            return json.map(
                data => new Rider(data.rider_id, data.name, data.amount, 0)
            );
        }
    }

    getContract(eventId: number, artistId: number): Promise<any> {
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId + '/user/' + artistId + '/contract', {
                method: 'GET',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    'Accept': 'application/json',
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
                    resolve(handleGetContractResponse(json.data[0]));
                })
                .catch(error => console.error('Error: ', error));
        });

        function handleGetContractResponse(json) {
            return JSON.stringify(json);
        }
    }

    getEventContracts(eventId: number): Promise<any> {
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId + '/contracts', {
                method: 'GET',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    'Accept': 'application/json',
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
                    resolve(handleGetEventContractsResponse(json));
                })
                .catch(error => console.error('Error: ', error));
        });

        function handleGetEventContractsResponse(json) {
            return json.map(data => String(JSON.stringify(data)));
        }
    }

    //har
    getEventTickets(eventId: number): Promise<any> {
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId + '/ticket', {
                method: 'GET',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    'Accept': 'application/json',
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

    //har
    getPerformanceRiders(
        eventId: number,
        performanceId: number
    ): Promise<any> {
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId + '/performance/' + performanceId, {
                method: 'GET',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    'Accept': 'application/json',
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
                    resolve(handleGetPerformanceRidersResponse(json));
                })
                .catch(error => console.error('Error: ', error));
        });

        function handleGetPerformanceRidersResponse(json) {
            return json.map(
                data => new Rider(data.rider_id, data.name, data.amount, data.confirmed)
            );
        }
    }

    //har
    getUsersEvents(userId: number, active: number): Promise<any> {
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/user/' + userId + '/event/', {
                method: 'GET',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: active
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
                    let pictureUrl: string = bufferToPicture(json.picture);
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
                    )
                }
            );
        }
    }

    //har
    getCrew(eventId: number): Promise<any> {
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId + '/crew', {
                method: 'GET',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    'Accept': 'application/json',
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
    //HAR
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
                    'Accept': 'application/json',
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

    //HAR
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
                    'Accept': 'application/json',
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

    //HAR
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
                    'Accept': 'application/json',
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

    //HAR
    createRider(
        performanceId: number,
        eventId: number,
        name: string,
        amount: number
    ): Promise<any> {
        let data = {name: name, amount: amount};
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId + '/performance/' + performanceId + '/rider', {
                method: 'POST',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    'Accept': 'application/json',
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

    //HAR
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
                    'Accept': 'application/json',
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
    //HAR
    deleteCrew(eventId: number, crewId: number): Promise<any> {
        let isError: boolean = false;
        let data = {crewId: crewId};
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

    //HAR
    deleteRider(
        eventId: number,
        performanceId: number,
        name: string
    ): Promise<any> {
        let data = {name: name};
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId + '/performance/' + performanceId + '/rider', {
                method: 'DELETE',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    'Accept': 'application/json',
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

    deleteEvent(eventId: number): Promise<any> {
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId, {
                method: 'DELETE',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    'Accept': 'application/json',
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
    //har
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
                    'Accept': 'application/json',
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

    //HAR
    updateRider(
        oldName: string,
        performanceId: number,
        eventId: number,
        name: string,
        amount: number
    ): Promise<any> {
        let data = {
            oldName: oldName,
            name: name,
            amount: amount
        };
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId + '/performance/' + performanceId + '/rider', {
                method: 'PUT',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    'Accept': 'application/json',
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

    updatePicture(file: File, eventId: number): Promise<any> {
        return new Promise(resolve => {
            const req: XMLHttpRequest = new XMLHttpRequest();

            const formData: FormData = new FormData();
            formData.append('file', file, file.name);

            req.open(
                'PUT',
                '/api/event/' + eventId + '/picture'
            );

            req.setRequestHeader(
                'x-access-token',
                window.sessionStorage.getItem('jwt')
            );

            req.send(formData);

            return resolve('updatePicture done');
        });
    }

    //HAR
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
                    'Accept': 'application/json',
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

    updateContract(file: File, eventId: number, performanceId: number): Promise<any> {
        return new Promise(resolve => {
            const req: XMLHttpRequest = new XMLHttpRequest();

            const formData: FormData = new FormData();
            formData.append('file', file, file.name);

            req.open(
                'PUT',
                '/api/event/' + eventId + '/performance/' + performanceId + '/contract'
            );

            req.setRequestHeader(
                'x-access-token',
                window.sessionStorage.getItem('jwt')
            );

            req.send(formData);

            return resolve('updateContract done');
        });
    }

    //HAR
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
                    'Accept': 'application/json',
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

    //har
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
                    'Accept': 'application/json',
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

    //har
    deleteTicket(name: string, eventId: number): Promise<any> {
        let data = {name: name, eventId: eventId};
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId + '/ticket', {
                method: 'DELETE',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    'Accept': 'application/json',
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

    deletePerformance(
        eventId: number,
        performanceId: number
    ): Promise<any> {
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/event/' + eventId + '/performance/' + performanceId, {
                method: 'DELETE',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
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

class UserService {
    //GET

    //har
    getUser(userId: number): Promise<any> {
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/user/' + userId, {
                method: 'GET',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    'Accept': 'application/json',
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

    getPicture(userId: number): Promise<any> {
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/user/' + userId + '/picture', {
                method: 'GET',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    'Accept': 'application/json',
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
                    resolve(handleGetPictureResponse(json.data));
                })
                .catch(error => console.error('Error: ', error));
        });

        function handleGetPictureResponse(json: *) {
            let pictureUrl: string = bufferToPicture(json.picture);
            return pictureUrl;
        }
    }

    getAllArtists(): Promise<any> {
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/api/user', {
                method: 'GET',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    'Accept': 'application/json',
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
                        '',
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
    //har
    deleteUser(userId: number, password: string): Promise<any> {
        let isError: boolean = false;
        let data = {password: password};
        return new Promise((resolve, reject) => {
            fetch('/api/user/' + userId, {
                method: 'DELETE',
                headers: {
                    'x-access-token': window.sessionStorage.getItem('jwt'),
                    'Accept': 'application/json',
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
    //har
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
                    'Accept': 'application/json',
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

    forgotPassword(email: string): Promise<any> {
        let isError: boolean = false;
        return new Promise((resolve, reject) => {
            fetch('/user/' + email, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
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

    updatePassword(userId: string, oldPassword: string, newPassword: string): Promise<any> {
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
                    'Accept': 'application/json',
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

    updatePicture(file: File, userId: number): Promise<any> {
        return new Promise(resolve => {
            const req: XMLHttpRequest = new XMLHttpRequest();

            const formData: FormData = new FormData();
            formData.append('file', file, file.name);

            req.open(
                'PUT',
                '/api/user/' + userId + '/picture'
            );

            req.setRequestHeader(
                'x-access-token',
                window.sessionStorage.getItem('jwt')
            );

            req.send(formData);

            return resolve('updatePicture done');
        });
    }


    //POST
    //HAR
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
                    'Accept': 'application/json',
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

    //har
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
                    'Accept': 'application/json',
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

function bufferToPicture(buffer: *) {
    if (buffer == null) return '';
    let arrayBufferView = new Uint8Array(buffer.data);
    let blob = new Blob([arrayBufferView], {type: 'image'});
    let urlCreator = window.URL || window.webkitURL;
    let pictureUrl = urlCreator.createObjectURL(blob);
    urlCreator.revokeObjectURL(blob);
    return pictureUrl;
}

function isErrorRequest(response: *): boolean {
    //TODO use the error component here insted of the return true?
    switch (response.status) {
        case 200:
            console.log(response.status + ': Successful request');
            return false;
        case 400:
            printError(response, 'Bad request');
            return true;
        case 401:
            printError(response, 'You are unauthorized');
            return true;
        case 403:
            printError(response, 'Forbidden request!');
            return true;
        case 409:
            printError(response, 'Conflict error');
            return true;
        case 500:
            printError(response, 'SQL-error!');
            return true;
        default:
            console.log('Unhandled status: ' + response.status + '. Possibly an error, but treated as a success request.');
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

function refreshToken(jwt) {
    window.sessionStorage.setItem('jwt', jwt);
}

function setUser(userId: number) {
    window.sessionStorage.setItem('user', userId);
}

export let userService = new UserService();
export let eventService = new EventService();
