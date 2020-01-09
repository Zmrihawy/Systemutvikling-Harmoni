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


class EventService {
    //GET
    getEvent(id) {
        fetch("/api/event/"+id, {
            method: "GET"
        })
            .then(response => response.json())
            .then(json => return handleGetEventResponse(json))
            .catch(error => console.error("Error: ", error));
    }
    function handleGetEventResponse(json){
        Event event = new Event(json.event_id, json.name, json.host_id, json.active, json.location, json.startTime, json.endTime);
        return event;
    }

    getAllEvents() {
        fetch("/api/events/", {
            method: "GET"
        })
            .then(response => response.json())
            .then(json => return handleGetAllEventsResponse(json))
            .catch(error => console.error("Error: ", error));
    }
    function handleGetAllEventsResponse(json){
        let events = json.map(Event event = new Event(json.event_id, json.name, json.host_id, json.active, json.location, json.startTime, json.endTime));
        return events;
    }

    getPerformance(id) {
        fetch("/api/performance/"+id, {
            method: "GET"
        })
            .then(response => response.json())
            .then(json => return handleGetPerformanceResponse(json))
            .catch(error => console.error("Error: ", error));
    }
    function handleGetPerformanceResponse(json){
        Performance performance = new Performance(json.performance_id, json.user_id, json.event_id, json.start_time, json.end_time);
        return performance;
    }

    getAllRiders(eventId) {
        fetch("/api/event/"+eventId+"/rider", {
            method: "GET"
        })
            .then(response => response.json())
            .then(json => return handleGetAllRidersResponse(json))
            .catch(error => console.error("Error: ", error));
    }
    function handleGetAllRidersResponse(json){
        let rider = json.map(Rider rider = new Rider(json.rider_id, json.name, json.amount));
        return riders;
    }

    getContract(eventId, artistId) {
        fetch("/api/event/"+eventId+"/user/"+artistId+"/contract", {
            method: "GET"
        })
            .then(response => response.json())
            .then(json => return handleGetContractResponse(json))
            .catch(error => console.error("Error: ", error));
    }
    function handleGetContractResponse(json){
        String contract = JSON.stringify(json);
        return contract;
    }

    getEventContracts(eventId) {
        fetch("/api/event/"+eventId+"/contracts", {
            method: "GET"
        })
            .then(response => response.json())
            .then(json => return handleGetEventContractsResponse(json))
            .catch(error => console.error("Error: ", error));
    }
    function handleGetEventContractsResponse(json){
        let contracts = json.map(String contract = JSON.stringify(json));
        return contracts;
    }

    getEventTickets(eventId) {
        fetch("/api/event/"+eventId+"/tickets", {
            method: "GET"
        })
            .then(response => response.json())
            .then(json => return handleGetEventTicketsResponse(json))
            .catch(error => console.error("Error: ", error));
    }
    function handleGetEventTicketsResponse(json){
        let tickets = json.map(Ticket ticket = new Ticket(json.name, json.event_id, json.price, json.amount, json.description));
        return tickets;
    }

    getPerformanceRiders(eventId, performanceId) {
        fetch("/api/user/event/"+eventId+"/"+performanceId, {
            method: "GET"
        })
            .then(response => response.json())
            .then(json => return handleGetPerformanceRidersResponse(json))
            .catch(error => console.error("Error: ", error));
    }
    function handleGetPerformanceRidersResponse(json){
        let rider = json.map(Rider rider = new Rider(json.rider_id, json.name, json.amount));
        return riders;
    }

    getUsersEvents(userId, active) {
        fetch("/api/user/"+userId+"/event/"+active, {
            method: "GET"
        })
            .then(response => response.json())
            .then(json => return handleGetUsersEventsResponse(json))
            .catch(error => console.error("Error: ", error));
    }
    function handleGetUsersEventsResponse(json){
        Event event = new Event(json.event_id, json.name, json.host_id, json.active, json.location, json.startTime, json.endTime);
        return event;
    }

    //POST
    getUsersEvents(userId, active) {
        fetch("/api/user/"+userId+"/event/"+active, {
            method: "GET"
        })
            .then(response => response.json())
            .then(json => return handleGetUsersEventsResponse(json))
            .catch(error => console.error("Error: ", error));
    }
    function handleGetUsersEventsResponse(json){
        Event event = new Event(json.event_id, json.name, json.host_id, json.active, json.location, json.startTime, json.endTime);
        return event;
    }

}
export let studentService = new StudentService();
