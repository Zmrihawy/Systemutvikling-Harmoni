//@flow

export class Event {
    id: number;
    name: string;
    hostId: number;
    active: number;
    location: string;
    description: string;
    startTime: string;
    endTime: string;

    constructor(id: number, name: string, hostId: number, active: number, location: string, description: string, startTime: string, endTime: string) {
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
    name: string;
    eventId: number;
    price: number;
    amount: number;
    description: string;

    constructor(name: string, eventId: number, price: number, amount: number, description: string) {
        this.name = name;
        this.eventId = eventId;
        this.price = price;
        this.amount = amount;
        this.description = description;
    }
}

export class Rider {
    id: number;
    name: string;
    amount: number;

    constructor(id: number, name: string, amount: number) {
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

    constructor(id: number, userId: number, eventId: number, startTime: string, endTime: string, contract: string) {
        this.id = id;
        this.userId = userId;
        this.eventId = eventId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.contract = contract;
    }
}

export class User {
    id: number;
    username: string;
    email: string;
    phone: string;
    firstName: string;
    surname: string;

    constructor(id: number, username: string, email: string, phone: string, firstName: string, surname: string) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.phone = phone;
        this.firstName = firstName;
        this.surname = surname;
    }
}

export class Crew {
    id: number;
    profession: string;
    name: string;
    contactInfo: string;
    eventId: number;

    constructor(id: number, profession: string, name: string, contactInfo: string, eventId: number) {
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
        return new Promise((resolve, reject) => {
            fetch("/api/event/" + id, {
                method: "GET",
                headers: {
                    'x-access-token': window.sessionStorage.getItem("jwt"),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (isErrorStatus(response.status)) reject("Error status: " + response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    resolve(handleGetEventResponse(json.data[0]));
                })
                .catch(error => console.error("Error: ", error));
        });

        function handleGetEventResponse(json) {
            return new Event(json.event_id, json.name, json.host_id, json.active, json.location, json.description, json.startTime, json.endTime);
        }
    }


    getAllEvents(): Promise<any> {
        return new Promise((resolve, reject) => {
            fetch("/api/events/", {
                method: "GET",
                headers: {
                    'x-access-token': window.sessionStorage.getItem("jwt"),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (isErrorStatus(response.status)) reject("Error status: " + response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    resolve(handleGetAllEventsResponse(json));
                })
                .catch(error => console.error("Error: ", error));
        });

        function handleGetAllEventsResponse(json) {
            return json.map(data => new Event(data.event_id, data.name, data.host_id, data.active, data.location, data.description, data.start_time, data.end_time));
        }
    }


    getPerformance(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            fetch("/api/performance/" + id, {
                method: "GET",
                headers: {
                    'x-access-token': window.sessionStorage.getItem("jwt"),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (isErrorStatus(response.status)) reject("Error status: " + response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    resolve(handleGetPerformanceResponse(json.data[0]));
                })
                .catch(error => console.error("Error: ", error));
        });

        function handleGetPerformanceResponse(json) {
            return new Performance(json.performance_id, json.user_id, json.event_id, json.start_time, json.end_time, json.contract);
        }
    }


    getAllRiders(eventId: number) :Promise<any> {
        return new Promise((resolve, reject) => {
            fetch("/api/event/" + eventId + "/rider", {
                method: "GET",
                headers: {
                    'x-access-token': window.sessionStorage.getItem("jwt"),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (isErrorStatus(response.status)) reject("Error status: " + response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    resolve(handleGetAllRidersResponse(json));
                })
                .catch(error => console.error("Error: ", error));
        });

        function handleGetAllRidersResponse(json) {
            return json.map(data => new Rider(data.rider_id, data.name, data.amount));
        }
    }


    getContract(eventId: number, artistId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            fetch("/api/event/" + eventId + "/user/" + artistId + "/contract", {
                method: "GET",
                headers: {
                    'x-access-token': window.sessionStorage.getItem("jwt"),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (isErrorStatus(response.status)) reject("Error status: " + response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    resolve(handleGetContractResponse(json.data[0]));
                })
                .catch(error => console.error("Error: ", error));
        });

        function handleGetContractResponse(json) {
            return JSON.stringify(json);
        }
    }


    getEventContracts(eventId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            fetch("/api/event/" + eventId + "/contracts", {
                method: "GET",
                headers: {
                    'x-access-token': window.sessionStorage.getItem("jwt"),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (isErrorStatus(response.status)) reject("Error status: " + response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    resolve(handleGetEventContractsResponse(json));
                })
                .catch(error => console.error("Error: ", error));
        });

        function handleGetEventContractsResponse(json) {
            return json.map(data => String(JSON.stringify(data)));
        }
    }


    getEventTickets(eventId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            fetch("/api/event/" + eventId + "/tickets", {
                method: "GET",
                headers: {
                    'x-access-token': window.sessionStorage.getItem("jwt"),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (isErrorStatus(response.status)) reject("Error status: " + response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    resolve(handleGetEventTicketsResponse(json));
                })
                .catch(error => console.error("Error: ", error));
        });

        function handleGetEventTicketsResponse(json) {
            return json.map(data => new Ticket(data.name, data.event_id, data.price, data.amount, data.description));
        }
    }


    getPerformanceRiders(eventId: number, performanceId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            fetch("/api/user/event/" + eventId + "/" + performanceId, {
                method: "GET",
                headers: {
                    'x-access-token': window.sessionStorage.getItem("jwt"),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (isErrorStatus(response.status)) reject("Error status: " + response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    resolve(handleGetPerformanceRidersResponse(json));
                })
                .catch(error => console.error("Error: ", error));
        });

        function handleGetPerformanceRidersResponse(json) {
            return json.map(data => new Rider(data.rider_id, data.name, data.amount));
        }
    }


    getUsersEvents(userId: number, active: number): Promise<any> {
        return new Promise((resolve, reject) => {
            fetch("/api/user/" + userId + "/event/" + active, {
                method: "GET",
                headers: {
                    'x-access-token': window.sessionStorage.getItem("jwt"),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (isErrorStatus(response.status)) reject("Error status: " + response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    resolve(handleGetUsersEventsResponse(json));
                })
                .catch(error => console.error("Error: ", error));
        });

        function handleGetUsersEventsResponse(json) {
            return json.map(data => new Event(data.event_id, data.name, data.host_id, data.active, data.location, data.description, data.startTime, data.endTime))
        }
    }


    getCrew(eventId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            fetch("/api/event/" + eventId + "/crew", {
                method: "GET",
                headers: {
                    'x-access-token': window.sessionStorage.getItem("jwt"),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (isErrorStatus(response.status)) reject("Error status: " + response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    resolve(handleGetCrewResponse(json));
                })
                .catch(error => console.error("Error: ", error));
        });

        function handleGetCrewResponse(json) {
            return json.map(data => new Crew(data.crew_id, data.profession, data.name, data.contact_info, data.event_id));
        }
    }


    //POST
    createEvent(name: string, hostId: number, active: number, location: string, description: string, startTime: string, endTime: string): Promise<any> {
        let data = {
            name: name,
            hostId: hostId,
            active: active,
            location: location,
            description: description,
            startTime: startTime,
            endTime: endTime
        };
        return new Promise((resolve, reject) => {
            fetch("/api/event", {
                method: "POST",
                headers: {
                    'x-access-token': window.sessionStorage.getItem("jwt"),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (isErrorStatus(response.status)) reject("Error status: " + response.status);
                    return response.json();
                })
                .then(json => {
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error("Error: ", error));
        })
    }

    createTicket(name: string, eventId: number, price: number, amount: number, description: string): Promise<any> {
        let data = {name: name, eventId: eventId, price: price, amount: amount, description: description};
        return new Promise((resolve, reject) => {
            fetch("/api/event/" + eventId + "/ticket", {
                method: "POST",
                headers: {
                    'x-access-token': window.sessionStorage.getItem("jwt"),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (isErrorStatus(response.status)) reject("Error status: " + response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error("Error: ", error));
        })
    }

    createPerformance(userId: number, eventId: number, startTime: string, endTime: string, contract: string): Promise<any> {
        let data = {
            userId: userId,
            eventId: eventId,
            startTime: startTime,
            endTime: endTime,
            contract: contract
        };
        return new Promise((resolve, reject) => {
            fetch("/api/event/" + eventId + "/user", {
                method: "POST",
                headers: {
                    'x-access-token': window.sessionStorage.getItem("jwt"),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (isErrorStatus(response.status)) reject("Error status: " + response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error("Error: ", error));
        })
    }

    createRider(performanceId: number, name: string, amount: number): Promise<any> {
        let data = {name: name, amount: amount};
        return new Promise((resolve, reject) => {
            fetch("/api/performance/" + performanceId + "/rider", {
                method: "POST",
                headers: {
                    'x-access-token': window.sessionStorage.getItem("jwt"),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (isErrorStatus(response.status)) reject("Error status: " + response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error("Error: ", error));
        })
    }

    createCrew(eventId: number, profession: string, name: string, contactInfo: string): Promise<any> {
        let data = {profession: profession, name: name, contactInfo: contactInfo};
        return new Promise((resolve, reject) => {
            fetch("/api/event/" + eventId + "/crew", {
                method: "POST",
                headers: {
                    'x-access-token': window.sessionStorage.getItem("jwt"),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (isErrorStatus(response.status)) reject("Error status: " + response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error("Error: ", error));
        })
    }


    //DELETE
    deleteRider(eventId: number, performanceId: number, name: string): Promise<any> {
        let data = {performanceId: performanceId, name: name};
        return new Promise((resolve, reject) => {
            fetch("/api/event/" + eventId + "/rider", {
                method: "DELETE",
                headers: {
                    'x-access-token': window.sessionStorage.getItem("jwt"),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (isErrorStatus(response.status)) reject("Error status: " + response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error("Error: ", error));
        })
    }

    deleteEvent(eventId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            fetch("/api/event/" + eventId, {
                method: "DELETE",
                headers: {
                    'x-access-token': window.sessionStorage.getItem("jwt"),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (isErrorStatus(response.status)) reject("Error status: " + response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error("Error: ", error));
        })
    }

    //PUT
    updateTicket(name: string, eventId: number, price: number, amount: number, description: string): Promise<any> {
        let data = {name: name, eventId: eventId, price: price, amount: amount, description: description};
        return new Promise((resolve, reject) => {
            fetch("/api/event/" + eventId + "/ticket", {
                method: "PUT",
                headers: {
                    'x-access-token': window.sessionStorage.getItem("jwt"),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (isErrorStatus(response.status)) reject("Error status: " + response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error("Error: ", error));
        })
    }

    updateRider(eventId: number, riderId: number, name: string, amount: number): Promise<any> {
        let data = {riderId: riderId, name: name, amount: amount};
        return new Promise((resolve, reject) => {
            fetch("/api/event/" + eventId + "/rider", {
                method: "PUT",
                headers: {
                    'x-access-token': window.sessionStorage.getItem("jwt"),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (isErrorStatus(response.status)) reject("Error status: " + response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error("Error: ", error));
        })
    }

    updateEvent(eventId: number, name: string, hostId: number, active: number, location: string, description: string, startTime: string, endTime: string): Promise<any> {
        let data = {
            eventId: eventId,
            name: name,
            hostId: hostId,
            active: active,
            location: location,
            description: description,
            startTime: startTime,
            endTime: endTime
        };
        return new Promise((resolve, reject) => {
            fetch("/api/event/" + eventId, {
                method: "PUT",
                headers: {
                    'x-access-token': window.sessionStorage.getItem("jwt"),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (isErrorStatus(response.status)) reject("Error status: " + response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error("Error: ", error));
        })
    }

    updateContract(eventId: number, contract: string): Promise<any> {
        let data = {eventId: eventId, contract: contract};
        return new Promise((resolve, reject) => {
            fetch("/api/event/" + eventId + "/contract", {
                method: "PUT",
                headers: {
                    'x-access-token': window.sessionStorage.getItem("jwt"),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (isErrorStatus(response.status)) reject("Error status: " + response.status);
                    return response.json();
                })
                .then(json => {
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error("Error: ", error));
        })
    }

    updatePerformance(performanceId: number, userId: number, eventId: number, startTime: string, endTime: string, contract: string): Promise<any> {
        let data = {
            performanceId: performanceId,
            userId: userId,
            eventId: eventId,
            startTime: startTime,
            endTime: endTime,
            contract: contract
        };
        return new Promise((resolve, reject) => {
            fetch("/api/event/" + eventId + "/performance", {
                method: "PUT",
                headers: {
                    'x-access-token': window.sessionStorage.getItem("jwt"),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (isErrorStatus(response.status)) reject("Error status: " + response.status);
                    return response.json();
                })
                .then(json => {
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error("Error: ", error));
        })
    }

    updateCrew(eventId: number, crewId: number, profession: string, name: string, contactInfo: string): Promise<any> {
        let data = {profession: profession, name: name, contactInfo: contactInfo, crewId: crewId};
        return new Promise((resolve, reject) => {
            fetch("/api/event/" + eventId + "/crew/" + crewId, {
                method: "PUT",
                headers: {
                    'x-access-token': window.sessionStorage.getItem("jwt"),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (isErrorStatus(response.status)) reject("Error status: " + response.status);
                    return response.json();
                })
                .then(json => {
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error("Error: ", error));
        })
    }

    deleteTicket(name: string, eventId: number): Promise<any> {
        let data = {name: name, eventId: eventId};
        return new Promise((resolve, reject) => {
            fetch("/api/event/" + eventId + "/ticket", {
                method: "DELETE",
                headers: {
                    'x-access-token': window.sessionStorage.getItem("jwt"),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (isErrorStatus(response.status)) reject("Error status: " + response.status);
                    return response.json();
                })
                .then(json => {
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error("Error: ", error));
        })
    }

    deletePerformance(eventId: number, artistId: number): Promise<any> {
        let data = {artistId: artistId};
        return new Promise((resolve, reject) => {
            fetch("/api/event/" + eventId + "/performance", {
                method: "DELETE",
                headers: {
                    'x-access-token': window.sessionStorage.getItem("jwt"),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (isErrorStatus(response.status)) reject("Error status: " + response.status);
                    return response.json();
                })
                .then(json => {
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error("Error: ", error));
        })
    }

}

class UserService {
    //GET
    getUser(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
                fetch("/api/user/" + id, {
                    method: "GET",
                    headers: {
                        'x-access-token': window.sessionStorage.getItem("jwt"),
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => {
                        if (isErrorStatus(response.status)) reject("Error status: " + response.status);
                        return response.json();
                    })
                    .then(json => {
                        refreshToken(json.jwt);
                        resolve(this.handleGetUserResponse(json.data[0]));
                    })
                    .catch(error => console.error("Error: ", error));
            }
        )
    }

    handleGetUserResponse(json) {
        return new User(json.user_id, json.username, json.email, json.phone, json.first_name, json.surname);
    }

    getAllUsers(): Promise<any> {
        return new Promise((resolve, reject) => {
            fetch("/api/users", {
                method: "GET",
                headers: {
                    'x-access-token': window.sessionStorage.getItem("jwt"),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (isErrorStatus(response.status)) reject("Error status: " + response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    resolve(this.handleGetAllUsersResponse(json));
                })
                .catch(error => console.error("Error: ", error));
        })
    }

    handleGetAllUsersResponse(json) {
        return json.map(data => new User(data.user_id, data.username, data.email, data.phone, data.first_name, data.surname));
    }

    //DELETE
    deleteUser(userId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            fetch("api/user/" + userId, {
                method: "DELETE",
                headers: {
                    'x-access-token': window.sessionStorage.getItem("jwt"),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (isErrorStatus(response.status)) reject("Error status: " + response.status);
                    return response.json();
                })
                .then(json => {
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error("Error: ", error));
        })
    }

    //PUT
    updateUser(userId: number, username: string, email: string, phone: string, firstName: string, lastName: string): Promise<any> {
        let data = {
            username: username,
            email: email,
            phone: phone,
            firstName: firstName,
            lastName: lastName,
            userId: userId
        };
        return new Promise((resolve, reject) => {
            fetch("api/user/" + userId, {
                method: "PUT",
                headers: {
                    'x-access-token': window.sessionStorage.getItem("jwt"),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (isErrorStatus(response.status)) reject("Error status: " + response.status);
                    return response.json();
                })
                .then(json => {
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error("Error: ", error));
        })
    }

    updatePassword(usermail: string): Promise<any> {
        return new Promise((resolve, reject) => {
            fetch("api/user/" + usermail, {
                method: "PUT",
                headers: {
                    'x-access-token': window.sessionStorage.getItem("jwt"),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (isErrorStatus(response.status)) reject("Error status: " + response.status);
                    return response.json();
                })
                .then(json => {
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error("Error: ", error));
        })
    }


    //POST
    createUser(username: string, password: string, email: string, phone: string, firstName: string, lastName: string): Promise<any> {
        let data = {
            username: username,
            password: password,
            email: email,
            phone: phone,
            firstName: firstName,
            lastName: lastName
        };
        console.log(data);
        return new Promise((resolve, reject) => {
            fetch("/user", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (isErrorStatus(response.status)) reject("Error status: " + response.status);
                    return response.json();
                })
                .then(json => {
                    console.log(json);
                    resolve(json);
                })
                .catch(error => console.error("Error: ", error));
        })
    }

    loginUser(username: string, password: string, email: string): Promise<any> {
        let data = {
            username: username,
            password: password,
            email: email
        };
        return new Promise((resolve, reject) => {
            fetch("/login", {
                method: "POST",
                headers: {
                    'x-access-token': window.sessionStorage.getItem("jwt"),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (isErrorStatus(response.status)) reject("Error status: " + response.status);
                    return response.json();
                })
                .then(json => {
                    refreshToken(json.jwt);
                    setUser(this.getUser(json.userId));
                    resolve(json);
                })
                .catch(error => console.error("Error: ", error));
        })
    }


}


function isErrorStatus(status: number): boolean {
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

function refreshToken(jwt: string) {
    window.sessionStorage.setItem("jwt", jwt);
}

function setUser(userId: number) {
    window.sessionStorage.setItem("user", userId);
}

export let user = new User();
export let userService = new UserService();
export let eventService = new EventService();
