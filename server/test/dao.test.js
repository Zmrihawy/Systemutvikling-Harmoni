const mysql = require("mysql");
const UserDao = require("../src/dao/userDao.js");
const EventDao = require("../src/dao/eventDao.js");
const runSQL = require("./runSQL.js");

// GitLab CI Pool


let pool = mysql.createPool({
    connectionLimit: 2,
    host: "mysql-ait.stud.idi.ntnu.no",
    user: "kwgulake",
    password: "qra2ZQqh",
    database: "kwgulake",
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
//   });


// test
let userDao = new UserDao(pool);
let eventDao = new EventDao(pool);

beforeAll(done => {
    runSQL("./test/setup.sql", pool, done);
});

afterAll(() => {
    pool.end();
});


/**USERDAO*/


//GET-methods

test("get one user from database", done => {
    userDao.getUser(1, (status, data) => {
        console.log(status);
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
    userDao.getPassword("testemail", (status, data) => {
        let user = data[0];
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
    let user = {
        username: "LinuxHK",
        password: "2955d5f4a8980763b5a1ec72c69b983a5772697e6504879711d8bcc2119cbf881d137f4190976c1af4503e2614649190c3a8e04a78f560d3e6f592240a7f3660",
        salt: "62ca87a099fa85a1",
        email: "banananana@gmail.com",
        phone: "90189041",
        firstName: "Hans",
        lastName: "Olsen"
    };
    userDao.createUser(
        user,
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

test("create new users with username already in use", done => {
    let user = {
        username: "LinuxHK",
        password: "3955d5f4a8980763b5a1ec72c69b983a5772697e6504879711d8bcc2119cbf881d137f4190976c1af4503e2614649190c3a8e04a78f560d3e6f592240a7f3660",
        salt: "32ca87a099fa85a1",
        email: "123a@gmail.com",
        phone: "93189041",
        firstName: "Peter",
        lastName: "Kake"
    };
    userDao.createUser(
        user,
        () => userDao.createUser(
            user,
            () => userDao.createUser(
                user,
                callback
            )
        )
    );

    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data=" + JSON.stringify(status, data)
        );
        expect(status).toBe(500);
        done();
    }
});

test("create new users with email already in use", done => {
    let user = {
        username: "Heihei123",
        password: "3955d5f4a8980763b5a1ec72c69b983a5772697e6504879711d8bcc2119cbf881d137f4190976c1af4503e2614649190c3a8e04a78f560d3e6f592240a7f3660",
        salt: "32ca87a099fa85a1",
        email: "banananana@gmail.com",
        phone: "93189041",
        firstName: "Peter",
        lastName: "Kake"
    };
    userDao.createUser(
        user,
        () => userDao.createUser(
            user,
            () => userDao.createUser(
                user,
                callback
            )
        )
    );

    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data=" + JSON.stringify(status, data)
        );
        expect(status).toBe(500);
        done();
    }
});

test("create new users with email and username already in use", done => {
    let user = {
        username: "LinuxHK",
        password: "3955d5f4a8980763b5a1ec72c69b983a5772697e6504879711d8bcc2119cbf881d137f4190976c1af4503e2614649190c3a8e04a78f560d3e6f592240a7f3660",
        salt: "32ca87a099fa85a1",
        email: "banananana@gmail.com",
        phone: "93189041",
        firstName: "Peter",
        lastName: "Kake"
    };
    userDao.createUser(
        user,
        () => userDao.createUser(
            user,
            () => userDao.createUser(
                user,
                callback
            )
        )
    );

    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data=" + JSON.stringify(status, data)
        );
        expect(status).toBe(500);
        done();
    }
});


//PUT-methods

test("update user in database", done => {

    let param = {
        userId: 5,
        username: "Hallo123",
        email: "banan@gmail.com",
        phone: "90189041",
        firstName: "Hans",
        lastName: "Olsen"
    };

    userDao.updateUser(param, () => {
        userDao.getUser(5, (status, data) => {
            console.log(data[0]);
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
        userDao.getPassword("banan@gmail.com", (status, data) => {
            expect(data[0].password).toBe("28ae51d656ead70e127d63f5bc16c2b7ef381f95f8d0184dea2eb9d37f9a93b169f0efd3a5ecb2502784f82ce00c2df984a4b189d4fc586f8ba03b0cb03f84ed".toUpperCase());
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

test("get one event from database", done => {
    eventDao.getEvent(1, (status, data) => {
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
    eventDao.getPerformance(1, (status, data) => {
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

test("get all riders for one specific performance", done => {
    eventDao.getRiders(3, (status, data) => {
        expect(data.length).toBe(1);
        done();
    });
});


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
            endTime: "2020-12-06 00:00:00"
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
        expect(data.affectedRows).toBeGreaterThanOrEqual(1);
        done();
    }
});

test("add a rider to database", done => {
    eventDao.createRider(
        {
            performanceId: 2,
            name: "Beskrivelse for ny rider",
            amount: 3
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


//PUT-methods

test("update ticket in database", done => {

    let param = {
        price: 130,
        amount: 200,
        description: 'Oppdatert billettbeskrivelse',
        name: 'TestBillett2',
        eventId: 2,
    };

    eventDao.updateTicket(param, () => {
        eventDao.getTickets(2, (status, data) => {
            expect(data[1].price).toBe(130);
            expect(data[1].description).toBe('Oppdatert billettbeskrivelse');
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
        performanceId: 3,
    };

    eventDao.updatePerformance(param, () => {
        eventDao.getPerformance(2, (status, data) => {
            // expect(data[0].start_time).toBe("2020-12-05 22:30:00");
            expect(data[0].contract).toBe("Oppdatert kontrakt");
            done();
        });
    });
});

test("update event in database", done => {

    let param = {
        hostId: 1,
        eventName: "Endret navn",
        active: 0,
        description: "Ny kategoi",
        long : 0,
        lat: 0,
        location: "Ny lokasjon",
        startTime: "2020-12-05 22:30:00",
        endTime: "2020-12-05 22:30:00",
        eventId: 5
    };

    eventDao.updateEvent(param, () => {
        eventDao.getEvent(5, (status, data) => {
            console.log(data);
            expect(data[0].host_id).toBe(1);
            expect(data[0].active).toBe(0);
            expect(data[0].location).toBe("Ny lokasjon");
            done();
        });
    });
});


