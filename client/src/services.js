export class Event {
    id;
    name;
    hostId;
    active;
    location;
    startTime;
    endTime;

    constructor(id, name, hostId, active, location, startTime, endTime) {
        this.id = id;
        this.name = name;
        this.active = active;
        this.location = location;
        this.startTime = startTime;
        this.endTime = endTime;
    }

}

class EventService {
    getEvent(id) {
        fetch("/api/event/"+id, {
            method: "GET"
        })
            .then(response => response.json())
            .then(json => handleGetEventResponse(json))
            .catch(error => console.error("Error: ", error));
    }
}
export let studentService = new StudentService();
