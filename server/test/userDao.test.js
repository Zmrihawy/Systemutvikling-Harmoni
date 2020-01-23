const mysql = require("mysql");
const UserDao = require("../src/dao/userDao.js");
const runSQL = require("./runSQL.js");

// GitLab CI Pool

// /*let pool = mysql.createPool({
//      connectionLimit: 2,
//      host: "mysql-ait.stud.idi.ntnu.no",
//      user: "kwgulake",
//      password: "qra2ZQqh",
//      database: "kwgulakse",
//      debug: false,
//      multipleStatements: true
// });*/

var pool = mysql.createPool({
    connectionLimit: 1,
    host: "mysql",
    user: "root",
    password: "",
    database: "School",
    debug: false,
    multipleStatements: true
});


// test
let userDao = new UserDao(pool);

beforeAll(done => {
    runSQL("./test/setup.sql", pool, done);
});

afterAll(() => {
    pool.end();
});

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

test("get a nonexistent user from database", done => {
    userDao.getUser(5, (status, data) => {
        expect(data.length).toBe(0);
        done();
    })
})

test("get user's password and salt from database", done => {
    userDao.getPassword("testemail", (status, data) => {
        console.log(data[0]);
        expect(data[0].password_hex).toBe("2955d5f4a8980763b5a1ec72c69b983a5772697e6504879711d8bcc2119cbf881d137f4190976c1af4503e2614649190c3a8e04a78f560d3e6f592240a7f3660".toUpperCase());
        expect(data[0].salt).toBe("62ca87a099fa85a1".toUpperCase());
        done();
    });
});

test("get user based on credentials from database", done => {
    userDao.checkCred({username: "testbruker", email: "testemail"}, (status, data) => {
        let user = data[0];
        expect(user.username).toBe("testbruker");
        expect(user.email).toBe("testemail");
        done();
    })
})

test("get all artists from database", done => {
    userDao.getAllArtists((status, data) => {
        expect(data.length).toBe(2);
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
        lastName: "Olsen",
        artist: 1
    };
    userDao.createUser(user, (status,data) => {
        console.log("Test callback: status=" + status + ", data=" + JSON.stringify(status, data));
        userDao.getAllArtists((sat, dat) => {
                console.log(dat);
                expect(dat.length).toBe(3);
                done();
        });
    });
});

test("create new users with username already in use", done => {
    let user = {
        username: "LinuxHK",
        password: "3955d5f4a8980763b5a1ec72c69b983a5772697e6504879711d8bcc2119cbf881d137f4190976c1af4503e2614649190c3a8e04a78f560d3e6f592240a7f3660",
        salt: "32ca87a099fa85a1",
        email: "123a@gmail.com",
        phone: "93189041",
        firstName: "Peter",
        lastName: "Kake",
        artist: 1
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
        lastName: "Kake",
        artist: 1
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
        lastName: "Kake",
        artist: 1
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
        lastName: "Olsen",
        artist: 0
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
    userDao.updatePassword({ passId: 5,
                            password: "28ae51d656ead70e127d63f5bc16c2b7ef381f95f8d0184dea2eb9d37f9a93b169f0efd3a5ecb2502784f82ce00c2df984a4b189d4fc586f8ba03b0cb03f84ed",
                            autogen : 1 }, () => {
        userDao.getPassword("banan@gmail.com", (status, data) => {
            expect(data[0].password_hex).toBe("28ae51d656ead70e127d63f5bc16c2b7ef381f95f8d0184dea2eb9d37f9a93b169f0efd3a5ecb2502784f82ce00c2df984a4b189d4fc586f8ba03b0cb03f84ed".toUpperCase());
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
