export class Event {
    constructor(id, name, hostId, active, location, startTime, endTime) {
        this.id = id;
        this.name = name;
        this.hostId = hostId;
        this.active = active;
        this.location = location;
        this.startTime = startTime;
        this.endTime = endTime;
    }

}

export class Ticket {
    constructor(name, eventId, price, amount, description) {
        this.name = name;
        this.eventId = eventId;
        this.price = price;
        this.amount = amount;
        this.description = description;
    }
}

export class Rider {
    constructor(id, name, amount) {
        this.id = id;
        this.name = name;
        this.amount = amount;
    }
}

export class Performance {
    constructor(id, userId, eventId, startTime, endTime) {
        this.id = id;
        this.userId = userId;
        this.eventId = eventId;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}

export class User {
    constructor(id, username, email, phone, firstName, surname) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.phone = phone;
        this.firstName = firstName;
        this.surname = surname;
    }
}

export class Crew{
    constructor(id, profession, name, contactInfo,eventId){
        this.id = id;
        this.profession = profession;
        this.name = name;
        this.contactInfo = contactInfo;
        this.evendId = eventId;
    }
}


class EventService {
    //GET
    getEvent(id) {
        fetch("/api/event/" + id, {
            method: "GET",
            headers: {
                'x-access-token': window.sessionStorage.getItem("jwt")
            }
        })
            .then(response => response.json())
            .then(json => {
                refreshToken(json.jwt);
                return handleGetEventResponse(json);
            })
            .catch(error => console.error("Error: ", error));
    }

    handleGetEventResponse(json) {
        return new Event(json.event_id, json.name, json.host_id, json.active, json.location, json.startTime, json.endTime);
    }

    getAllEvents() {
        fetch("/api/events/", {
            method: "GET",
            headers: {
                'x-access-token': window.sessionStorage.getItem("jwt")
            }
        })
            .then(response => response.json())
            .then(json => {
                refreshToken(json.jwt);
                return handleGetAllEventsResponse(json);
            })
            .catch(error => console.error("Error: ", error));
    }

    handleGetAllEventsResponse(json) {
        return json.map(data => new Event(data.event_id, data.name, data.host_id, data.active, data.location, data.start_time, data.end_time));
    }

    getPerformance(id) {
        fetch("/api/performance/" + id, {
            method: "GET",
            headers: {
                'x-access-token': window.sessionStorage.getItem("jwt")
            }
        })
            .then(response => response.json())
            .then(json => {
                refreshToken(json.jwt);
                return handleGetPerformanceResponse(json);
            })
            .catch(error => console.error("Error: ", error));
    }

    handleGetPerformanceResponse(json) {
        return new Performance(json.performance_id, json.user_id, json.event_id, json.start_time, json.end_time);
    }

    getAllRiders(eventId) {
        fetch("/api/event/" + eventId + "/rider", {
            method: "GET",
            headers: {
                'x-access-token': window.sessionStorage.getItem("jwt")
            }
        })
            .then(response => response.json())
            .then(json => {
                refreshToken(json.jwt);
                return handleGetAllRidersResponse(json);
            })
            .catch(error => console.error("Error: ", error));
    }

    handleGetAllRidersResponse(json) {
        return json.map(data => new Rider(data.rider_id, data.name, data.amount));
    }

    getContract(eventId, artistId) {
        fetch("/api/event/" + eventId + "/user/" + artistId + "/contract", {
            method: "GET",
            headers: {
                'x-access-token': window.sessionStorage.getItem("jwt")
            }
        })
            .then(response => response.json())
            .then(json => {
                refreshToken(json.jwt);
                return handleGetContractResponse(json);
            })
            .catch(error => console.error("Error: ", error));
    }

    handleGetContractResponse(json) {
        return JSON.stringify(json);
    }

    getEventContracts(eventId) {
        fetch("/api/event/" + eventId + "/contracts", {
            method: "GET",
            headers: {
                'x-access-token': window.sessionStorage.getItem("jwt")
            }
        })
            .then(response => response.json())
            .then(json => {
                refreshToken(json.jwt);
                return handleGetEventContractsResponse(json);
            })
            .catch(error => console.error("Error: ", error));
    }

    handleGetEventContractsResponse(json) {
        return json.map(data => new String(JSON.stringify(data)));
    }

    getEventTickets(eventId) {
        fetch("/api/event/" + eventId + "/tickets", {
            method: "GET",
            headers: {
                'x-access-token': window.sessionStorage.getItem("jwt")
            }
        })
            .then(response => response.json())
            .then(json => {
                refreshToken(json.jwt);
                return handleGetEventTicketsResponse(json);
            })
            .catch(error => console.error("Error: ", error));
    }

    handleGetEventTicketsResponse(json) {
        return json.map(data => new Ticket(data.name, data.event_id, data.price, data.amount, data.description));
    }

    getPerformanceRiders(eventId, performanceId) {
        fetch("/api/user/event/" + eventId + "/" + performanceId, {
            method: "GET",
            headers: {
                'x-access-token': window.sessionStorage.getItem("jwt")
            }
        })
            .then(response => response.json())
            .then(json => {
                refreshToken(json.jwt);
                return handleGetPerformanceRidersResponse(json);
            })
            .catch(error => console.error("Error: ", error));
    }

    handleGetPerformanceRidersResponse(json) {
        return json.map(data => new Rider(data.rider_id, data.name, data.amount));
    }

    getUsersEvents(userId, active) {
        fetch("/api/user/" + userId + "/event/" + active, {
            method: "GET",
            headers: {
                'x-access-token': window.sessionStorage.getItem("jwt")
            }
        })
            .then(response => response.json())
            .then(json => {
                refreshToken(json.jwt);
                return handleGetUsersEventsResponse(json);
            })
            .catch(error => console.error("Error: ", error));
    }

    handleGetUsersEventsResponse(json) {
        return new Event(json.event_id, json.name, json.host_id, json.active, json.location, json.startTime, json.endTime);
    }

    getCrew(eventId) {
        fetch("/api/event/" + eventId + "/crew", {
            method: "GET",
            headers: {
                'x-access-token': window.sessionStorage.getItem("jwt")
            }
        })
            .then(response => response.json())
            .then(json => {
            refreshToken(json.jwt);
        return handleGetCrewResponse(json);
    })
    .catch(error => console.error("Error: ", error));
    }

    handleGetCrewResponse(json) {
        return json.map(data => new Crew(data.drew_id, data.profession, data.name, data.contact_info, data.eventId));
    }

    //POST
    createEvent(eventId, name, hostId, active, location, startTime, endTime) {
        let data = {
            eventId: eventId,
            name: name,
            hostId: hostId,
            active: active,
            location: location,
            startTime: startTime,
            endTime: endTime
        };
        fetch("/api/event", {
            method: "POST",
            headers: {
                'x-access-token': window.sessionStorage.getItem("jwt")
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(json => refreshToken(json.jwt))
            .catch(error => console.error("Error: ", error));
    }

    createTicket(name, eventId, price, amount, description) {
        let data = {name: name, eventId: eventId, price: price, amount: amount, description: description};
        fetch("/api/event/" + eventId + "/ticket", {
            method: "POST",
            headers: {
                'x-access-token': window.sessionStorage.getItem("jwt")
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(json => refreshToken(json.jwt))
            .catch(error => console.error("Error: ", error));
    }

    createPerformance(performanceId, userId, eventId, startTime, endTime) {
        let data = {
            performanceId: performanceId,
            userId: userId,
            eventId: eventId,
            startTime: startTime,
            endTime: endTime
        };
        fetch("/api/event/" + eventId + "/user", {
            method: "POST",
            headers: {
                'x-access-token': window.sessionStorage.getItem("jwt")
            }
        })
            .then(response => response.json())
            .then(json => refreshToken(json.jwt))
            .catch(error => console.error("Error: ", error));
    }

    createRider(eventId, riderId, name, amount) {
        let data = {riderId: riderId, name: name, amount: amount};
        fetch("/api/event/" + eventId + "/user", {
            method: "POST",
            headers: {
                'x-access-token': window.sessionStorage.getItem("jwt")
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(json => refreshToken(json.jwt))
            .catch(error => console.error("Error: ", error));
    }

    createCrew(eventId, profession, name, contactInfo) {
        let data = {profession: profession, name: name, contactInfo: contactInfo, eventId: eventId};
        fetch("/api/event/" + eventId + "/crew", {
            method: "POST",
            headers: {
                'x-access-token': window.sessionStorage.getItem("jwt")
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
    .then(json => refreshToken(json.jwt))
    .catch(error => console.error("Error: ", error));
    }


    //DELETE
    deleteRider(eventId, performanceId, name) {
        let data = {performanceId: performanceId, name: name};
        fetch("/api/event/" + eventId + "/rider", {
            method: "DELETE",
            headers: {
                'x-access-token': window.sessionStorage.getItem("jwt")
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(json => refreshToken(json.jwt))
            .catch(error => console.error("Error: ", error));
    }

    deleteEvent(eventId) {
        fetch("/api/event/" + eventId, {
            method: "DELETE",
            headers: {
                'x-access-token': window.sessionStorage.getItem("jwt")
            }
        })
            .then(response => response.json())
            .then(json => refreshToken(json.jwt))
            .catch(error => console.error("Error: ", error));
    }

    //PUT
    updateTicket(name, eventId, price, amount, description) {
        let data = {name: name, eventId: eventId, price: price, amount: amount, description: description};
        fetch("/api/event/" + eventId + "/ticket", {
            method: "PUT",
            headers: {
                'x-access-token': window.sessionStorage.getItem("jwt")
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(json => refreshToken(json.jwt))
            .catch(error => console.error("Error: ", error));
    }

    updateRider(eventId, riderId, name, amount) {
        let data = {riderId: riderId, name: name, amount: amount};
        fetch("/api/event/" + eventId + "/rider", {
            method: "PUT",
            headers: {
                'x-access-token': window.sessionStorage.getItem("jwt")
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(json => refreshToken(json.jwt))
            .catch(error => console.error("Error: ", error));
    }

    updateEvent(eventId, name, hostId, active, location, startTime, endTime) {
        let data = {
            eventId: eventId,
            name: name,
            hostId: hostId,
            active: active,
            location: location,
            startTime: startTime,
            endTime: endTime
        };
        fetch("/api/event/" + eventId, {
            method: "PUT",
            headers: {
                'x-access-token': window.sessionStorage.getItem("jwt")
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(json => refreshToken(json.jwt))
            .catch(error => console.error("Error: ", error));
    }

    updateContract(eventId, contract) {
        let data = {eventId: eventId, contract: contract};
        fetch("/api/event/" + eventId + "/contract", {
            method: "PUT",
            headers: {
                'x-access-token': window.sessionStorage.getItem("jwt")
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(json => refreshToken(json.jwt))
            .catch(error => console.error("Error: ", error));
    }

    updatePerformance(performanceId, userId, eventId, startTime, endTime) {
        let data = {
            performanceId: performanceId,
            userId: userId,
            eventId: eventId,
            startTime: startTime,
            endTime: endTime
        };
        fetch("/api/event/" + eventId + "/performance", {
            method: "PUT",
            headers: {
                'x-access-token': window.sessionStorage.getItem("jwt")
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(error => console.error("Error: ", error));
    }

    updateCrew(eventId, crewId, profession, name, contactInfo) {
        let data = {profession: profession, name: name, contactInfo: contactInfo, crewId: crewId};
        fetch("/api/event/" + eventId + "/crew/"+crewId, {
            method: "PUT",
            headers: {
                'x-access-token': window.sessionStorage.getItem("jwt")
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(error => console.error("Error: ", error));
    }

    deleteTicket(name, eventId) {
        let data = {name: name, eventId: eventId};
        fetch("/api/event/" + eventId + "/ticket", {
            method: "DELETE",
            headers: {
                'x-access-token': window.sessionStorage.getItem("jwt")
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(error => console.error("Error: ", error));
    }

    deletePerformance(eventId, artistId) {
        let data = {artistId: artistId};
        fetch("/api/event/" + eventId + "/performance", {
            method: "DELETE",
            headers: {
                'x-access-token': window.sessionStorage.getItem("jwt")
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(error => console.error("Error: ", error));
    }

}

class UserService {
    //GET
    getUser(id) {
        return new Promise( (resolve, reject)  => {
            fetch("/api/user/" + id, {
            method: "GET",
                headers: {
                'x-access-token': window.sessionStorage.getItem("jwt")
                }
            })
            .then(response => {
            if (status === 500)reject();
            response.json()})
            .then(json => {
            refreshToken(json.jwt);
            resolve(this.handleGetUserResponse(json));
            })
            .catch(error => console.error("Error: ", error));
        }
    )}
    handleGetUserResponse(json) {
        return new User(json.user_id, json.username, json.email, json.phone, json.first_name, json.surname);
    }

    getAllUsers() {
        fetch("/api/users", {
            method: "GET",
            headers: {
                'x-access-token': window.sessionStorage.getItem("jwt")
            }
        })
            .then(response => response.json())
            .then(json => {
                refreshToken(json.jwt);
                return this.handleGetAllUsersResponse(json)
            })
            .catch(error => console.error("Error: ", error));
    }

    handleGetAllUsersResponse(json) {
        return json.map(data => new User(data.user_id, data.username, data.email, data.phone, data.first_name, data.surname));
    }

    //DELETE
    deleteUser(userId) {
        fetch("/user/" + userId, {
            method: "DELETE"
        })
            .then(response => response.json())
            .then(json => console.log(json))
            .catch(error => console.error("Error: ", error));
    }

    //PUT
    updateUser(userId, username, email, phone, firstName, lastName) {
        let data = {
            username: username,
            email: email,
            phone: phone,
            firstName: firstName,
            lastName: lastName,
            userId: userId
        };
        fetch("/user/" + userId, {
            method: "PUT",
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(json => console.log(json))
            .catch(error => console.error("Error: ", error));
    }

    updatePassword(usermail) {
        fetch("/user/" + usermail, {
            method: "PUT"
        })
            .then(response => response.json())
            .then(json => console.log(json))
            .catch(error => console.error("Error: ", error));
    }


    //POST
    createUser(username, password, email, phone, firstName, lastName) {
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
            body:  JSON.stringify(data)
        })
    .then(response => response.json())
    .then(json => resolve(json))
    .catch(error => console.error("Error: ", error));
    })
    }

    loginUser(username, password, email) {
        let data = {
            username: username,
            password: password,
            email: email
        };
        fetch("/login", {
            method: "POST",
            headers: {
                'x-access-token': window.sessionStorage.getItem("jwt")
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(json => {
                refreshToken(json.jwt);
                setUser(this.getUser(json.userId));
            })
            .catch(error => console.error("Error: ", error));
    }


}


function refreshToken(jwt) {
    window.sessionStorage.setItem("jwt", jwt);
}

function setUser(user) {
    window.sessionStorage.setItem("user", user);
}

export let studentService = new StudentService();
