// import mysql from "mysql";

const mysql = require("mysql");
const UserDao = require("../dao/userDao.js");
const EventDao = require("../dao/eventDao.js");
const runSQL = require("./runSQL.js");

// GitLab CI Pool

let pool = mysql.createPool({
    connectionLimit: 1,
    host: "https://mysql-ait.stud.idi.ntnu.no/",
    user: "kwgulake",
    password: "qra2ZQqh",
    database: "kwgulake",
    debug: false,
    multipleStatements: true
});


// test
let userDao = new UserDao(pool);
let eventDao = new EventDao(pool);

beforeAll(done => {
    runSQL("src/dao/create_tables.sql", pool, done);
});

afterAll(() => {
    pool.end();
});


/**USERDAO*/


//GET-methods

test("get one user from database", done => {
    userDao.getUser({id: 1}, (status, data) => {
        expect(data.length).toBe(1);
        let user = data[0];
        expect(user.username).toBe("testbruker");
        expect(user.email).toBe("testemail");
        expect(user.phone).toBe("999999");
        expect(user.first_name).toBe("test");
        expect(user.surname).toBe("bruker");
        done();
    });
});

test("get user's password and salt from database", done => {
    userDao.getPassword({userId: 1}, (status, data) => {
        expect(user.password).toBe("2955d5f4a8980763b5a1ec72c69b983a5772697e6504879711d8bcc2119cbf881d137f4190976c1af4503e2614649190c3a8e04a78f560d3e6f592240a7f3660".toUpperCase());
        expect(user.salt).toBe("62ca87a099fa85a1".toUpperCase());
        done();
    });
});


test("get all users from database", done => {
    userDao.getAllUsers((status, data) => {
        expect(data.length).toBeGreaterThanOrEqual(4);
        done();
    });
});


//POST-methods

test("create new user in database", done => {
    userDao.createUser(
        {
            username: "LinuxHK",
            password: "2955d5f4a8980763b5a1ec72c69b983a5772697e6504879711d8bcc2119cbf881d137f4190976c1af4503e2614649190c3a8e04a78f560d3e6f592240a7f3660",
            salt: "62ca87a099fa85a1",
            email: "banananana@gmail.com",
            phone: "90189041",
            firstName: "Hans",
            lastName: "Olsen",
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


//PUT-methods

test("update user in database", done => {

    let param = {
        userId: 5,
        username: "Hallo123",
        email: "banan@gmail.com"
    };

    userDao.updateUser(param, () => {
        userDao.getUser(5, (status, data) => {
            expect(data[0].username).toBe('Hallo123');
            expect(data[0].email).toBe("banan@gmail.com");
            done();
        })
    })
});

test("update user's password in database", done => {
    userDao.updatePassword({
        userId: 5,
        password: "28ae51d656ead70e127d63f5bc16c2b7ef381f95f8d0184dea2eb9d37f9a93b169f0efd3a5ecb2502784f82ce00c2df984a4b189d4fc586f8ba03b0cb03f84ed"
    }, () => {
        userDao.getPassword({userId: 5}, (status, data) => {
            expect(user.password).toBe("28ae51d656ead70e127d63f5bc16c2b7ef381f95f8d0184dea2eb9d37f9a93b169f0efd3a5ecb2502784f82ce00c2df984a4b189d4fc586f8ba03b0cb03f84ed".toUpperCase());
            done();
        });
    });
});


//DELETE-methods

test("delete user from database", done => {
    userDao.deleteUser(5, (status, data) => {
        expect(data.affectedRows).toBe(1);
        done();
    });
});


/**EVENTDAO*/

//Get-methods:

test("get one user from database", done => {
    serverDao.getUser(0, (status, data) => {
        expect(data.length).toBe(1);
        // expect(data[0].username).toBe("noe");
        done();
    });
});

test("get one event from database", done => {
    eventDao.getEvent(0, (status, data) => {
        expect(data.length).toBe(1);
        expect(data[0].name).toBe("testEvent");
        done();
    });
});

test("get all events from database", done => {
    eventDao.getAllEvents((status, data) => {
        expect(data.length).toBe(4);
        done();
    });
});

test("get one performance from database", done => {
    eventDao.getPerformance(0, (status, data) => {
        expect(data.length).toBe(1);
        expect(data[0].user_id).toBe(1);
        done();
    });
});

test("get one contract from database", done => {
    eventDao.getContract({eventId: 2, artistId: 1}, (status, data) => {
        expect(data.length).toBe(1);
        expect(data[0].contract).toBe("Dette er kontrakt 1");
        done();
    });
});


test("get all tickets involved in a specific event", done => {
    eventDao.getTickets(2, (status, data) => {
        expect(data.length).toBe(2);
        done();
    });
});

test("get all riders for one specific artist in one specific event", done => {
    eventDao.getRiders({eventId: 2, artistId: 1}, (status, data) => {
        expect(data.length).toBe(1);
        expect(data[0].contract).toBe("Dette er kontrakt 1");
        done();
    });
});


//POST-methods:

test("add an event to database", done => {
    eventDao.createEvent(
        {
            name: "Nytt event",
            hostId: 2,
            startTime: "2020-12-05 22:30:00",
            endTime: "2020-12-05 23:30:00",
            location: "Trondheim",
        },
        callback
    );

    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data=" + JSON.stringify(status, data)
        );
        expect(data.affectedRows).toBeGreaterThanOrEqual(1);
        done();
    }
});

test("add a ticket to database", done => {
    eventDao.createTicket(
        {
            name: "Ny billett",
            eventId: 2,
            price: 125,
            description: "Beskrivelse til ny billett",
            amount: 3,
        },
        callback
    );

    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data=" + JSON.stringify(status, data)
        );
        expect(data.affectedRows).toBeGreaterThanOrEqual(1);
        done();
    }
});

test("add a performance to database", done => {
    eventDao.createPerformance(
        {
            artistId: 1,
            eventId: 2,
            startTime: "2020-12-05 22:30:00",
            endTime: "2020-12-05 22:45:00",
            contract: "Kontrakt for den nye opptredenen"
        },
        callback
    );

    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data=" + JSON.stringify(status, data)
        );
        expect(data.affectedRows).toBeGreaterThanOrEqual(1);
        done();
    }
});

test("add a rider to database", done => {
    eventDao.createRider(
        {
            performanceId: 2,
            description: "Beskrivelse for ny rider",
        },
        callback
    );

    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data=" + JSON.stringify(status, data)
        );
        expect(data.affectedRows).toBeGreaterThanOrEqual(1);
        done();
    }
});


//DELETE-methods:

test("delete event from database", done => {
    sakDao.deleteEvent(5, (status, data) => {
        expect(data.affectedRows).toBe(1);
        done();
    });
});

test("delete rider from database", done => {
    sakDao.deleteRider(5, (status, data) => {
        expect(data.affectedRows).toBe(1);
        done();
    });
});

test("delete ticket from database", done => {
    sakDao.deleteTicket(5, (status, data) => {
        expect(data.affectedRows).toBe(1);
        done();
    });
});

test("delete performance from database", done => {
    sakDao.deletePerformance(5, (status, data) => {
        expect(data.affectedRows).toBe(1);
        done();
    });
});


//PUT-methods

test("update ticket in database", done => {

    let param = {
        ticketPrice: 130,
        ticketDescription: 'Oppdatert billettbeskrivelse',
        ticketName: 'TestBillett',
        ticketEventId: 2,
    };

    eventDao.updateTicket(param, () => {
        eventDao.getTickets(2, (status, data) => {
            expect(data[0].ticketPrice).toBe(130);
            expect(data[0].ticketDescription).toBe('Oppdatert billettbeskrivelse');
            done();
        });
    });
});

test("update rider in database", done => {

    let param = {
        name: "Oppdatert rider",
        amount: 3,
        performanceId: 2,
        oldName: "trenger fanta",
    };

    eventDao.updateRider(param, () => {
        eventDao.getRiders(2, (status, data) => {
            expect(data[0].name).toBe("Oppdatert rider");
            expect(data[0].amount).toBe(3);
            done();
        });
    });
});

test("update performance in database", done => {

    let param = {
        startTime: "2020-12-05 22:30:00",
        endTime: "2020-12-05 22:35:00",
        contract: "Oppdatert kontrakt",
        performanceId: 4,
    };

    eventDao.updateRider(param, () => {
        eventDao.getRiders(2, (status, data) => {
            expect(data[0].startTime).toBe("2020-12-05 22:30:00");
            expect(data[0].contract).toBe("Oppdatert kontrakt");
            done();
        });
    });
});

test("update event in database", done => {

    let param = {
        eventHostId: 3,
        eventActive: 0,
        eventLocation: "Ny lokasjon",
        eventStartTime: "2020-12-05 22:30:00",
        eventEndTime: "2020-12-05 22:30:00",
        eventId: 4
    };

    eventDao.updateEvent(param, () => {
        eventDao.getEvent(4, (status, data) => {
            expect(data[0].location).toBe("Ny lokasjon");
            done();
        });
    });
});


