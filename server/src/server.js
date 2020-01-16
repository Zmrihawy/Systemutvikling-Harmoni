// @flow

import mysql from "mysql";

import express from "express";

import bodyParser from "body-parser";

import cors from "cors";

import jwt from "jsonwebtoken";

import crypto from 'crypto';

import nodemailer from 'nodemailer';

import generator from 'generate-password';

import UserDao from './dao/userDao.js';

import EventDao from './dao/eventDao.js';

var apiRoutes = express.Router();

var app = express();

app.use(cors());

app.use(bodyParser.json()); // for å tolke JSON

var pool: pool = mysql.createPool({
    connectionLimit: 2,
    host: "mysql.stud.iie.ntnu.no",
    user: "kwgulake",
    password: "qra2ZQqh",
    database: "kwgulake",
    debug: false
});

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'noreply.harmoni.123@gmail.com',
        pass: 'qra2ZQqh'
    }
});

let eventDao: EventDao = new EventDao(pool);
let userDao: UserDao = new UserDao(pool);

let publicKey: string;

let privateKey = (publicKey = "arbeiderklassenrusteropptilvepnetrevolusjon");

// middleware-functiona


app.use("/api", (req, res, next) => {
    
    var token = req.headers["x-access-token"];

    if (token === undefined) {
        res.status(400);
        return res.json({error: "missing access token header"});}

    jwt.verify(token, publicKey, (err, decoded) => {
        if (err){
            console.log("Token IKKE ok");
            res.status(401);
            res.json({error: "Not authorized -> Token Expired"});
        } else {
                console.log(req.email + "har gjort en request");
                req.email = decoded.email;
                req.userId = decoded.userId;
                next();
            };
        });
});

// Handles login and returns JWT-token as JSON
app.post("/login", (req, res) => {
    console.log("user trying to log in");

    if (req.body.email == undefined) return res.status(400).json({error: "bad request : missing email parameter"})

    if (req.body.password == undefined) return res.status(400).json({error: " bad request : mssing password parameter"});

    if (!sjekkMail(req.body.email)) return res.status(400).json({error: "parameter email is not a valid email"})

    loginOk(req.body.email, req.body.password).then(data => {
        let log: number = data;
        console.log("User ID", log);

        if (log > 0) {
            console.log("username & passord ok");
            let token = jwt.sign({email: req.body.email, userId: log}, privateKey, {
                expiresIn: 50000
            });
            res.json({jwt: token, userId: log});
        } else {
            console.log("brukernavn & passord IKKE ok");
            res.status(401);
            res.json({error: "Not authorized"});
        }
    }).catch(error => console.log(error));

    async function loginOk(email: string, pw: string): Promise<any> {
        return new Promise((resolve, reject) => {
            userDao.getPassword(email, (status, data) => {

                if (data[0] === undefined) return reject("user not registered");

                let log = -1;

                let hashPW = crypto.createHmac('sha512', data[0].salt);
                let pass: string = pw;

                hashPW.update(pass);
                pass = hashPW.digest('hex');

                if (pass.toUpperCase() === data[0].password.toString()) log = data[0].user_id;
                resolve(log);
            });
        });
    }
});

function thisFunctionCreatesNewToken(passedMail: string, userId: number): { jwt: string } {

    let newToken = jwt.sign({email: passedMail, userId: userId}, privateKey, {
        expiresIn: 5000
    });
    return newToken;
}


/*
*
*       GET METHODS
*
*/

//Get one user
app.get("/api/user/:id", (req, res) => {
    console.log(`/user/${req.params.id} fikk request fra klient`);

    if (numberError([req.params.id])) {
        res.status(400);
        return res.json({error: "parameter user_id must be a number"})
    }

    userDao.getUser(req.params.id, (status, data) => {
        res.status(status);
        let token = thisFunctionCreatesNewToken(req.email, req.userId);
        res.json({data, jwt: token});
    });
});

// Get performance

app.get("/api/performance/:performance_id", (req, res) => {
    console.log("Fikk get-request fra klient");

    if (numberError([req.params.performance_id])) return res.status(400).json({error: "Url parameter performance_id must be a number"});

    eventDao.getPerformance(req.params.performance_id, (status, data) => {
        res.status(status);
        let token = thisFunctionCreatesNewToken(req.email, req.userId);
        res.json({data, jwt: token});
    })

})


//Get one event
app.get("/api/event/:event_id", (req, res) => {
    console.log("/event/:event_id fikk request fra klient");

    if (isNaN(req.params.event_id)) return res.status(400).json({error: "url parameter event_id must be a number"});

    eventDao.getEvent(req.params.event_id, (status, data) => {
        res.status(status);
        let token = thisFunctionCreatesNewToken(req.email, req.userId);
        res.json({data, jwt: token});
    });
});

//Get all users
app.get("/api/users", (req, res) => {
    console.log("/user: fikk request fra klient");
    userDao.getAllUsers((status, data) => {
        res.status(status);
        let token = thisFunctionCreatesNewToken(req.email, req.userId);
        res.json({data, jwt: token});
    });
});

//Get all events
app.get("/api/events", (req, res) => {
    console.log("/user: fikk request fra klient");
    eventDao.getAllEvents((status, data) => {
        res.status(status);
        let token = thisFunctionCreatesNewToken(req.email, req.userId);
        res.json({data, jwt: token});
    });
});

//Get all contracts for an event
app.get("/api/event/:event_id/contract", (req, res) => {
    console.log("Fikk request fra klienten");

    if (numberError([req.params.event_id])) return res.status(400).json({error: "parameter event_id must be a number"});

    eventDao.getEventContracts(req.params.event_id, (status, data) => {
        res.status(status);
        let token = thisFunctionCreatesNewToken(req.email, req.userId);
        res.json({data, jwt: token});
    });
});

//Get all tickets for an event
app.get("/api/event/:event_id/tickets", (req, res) => {
    console.log("Fikk request fra klienten");

    if (isNaN(req.params.event_id)) return res.status(400).json({error: "url parameter event_id must be a number"});

    eventDao.getTickets(req.params.event_id, (status, data) => {
        res.status(status);
        let token = thisFunctionCreatesNewToken(req.email, req.userId);
        res.json({data, jwt: token});
    });
});

//Get all riders for each artist in a specific event

app.get("/api/event/:event_id/rider", (req, res) => {
    console.log("Fikk request fra klienten");

    if (numberError([req.params.event_id])) return res.status(400).json({error: "url parameter event_id must be a number"});

    eventDao.getAllRiders(req.params.event_id, (status, data) => {
        res.status(status);
        let token = thisFunctionCreatesNewToken(req.email, req.userId);
        res.json({data, jwt: token});
    });
});

//Get all raiders for one user
app.get("/api/user/event/:event_id/:performance_id", (req, res) => {
    console.log("/user/:user_id/:active: fikk request fra klient");

    if(numberError([req.params.event_id, req.params.performance_id])) return res.status(400).json({error : "number field cannot be string"})

    eventDao.getRiders(req.params.perfromanceId, (status, data) => {
        res.status(status);
        let token = thisFunctionCreatesNewToken(req.email, req.userId);
        res.json({data, jwt: token});
    });
});

//get all active events for user

app.get("/api/user/:user_id/event/:active", (req, res) => {
    console.log("fikk request get fra klient");

    if (numberError([req.params.user_id, req.params.active])) return res.status(400).json({error: "number field cannot be string"});

    eventDao.getUsersEvents({userId: req.params.user_id, active: req.params.active}, (status, data) => {
        res.status(status);
        let token = thisFunctionCreatesNewToken(req.email, req.userId);
        res.json({data, jwt: token});
    });
});

// get crew given event id

app.get('/api/event/:event_id/crew', (req, res) => {
    console.log('Fikk get-request fra klient');

    if (numberError([req.params.event_id])) return res.status(400).json({error: "number field cannot be string"});

    eventDao.getCrew(req.params.event_id, (status, data) => {
        res.status(status);
        let token = thisFunctionCreatesNewToken(req.email, req.userId);
        res.json({data, jwt: token});
    });
});


/*
*
*   DELETE METHODS
*
*/

//Delete rider
app.delete('/api/performance/:performance_id/rider', (req, res) => {
    console.log("Fikk DELETE-request fra klienten");

    if (numberError([req.params.performance_id])) return res.status(400).json({error: "number field cannot be string"});
    if (req.body.name == undefined) return res.status(400).json({error: "bad request missing body-parameter name"});

    eventDao.deleteRider({performanceId: req.params.performance_id, name: req.body.name}, (status, data) => {
        res.status(status);
        let token = thisFunctionCreatesNewToken(req.email, req.userId);
        res.json({data, jwt: token});
    });
});

// DELETE TICKET

app.delete("/api/event/:event_id/ticket", (req, res) => {
    console.log("Fikk Delete-request fra klient");

    if (numberError([req.params.event_id])) return res.status(400).json({error: "url parameter event_id must be number"});
    if (req.body.name == undefined) return res.status(400).json({error: "bad request missing body-parameter name"});

    eventDao.deleteTicket({eventId: req.params.event_id, name: req.body.name}, (status, data) => {
        res.status(status);
        let token = thisFunctionCreatesNewToken(req.email, req.userId);
        res.json({data, jwt: token});
    })

})

// DELETE PERFORMANCE

app.delete("/api/performance/:performance_id", (req, res) => {

    if (numberError([req.params.performance_id])) return res.status(400).json({error: "url parameter performance_id must be a number"});

    eventDao.deletePerformance(req.params.performance_id, (status, data) => {
        res.status(status);
        let token = thisFunctionCreatesNewToken(req.email, req.userId);
        res.json({data, jwt: token});
    })
})

//Delete a user
app.delete("/api/user/:user_id", (req, res) => {

    console.log("Fikk DELETE-request fra klienten");

    if (isNaN(req.params.user_id)) {
        res.status(400);
        return res.json({error: "url parameter user_id must be a number"});
    }

    if (req.body.password === undefined) {
        res.status(400);
        return res.json({error: "request missing password"});
    }

    userDao.getPassword(req.params.user_id, (status, data) => {

        let pw = req.body.password;

        let hashPW = crypto.createHmac('sha512', data[0].salt);

        let pass = pw;

        hashPW.update(pass);

        pass = hashPW.digest('hex');

        if (data[0].password.toString() === pass.toUpperCase()) {
            userDao.deleteUser(req.params.user_id, (st, dt) => {
                res.status(st);
                dt["jwt"] = thisFunctionCreatesNewToken(req.email, req.userId);
                res.json(dt);
            });
        } else {
            res.error("Feil passord");
        }
    })
});

//Delete an event
app.delete("/api/event/:event_id", (req, res) => {
    console.log("Fikk DELETE-request fra klienten");

    if (isNaN(req.params.event_id)) {
        res.status(400);
        return res.json({error: "url parameter event_id must be a number"});
    }

    eventDao.getEvent(req.params.event_id, (status, data) => {
        if (data[0].user_id === req.userId) {
            eventDao.deleteEvent(req.params.event_id, (status, data) => {
                res.status(status);
                let token = thisFunctionCreatesNewToken(req.email, req.userId);
                res.json({data, jwt: token});
            });
        } else res.json({error: "not authorized"});
    });
});

/*
*
*   UPDATE - METHODS
*
*/

//Update a user
app.put("/api/user/:user_id", (req, res) => {
    console.log("Fikk PUT-request fra klienten");

    if(numberError([req.params.user_id, req.body.phone])) return res.status(400).json({error: "number field cannot be a string"});
    if(req.userId != req.params.user_id) return res.status(401).json({error : "Cannot edit other users"})
    if(req.body.username == undefined) res.status(400).json({error : "Missing parameter username"});
    if(req.body.email == undefined) return res.status(400).json({error : "Missing parameter email"});
    if(req.body.phone == undefined) return res.status(400).json({error : "Missing parameter phone"});
    if(req.body.firstName == undefined) return res.status(400).json({error : "Missing parameter firstName"});
    if(req.body.lastName == undefined) return res.status(400).json({error: "Missing parameter lastName"});
    if(!sjekkMail(req.body.email)) return res.status(400).json({error: "inc mail is not valid"});

    let params = {
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userId: req.params.user_id
    };
    userDao.updateUser(params, (status, data) => {
        res.status(status);
        let token = thisFunctionCreatesNewToken(req.email, req.userId);
        res.json({data, jwt: token});
    });
});

// update crew
app.put('/api/event/:event_id/crew/:crew_id', (req, res) => {
    console.log('fikk put-request fra klient');

    if (req.body.profession == undefined) return res.status(400).json({error: "parameter profession undefined"});
    if (req.body.name == undefined) return res.status(400).json({error: "parameter name undefined"});
    if (req.body.contactInfo == undefined) return res.status(400).json({error: "parameter contactInfo undefined"});
    if(numberError([req.params.event_id, req.params.crew_id])) return res.status(400).json({error : "Number field cannot be string"});

    eventDao.updateCrew({
        profession: req.body.profession,
        name: req.body.name,
        contactInfo: req.body.contactInfo,
        crewId: req.params.crew_id
    }, (status, data) => {
        res.status(status);
        let token = thisFunctionCreatesNewToken(req.email, req.userId);
        res.json({data, jwt: token});
    });
});

// UPDATE PERFORMANCE

app.put("/api/performance/:performance_id", (req, res) => {
    if (req.body.startTime == undefined) return res.status(400).json({error: "bad request"});
    if (req.body.endTime == undefined) return res.status(400).json({error : "request missing end-time parameter"});
    if (req.body.contract == undefined) req.body.contract = "";

    if (isNaN(req.params.performance_id)) {
        res.status(400);
        return res.json({error: "url parameter performance_id must be a number"});
    }
    eventDao.updatePerformance({
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        contract: req.body.contract,
        performanceId: req.params.performance_id
    }, (status, data) => {
        res.status(status);
        let token = thisFunctionCreatesNewToken(req.email, req.userId);
        res.json({data, jwt: token});
    })
});

//put ticket
app.put("/api/event/:event_id/ticket", (req, res) => {
    console.log("Fikk PUT-request fra klienten");
    if (req.body.price == undefined) {
        res.status(400);
        return res.json({error: "request missing ticket - price"});
    }
    if (req.body.amount === undefined) {
        res.status(400);
        return res.json({error: "request missing number of tickets"});
    }
    if (req.body.name === undefined) {
        res.status(400);
        return res.json({error: "request missing ticket-name"});
    }

    if (numberError([req.params.event_id, req.body.price, req.body.amount])) {
        res.status(400);
        return res.json({error: "number field is a string"})
    }

    eventDao.updateTicket({
        description: req.body.description,
        name: req.body.name,
        eventId: req.params.event_id,
        price: req.body.price,
        amount: req.body.amount
    }, (status, data) => {
        res.status(status);
        let token = thisFunctionCreatesNewToken(req.email, req.userId);
        res.json({data, jwt: token});
    });
});

//put rider
app.put("/api/performance/:performance_id/rider", (req, res) => {
    console.log("Fikk PUT-request fra klienten");

    if (req.body.name === undefined) {
        res.status(400);
        return res.json({error: "bad request : missing name"});
    }
    if (req.body.amount === undefined) {
        res.status(400);
        return res.json({error: "bad request : missing amount of tickets"});
    }
    if (req.body.oldName === undefined) {
        res.status(400);
        return res.json({error: "bad request : missing old name - parameter"});
    }

    if (isNaN(req.params.performance_id)) {
        res.status(400);
        return res.json({error: "url parameter performance_id must be a number"});
    }

    if (numberError([req.body.amount])) {
        res.status(400);
        return res.json({error: "number field is a string"});
    }

    eventDao.updateRider({
        name: req.body.name,
        amount: req.body.amount,
        performanceId: req.params.performance_id,
        oldName: req.body.oldName
    }, (status, data) => {
        res.status(status);
        let token = thisFunctionCreatesNewToken(req.email, req.userId);
        res.json({data, jwt: token});
    });
});

//By request of a new password
//generate new password and send it via email

app.put("/user/:usermail", (req, res) => {

    if (!sjekkMail(req.params.usermail)) {
        res.status(400);
        return res.json({error: "given mail is not a valid mail"});
    }

    userDao.getUser(req.params.usermail, (status, data) => {

        if (data[0].salt) {

            let password = generator.generate({
                length: 12,
                numbers: true
            });


            let pw = password;

            let hashPW = crypto.createHmac('sha512', data[0].salt);

            hashPW.update(pw);

            pw = hashPW.digest('hex');

            //#TODO
            userDao.updatePassword({userId: data[0].userId, password: pw}, (stat, dat) => {

                let mailOptions = {
                    from: 'noreply.harmoni.123@gmail.com',
                    to: data.epost,
                    subject: 'New Password',
                    text: `Her er ditt nye passord: \n${password}`
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });

                res.status(200);
                res.send();
            });
        } else {
            res.status(400);
            res.json({error: "User not found"});
        }
    });
});

//Update password

app.put("/api/user/:user_id/password", (req, res) => {
    console.log("Fikk put-request om å oppdatere passord");

    if(numberError([req.params.user_id])) return res.status(400).res.json({error : "number field cannot be string"});

    if(req.params.user_id != req.userId) return res.status(401).json({error : "cannot change password of another user"});

    userDao.getPassword(req.email, (status, data) => {
        if(data.length === 0) return res.status(500).json({error : "user already deleted"})
    })

    
})

//Update an event
app.put("/api/event/:event_id", (req, res) => {
    console.log("Fikk PUT-request fra klienten");

    if (isNaN(req.params.event_id)) {
        res.status(400);
        return res.json({error: "url parameter event_id must be a number"});
    }

    if (numberError([req.body.active])) {
        res.status(400);
        return res.json({error: "number field is a string"});
    }

    if (req.body.eventName === undefined) {
        res.status(400);
        return res.json({error: "bad request : missing eventName parameter"});
    }
    if (req.body.startTime === undefined) {
        res.status(400);
        return res.json({error: "bad request : missing startTime parameter"});
    }
    if (req.body.userId === undefined) {
        res.status(400);
        return res.json({error: "bad request : missing userId parameter"});
    }
    if (req.body.active === undefined) req.body.active = 1;
    if (req.body.location === undefined) {
        res.status(400);
        return res.json({error: "bad request : mssing location parameter"});
    }

    let cat = req.body.description;
    if (cat == undefined) cat = "";

    eventDao.updateEvent({
        eventName: req.body.eventName,
        hostId: req.body.userId,
        active: req.body.active,
        location: req.body.location,
        description: req.body.description,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        eventId: req.params.event_id
    }, (status, data) => {
        res.status(status);
        let token = thisFunctionCreatesNewToken(req.email, req.userId);
        res.json({data, jwt: token});
    });
});

/*
*
*           POST - METHODS
*
*/

//post a user
app.post("/user", (req, res) => {

    console.log("Fikk POST-request fra klienten");

    if (req.body.username == undefined) {
        res.status(400);
        return res.json({error: "request missing username"});
    }
    if (req.body.password == undefined) {
        res.status(400);
        return res.json({error: "request missing password"});
    }
    if (req.body.email == undefined) {
        res.status(400);
        return res.json({error: "request missing email"});
    }

    if (!sjekkMail(req.body.email)) {
        res.status(400);
        return res.json({error: "parameter email is not a valid email"});
    }

    if (numberError([req.body.phone])) {
        res.status(400);
        return res.json({error: "number field is a string"});
    }

    let user = req.body;

    let salt = crypto.randomBytes(16).toString('hex').slice(0, 16).toUpperCase();

    let pw = user.password;

    let hash = crypto.createHmac('sha512', salt);

    hash.update(pw);

    pw = hash.digest('hex');

    userDao.createUser({
        username: user.username,
        password: pw,
        salt: salt,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName
    }, (status, data) => {
        res.status(status);
        res.json(data);
    });
});


//post an event
app.post("/api/event", (req, res) => {
    console.log("Fikk POST-request fra klienten");
    if (req.body.name == undefined) {
        res.status(400);
        return res.json({error: "request missing event-name"});
    }
    if (req.body.userId == undefined) {
        res.status(400);
        return res.json({error: "request missing event-host user Id"});
    }

    eventDao.createEvent({
        name: req.body.name,
        userId: req.body.userId,
        location: req.body.location,
        description: req.body.description,
        startTime: req.body.startTime,
        endTime: req.body.endTime
    }, (status, data) => {
        console.log("sdasa", data);
        res.status(status);
        data.jwt = thisFunctionCreatesNewToken(req.email, req.userId);
        res.send(data);
    });
});

//post a ticket
app.post("/api/event/:event_id/ticket", (req, res) => {
    console.log("Fikk POST-request fra klienten");
    if (req.body.name == undefined) {
        res.status(400);
        return res.json({error: "post-request missing ticket name"});
    }
    if (req.body.price == undefined) {
        res.status(400);
        return res.json({error: "post-request ticket missing ticket-price"});
    }
    if (req.body.amount == undefined) {
        res.status(400);
        return res.json({error: "post request missing number of tickets"});
    }

    if (numberError([req.params.event_id, req.body.price, req.body.amount])) {
        res.status(400);
        return res.json({error: "number field is a string"})
    }

    eventDao.createTicket({
        description: req.body.description,
        name: req.body.name,
        eventId: req.params.event_id,
        price: req.body.price,
        amount: req.body.amount
    }, (status, data) => {
        res.status(status);
        let token = thisFunctionCreatesNewToken(req.email, req.userId);
        res.json({data, jwt: token});
    });
});


//post a performance
app.post("/api/event/:event_id/performance", (req, res) => {
    console.log("Fikk POST-request fra klienten");
    if (req.body.userId === undefined) {
        res.status(400);
        return res.json({error: "bad request : missing artist parameter"});
    }
    if (req.body.startTime === undefined) {
        res.status(400);
        return res.json({error: "bad requst : missing startTime parameter"});
    }
    if (req.body.endTime === undefined) {
        res.status(400);
        return res.json({error: "bad request : missing endTime parameter"});
    }

    if (req.body.contract === undefined) req.body.contract = "";

    if (isNaN(req.params.event_id)) {
        res.status(400);
        return res.json({error: "url parameter event_id must be a number"});
    }

    if (numberError([req.body.userId])) {
        res.status(400);
        return res.json({error: "number field is a string"});
    }

    eventDao.createPerformance({
        artistId: req.body.userId,
        eventId: req.params.event_id,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        contract: req.body.contract
    }, (status, data) => {
        res.status(status);
        let token = thisFunctionCreatesNewToken(req.email, req.userId);
        res.json({data, jwt: token});
    });
});

//post a rider
app.post("/api/performance/:performance_id/rider", (req, res) => {
    console.log("Fikk POST-request fra klienten");
    if (req.body.amount === undefined) return res.json({error: "bad request : missing amount parameter"});

    if (isNaN(req.params.performance_id)) {
        res.status(400);
        return res.json({error: "paramenter performance_id must be a number"});
    }

    if (numberError([req.body.amount])) {
        res.status(400);
        return res.json({error: "number field is a string"});
    }

    eventDao.createRider({
        performanceId: req.params.performance_id,
        name: req.body.name,
        amount: req.body.amount
    }, (status, data) => {
        res.status(status);
        let token = thisFunctionCreatesNewToken(req.email, req.userId);
        res.json({data, jwt: token});
    });
});

// post new crew

app.post('/api/event/:event_id/crew', (req, res) => {
    console.log('fikk post-request fra klient');

    if (isNaN(req.params.event_id)) {
        res.status(400);
        return res.json({error: "url parameter event_id must be a number"});
    }

    if (req.body.profession == undefined) {
        res.status(400);
        return res.json({error: "parameter profession undefined"});
    }
    if (req.body.name == undefined) {
        res.status(400);
        return res.json({error: "parameter name undefined"});
    }
    if (req.body.contactInfo == undefined) {
        res.status(400);
        return res.json({error: "parameter contactInfo undefined"});
    }

    eventDao.createCrew({
        profession: req.body.profession,
        name: req.body.name,
        contactInfo: req.body.contactInfo,
        eventId: req.params.event_id
    }, (status, data) => {
        res.status(status);
        let token = thisFunctionCreatesNewToken(req.email, req.userId);
        res.json({data, jwt: token});
    });
});

/*
app.post("/token", (req, res) => {
    var token = req.headers["x-access-token"];
    jwt.verify(token, publicKey, (err, decoded) => {
        if (err){
            console.log("Token IKKE ok");
            res.status(401);
            res.json({error: "Not authorized"});
        }else{
            let newToken = jwt.sign({username: req.body.username}, privateKey, {
                expiresIn: 60
            });
            res.json({jwt: newToken});
        }
    });
});*/

function numberError(nums: Array<mixed>): boolean {
    for (let i = 0; i < nums.length; i++) {
        if (isNaN(nums[i])) return true;
        if (typeof nums[i] === 'string') {
            if (nums[i].trim() === '') return true;
        }
    }
    return false;
}

function sjekkMail(inc: string): boolean {
    const re = /\S+@\S+\.\S+/;
    return re.test(inc);
}

var server = app.listen(8080);

console.log("running");