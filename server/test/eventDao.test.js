const mysql = require("mysql");
const EventDao = require("../src/dao/eventDao.js");
const runSQL = require("./runSQL.js");

// GitLab CI Pool



let pool = mysql.createPool({
     connectionLimit: 2,
     host: "mysql-ait.stud.idi.ntnu.no",
     user: "tdthorki",
     password: "21PFqYLh",
     database: "tdthorki",
     debug: false,
     multipleStatements: true
});
// var pool = mysql.createPool({
//     connectionLimit: 1,
//     host: "mysql",
//     user: "root",
//     password: "",
//     database: "School",
//     debug: false,
//     multipleStatements: true
// });

let eventDao = new EventDao(pool);

beforeAll(done => {
    runSQL("./test/setup.sql", pool, done);
});

afterAll(() => {
    pool.end();
});

//Get-methods:

test("get one event from database", done => {
    eventDao.getEvent(1, (status, data) => {
        expect(data.length).toBe(1);
        expect(data[0].name).toBe("testEvent");
        expect(data[0].username).toBe("torstein");
        done();
    });
});

test("get all active events for user 1 from database", done => {
    eventDao.getUserEvents({userId: 1, active: 1}, (status, data) => {
        expect(data.length).toBe(1);
        done();
    });
});

test("get all tickets involved in a specific event", done => {
    eventDao.getTickets(2, (status, data) => {
        expect(data.length).toBe(2);
        done();
    });
});

test("get all riders for one specific performance", done => {
    eventDao.getRiders(3, (status, data) => {
        expect(data.length).toBe(1);
        done();
    });
});

test("get participants for one specific event", done => {
    eventDao.getEventParticipants(2, (status, data) => {
        expect(data.length).toBe(2);
        done();
    })
})

test("get performance information for one specific event", done => {
    eventDao.getEventPerformances(2, (status, data) => {
        expect(data.length).toBe(2);
        done();
    })
})

test("get crew for one specific event", done => {
    eventDao.getCrew(1, (status, data) => {
        expect(data.length).toBe(4);
        done();
    })
})

//POST-methods:

test("add an event to database", done => {
    eventDao.createEvent(
        {
            eventName: "Vors hos Kristian",
            userId: 2,
            description: "Fest",
            location: "Trondheim",
            longitude : 63.4090508,
            latitude: 10.4528865,
            startTime: "2020-12-05 19:00:00",
            endTime: "2020-12-06 00:00:00",
            picture: "link"
        },
        callback
    );

    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data=" + JSON.stringify(status, data)
        );
        expect(data.affectedRows).toBe(1);
        done();
    }
});

test("add a ticket to database", done => {
    eventDao.createTicket(
        {
            name: "Ny billett",
            eventId: 2,
            price: 125,
            amount: 3
        },
        callback
    );

    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data=" + JSON.stringify(status, data)
        );
        expect(data.affectedRows).toBe(1);
        done();
    }
});

test("add a performance to database", done => {
    eventDao.createPerformance(
        {
            artistId: 1,
            eventId: 2,
            startTime: '2020-12-05 22:30:00',
            endTime: '2020-12-05 22:45:00',
            contract: 'Kontrakt for den nye opptredenen'
        },
        callback
    );

    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data=" + JSON.stringify(status, data)
        );
        expect(data.affectedRows).toBe(1);
        done();
    }
});

test("add a rider to database", done => {
    eventDao.createRider(
        {
            performanceId: 2,
            name: "Beskrivelse for ny rider",
            amount: 3,
            confirmed: 0
        },
        callback
    );

    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data=" + JSON.stringify(status, data)
        );
        expect(data.affectedRows).toBe(1);
        done();
    }
});

test("add a crew to database", done => {
    eventDao.createCrew(
        {
            profession: "lydmann",
            name: "Trym",
            contanctInfo: "Ttym@goldschmidt.no",
            eventId: 1
        },
        callback
    );

    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data=" + JSON.stringify(status, data)
        );
        expect(data.affectedRows).toBe(1);
        done();
    }
});

//DELETE-methods:

test("delete event from database", done => {
    eventDao.deleteEvent(4, (status, data) => {
        expect(data.affectedRows).toBe(1);
        done();
    });
});

test("delete rider from database", done => {
    eventDao.deleteRider({performanceId: 2, name: "Beskrivelse for ny rider"}, (status, data) => {
        expect(data.affectedRows).toBe(1);
        done();
    });
});

test("delete ticket from database", done => {
    eventDao.deleteTicket({name: "TestBillett", eventId: 2}, (status, data) => {
        expect(data.affectedRows).toBe(1);
        done();
    });
});

test("delete performance from database", done => {
    eventDao.deletePerformance(4, (status, data) => {
        expect(data.affectedRows).toBe(1);
        done();
    });
});

test("delete crew from database", done => {
    eventDao.deleteCrew(5, (status, data) => {
        expect(data.affectedRows).toBe(1);
        done();
    });
});

//PUT-methods

test("update ticket in database", done => {

    let param = {
        price: 130,
        amount: 200,
        name: 'Updated',
        eventId: 2,
        oldName: 'Ny billett'
    };

    eventDao.updateTicket(param, (status, data) => {
        expect(data.affectedRows).toBe(1);
        done();
    });
});

test("update rider in database", done => {

    let param = {
        name: "Oppdatert rider",
        amount: 3,
        confirmed: 1,
        performanceId: 2,
        oldName: "trenger fanta",
    };

    eventDao.updateRider(param, () => {
        eventDao.getRiders(2, (status, data) => {
            expect(data[0].name).toBe("Oppdatert rider");
            expect(data[0].amount).toBe(3);
            expect(data[0].confirmed).toBe(1);
            done();
        });
    });
});

test("update event in database", done => {

    let param = {
        eventName: "Endret navn",
        active: 0,
        description: "Ny kategoi",
        longitude : 0,
        latitude: 0,
        location: "Ny lokasjon",
        startTime: "2020-12-05 22:30:00",
        endTime: "2020-12-05 22:30:00",
        eventId: 5
    };

    eventDao.updateEvent(param, () => {
        eventDao.getEvent(5, (status, data) => {
            console.log(data);
            expect(data[0].active).toBe(0);
            expect(data[0].location).toBe("Ny lokasjon");
            done();
        });
    });
});

test("update performance in database", done => {

    let param = {
        startTime: "2020-10-03 20:15:00",  
        endTime: "2020-10-03 21:00:00",
        contract: "Dette er en ny kontrakt",
        performanceId: 3
    };

    eventDao.updatePerformance(param, (status, data) => {
        expect(data.affectedRows).toBe(1);
        done();
    });
});

test("update crew in database", done => {

    let param = {
        profession: "lysmann", 
        name: "Bjørn", 
        contactInfo: "bjørn@schreiner.no", 
        crewId: 1
    };

    eventDao.updateCrew(param, () => {
        eventDao.getCrew(1, (status, data) => {
            console.log(data);
            expect(data[0].profession).toBe("lysmann");
            expect(data[0].name).toBe("Bjørn");
            expect(data[0].contact_info).toBe("bjørn@schreiner.no");
            done();
        });
    });
});
