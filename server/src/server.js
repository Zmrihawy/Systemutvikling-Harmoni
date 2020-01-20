// @flow

import mysql from "mysql";

import express from "express";

import bodyParser from "body-parser";

import cors from "cors";

import jwt from "jsonwebtoken";

const fs = require('fs');

import crypto from 'crypto';

import nodemailer from 'nodemailer';

import generator from 'generate-password';

import UserDao from './dao/userDao.js';

import EventDao from './dao/eventDao.js';

import Uploader from './upload';

import discord from './discord-bot'

const apiRoutes = express.Router();

const app = express();

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(cors(corsOptions));

app.use(bodyParser.json());

const pool: pool = mysql.createPool({
    connectionLimit: 2,
    host: "mysql.stud.iie.ntnu.no",
    user: "kwgulake",
    password: "qra2ZQqh",
    database: "kwgulake",
    debug: false
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'noreply.harmoni.123@gmail.com',
        pass: 'qra2ZQqh'
    }
});

export let eventDao: EventDao = new EventDao(pool);
let userDao: UserDao = new UserDao(pool);
let uploader: Uploader = new Uploader();

let publicKey: string;

let privateKey = (publicKey = "arbeiderklassenrusteropptilvepnetrevolusjon");

// middleware-functions
app.use("/api", (req, res, next) => {
    var token = req.headers["x-access-token"];

    if (token == undefined) return res.status(400).json({error: "missing access token header"});

    jwt.verify(token, publicKey, (err, decoded) => {
        if (err) {
            console.log("Token IKKE ok");
            res.status(401).json({error: "Not authorized -> Token Expired"});
        } else {
            console.log(req.email + "har gjort en request");
            req.email = decoded.email;
            req.userId = decoded.userId;
            next();
        }
        ;
    });
});

// Handles login and returns JWT-token as JSON
app.post("/login", (req, res) => {
    console.log("user trying to log in");

    if (req.body.email == undefined) return res.status(400).json({error: "bad request : missing email parameter"});
    else if (req.body.password == undefined) return res.status(400).json({error: " bad request : mssing password parameter"});
    else if (!sjekkMail(req.body.email)) return res.status(400).json({error: "parameter email is not a valid email"});

    userDao.getPassword(req.body.email, (status, data) => {

        if (data[0] == undefined) return res.status(401).json({error: "wrong email"});

        let hashPW = crypto.createHmac('sha512', data[0].salt);
        let pass: string = req.body.password;

        hashPW.update(pass);
        pass = hashPW.digest('hex');

        let login = data[0].user_id;

        if(data.length > 1){
            if(pass.toUpperCase() === data[0].password_hex.toString() || pass.toUpperCase() === data[1].password_hex.toString){
                        console.log("User ID:", login);
                        console.log("username & passord ok");

                        let token = jwt.sign({email: req.body.email, userId: login}, privateKey, {
                            expiresIn: 50000
                        });
                        return res.json({jwt: token, userId: login});
            }
            return res.status(401).json({error: "wrong password"});
        } else{
            if(pass.toUpperCase() === data[0].password_hex.toString()){
                console.log("User ID:", login);
                console.log("username & passord ok");

                let token = jwt.sign({email: req.body.email, userId: login}, privateKey, {
                    expiresIn: 50000
                });
                return res.json({jwt: token, userId: login});
            }
        }
        return res.status(401).json({error: "wrong password"});
    });
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

    if (numberError([req.params.id])) return res.status(400).json({error: "parameter user_id must be a number"})

    userDao.getUser(req.params.id, (status, data) => {
        res.status(status);
        let token = thisFunctionCreatesNewToken(req.email, req.userId);
        res.json({data, jwt: token});
    });
});

//Get one event
app.get("/api/event/:event_id", (req, res) => {
    console.log("/event/:event_id fikk request fra klient");

    if (numberError([req.params.event_id])) return res.status(400).json({error: "url parameter event_id must be a number"});

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

//Get all performances for an event
app.get("/api/event/:event_id/performances", (req, res) => {
    console.log("Fikk request fra klienten");

    if (numberError([req.params.event_id])) return res.status(400).json({error: "parameter event_id must be a number"});

    eventDao.getEvent(req.params.event_id, (status, data) => {
        if (data[0].host_id == req.user_id) {
            eventDao.getEventPerformancesHost(req.userId, (status, data) => {
                res.status(status);
                let token = thisFunctionCreatesNewToken(req.email, req.userId);
                res.json({data, jwt: token});
            })
        } else {
            eventDao.getEventPerformancesArtist({eventId: req.params.event_id, userId: req.userId}, (status, data) => {
                res.status(status);
                let token = thisFunctionCreatesNewToken(req.email, req.userId);
                res.json({data, jwt: token});
            });
        }
    });
});

//Get all tickets for an event
app.get("/api/event/:event_id/tickets", (req, res) => {
    console.log("Fikk request fra klienten");

    if (numberError([req.params.event_id])) return res.status(400).json({error: "url parameter event_id must be a number"});

    eventDao.getTickets(req.params.event_id, (status, data) => {
        res.status(status);
        let token = thisFunctionCreatesNewToken(req.email, req.userId);
        res.json({data, jwt: token});
    });
});

//Get all raiders for one user
app.get("/api/user/event/:event_id/:performance_id", (req, res) => {
    console.log("/user/:user_id/:active: fikk request fra klient");

    if (numberError([req.params.performance_id])) return res.status(400).json({error: "number field cannot be string"})

    eventDao.getRiders(req.params.performanceId, (status, data) => {
        res.status(status);
        let token = thisFunctionCreatesNewToken(req.email, req.userId);
        res.json({data, jwt: token});
    });
});

//get all active/archived events for user
app.get("/api/user/:user_id/event/:active", (req, res) => {
    console.log("fikk request get fra klient");

    if (numberError([req.params.user_id, req.params.active])) return res.status(400).json({error: "number field cannot be string"});

    eventDao.getUsersEvents({userId: req.params.user_id, active: req.params.active}, (status, data) => {
        res.status(status);
        let token = thisFunctionCreatesNewToken(req.email, req.userId);
        res.json({data, jwt: token});
    });
});

//get crew given in a specific event
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

//Delete ticket
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

//Delete performance
app.delete("/api/performance/:performance_id", (req, res) => {
    console.log("Fikk DELETE-request fra klienten");

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

    if (numberError([req.params.user_id])) return res.status(400).json({error: "url parameter user_id must be a number"});
    else if (req.body.password == undefined) return res.status(400).json({error: "request missing password"});

    userDao.getPassword(req.params.email, (status, data) => {

        let pw = req.body.password;

        let hashPW = crypto.createHmac('sha512', data[0].salt);

        let pass = pw;

        hashPW.update(pass);

        pass = hashPW.digest('hex');

        if(data.length === 2){
            if(data[0].password_hex.toString() === pass.toUpperCase() || data[1].password_hex.toString() === pass.toUpperCase()){
                userDao.deleteUser(req.params.user_id, (st, dt) => {
                res.status(st);
                return res.json(dt);
            });    
            } return res.json(401).json({error : "Wrong password"});
        }else {
            if(data[0].password_hex.toString() === pass.toUpperCase()){
               userDao.deleteUser(req.params.user_id, (st, dt) => {
                res.status(st);
                return res.json(dt);
            }); 
            } return res.json(401).json({error : "Wrong password"});
        }
    })
});

//Delete an event
app.delete("/api/event/:event_id", (req, res) => {
    console.log("Fikk DELETE-request fra klienten");

    if (numberError([req.params.event_id])) return res.status(400).json({error: "url parameter event_id must be a number"});

    eventDao.getEvent(req.params.event_id, (status, data) => {
        if (data[0].user_id === req.userId) {
            eventDao.deleteEvent(req.params.event_id, (status, data) => {
                res.status(status);
                let token = thisFunctionCreatesNewToken(req.email, req.userId);
                res.json({data, jwt: token});
            });
        } else res.status(401).json({error: "not authorized"});
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

    if (numberError([req.params.user_id, req.body.phone])) return res.status(400).json({error: "number field cannot be a string"});
    else if (req.userId != req.params.user_id) return res.status(401).json({error: "Cannot edit other users"})
    else if (req.body.username == undefined) res.status(400).json({error: "Missing parameter username"});
    else if (req.body.email == undefined) return res.status(400).json({error: "Missing parameter email"});
    else if (req.body.phone == undefined) return res.status(400).json({error: "Missing parameter phone"});
    else if (req.body.firstName == undefined) return res.status(400).json({error: "Missing parameter firstName"});
    else if (req.body.lastName == undefined) return res.status(400).json({error: "Missing parameter lastName"});
    else if (!sjekkMail(req.body.email)) return res.status(400).json({error: "inc mail is not valid"});

    userDao.updateUser({
            username: req.body.username,
            email: req.body.email,
            phone: req.body.phone,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userId: req.params.user_id
        },
        (status, data) => {
            res.status(status);
            let token = thisFunctionCreatesNewToken(req.email, req.userId);
            res.json({data, jwt: token});
        });
});

//Update crew
app.put('/api/event/:event_id/crew/:crew_id', (req, res) => {
    console.log('fikk put-request fra klient');

    if (req.body.profession == undefined) return res.status(400).json({error: "parameter profession undefined"});
    else if (req.body.name == undefined) return res.status(400).json({error: "parameter name undefined"});
    else if (req.body.contactInfo == undefined) return res.status(400).json({error: "parameter contactInfo undefined"});
    else if (numberError([req.params.event_id, req.params.crew_id])) return res.status(400).json({error: "Number field cannot be string"});

    eventDao.updateCrew({
            profession: req.body.profession,
            name: req.body.name,
            contactInfo: req.body.contactInfo,
            crewId: req.params.crew_id
        },
        (status, data) => {
            res.status(status);
            let token = thisFunctionCreatesNewToken(req.email, req.userId);
            res.json({data, jwt: token});
        });
});

//Update performance
app.put("/api/performance/:performance_id", (req, res) => {
    console.log("Fikk PUT-request fra klienten");

    if (req.body.startTime == undefined) return res.status(400).json({error: "bad request"});
    else if (req.body.endTime == undefined) return res.status(400).json({error: "request missing end-time parameter"});
    else if (numberError([req.params.performance_id])) return res.status(400).json({error: "url parameter performance_id must be a number"});

    if (req.body.contract == undefined) req.body.contract = "";

    eventDao.updatePerformance({
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            contract: req.body.contract,
            performanceId: req.params.performance_id
        },
        (status, data) => {
            res.status(status);
            let token = thisFunctionCreatesNewToken(req.email, req.userId);
            res.json({data, jwt: token});
        })
});

//Update ticket
app.put("/api/event/:event_id/ticket", (req, res) => {
    console.log("Fikk PUT-request fra klienten");

    if (req.body.price == undefined) return res.status(400).json({error: "request missing ticket - price"});
    else if (req.body.amount == undefined) return res.status(400).json({error: "request missing number of tickets"});
    else if (req.body.name == undefined) return res.status(400).json({error: "request missing ticket-name"});
    else if (numberError([req.params.event_id, req.body.price, req.body.amount])) return res.status(400).json({error: "number field is a string"})

    eventDao.updateTicket({
            description: req.body.description,
            name: req.body.name,
            eventId: req.params.event_id,
            price: req.body.price,
            amount: req.body.amount
        },
        (status, data) => {
            res.status(status);
            let token = thisFunctionCreatesNewToken(req.email, req.userId);
            res.json({data, jwt: token});
        });
});

//put rider
app.put("/api/performance/:performance_id/rider", (req, res) => {
    console.log("Fikk PUT-request fra klienten");

    if (req.body.name == undefined) return res.status(400).json({error: "bad request : missing name"});
    else if (req.body.amount == undefined) return res.status(400).json({error: "bad request : missing amount of tickets"});
    else if (req.body.oldName == undefined) return res.status(400).json({error: "bad request : missing old name - parameter"});
    else if (numberError([req.params.performance_id])) return res.status(400).json({error: "url parameter performance_id must be a number"});
    else if (numberError([req.body.amount])) return res.status(400).json({error: "number field is a string"});

    eventDao.updateRider({
            name: req.body.name,
            amount: req.body.amount,
            performanceId: req.params.performance_id,
            oldName: req.body.oldName
        },
        (status, data) => {
            res.status(status);
            let token = thisFunctionCreatesNewToken(req.email, req.userId);
            res.json({data, jwt: token});
        });
});

//By request of a new password
//generate new password and send it via email
app.put("/user/:usermail", (req, res) => {
    console.log("Fikk PUT-request fra klienten");

    if (!sjekkMail(req.params.usermail)) return res.status(400).json({error: "given mail is not a valid mail"});

    userDao.getPassword(req.params.usermail, (status, data) => {

        if (data.length === 0) return res.status(400).json({errror: "user not found"});
        if (data.length > 2) return res.status(501).json({errror: "internal server error"});

        let password = generator.generate({
            length: 12,
            numbers: true
        });

        let pw = password;

        let hashPW = crypto.createHmac('sha512', data[0].salt);

        hashPW.update(pw);

        pw = hashPW.digest('hex');

        if(data.length === 0){
            userDao.createPassword({
                userId : data[0].user_id, password : pw, autogen : 1
            }, (stat, dat) => sendMail(req, res, password));
        } else {
            userDao.updatePassword({
                passId : data[1].password_id, password : pw, autogen : 1
            }, (stat, dat) => sendMail(req, res, password));
        }
    });

    function sendMail(req, res, password){
            
        let mailOptions = {
            from: 'noreply.harmoni.123@gmail.com',
            to: req.params.usermail,
            subject: 'New Password',
            text: `Her er ditt nye passord:\n${password}`
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
    }
});

//Update password
app.put("/api/user/:user_id/password", (req, res) => {
    console.log("Fikk put-request om å oppdatere passord");

    if (numberError([req.params.user_id])) return res.status(400).res.json({error: "number field cannot be string"});
    else if (req.params.user_id != req.userId) return res.status(401).json({error: "cannot change password of another user"});

    userDao.getPassword(req.email, (status, data) => {
        if (data.length > 2) return res.status(500).json({error: "token error"});

        if (data[0] == undefined) return res.status(401).json({error: "wrong email"});

        let hashPW = crypto.createHmac('sha512', data[0].salt);
        let pass: string = req.body.oldPassword;

        hashPW.update(pass);
        pass = hashPW.digest('hex');

        let login = data[0].user_id;

        if(data.length === 2){
            if(pass.toUpperCase() !== data[0].password_hex.toString() && pass.toUpperCase() !== data[1].password_hex.toString()){
                return res.status(401).json({error : "wrong password"});
            }
        } else if(pass.toUpperCase() !== data[0].password_hex.toString()) return res.status(401).json({error: "wrong password"});

        let hashpw2 = crypto.createHmac('sha512', data[0].salt);

        let pw = req.body.newPassword;
        hashpw2.update(pw);
        pw = hashpw2.digest('hex');

        userDao.setPassword({userId: req.userId, password: pw}, (status, data) => {
            res.status(status);
            let token = thisFunctionCreatesNewToken(req.mail, req.userId);
            res.json({data, jwt: token});
        })
    });
});

//Update an event
app.put("/api/event/:event_id", (req, res) => {
    console.log("Fikk PUT-request fra klienten");

    if (numberError([req.params.event_id])) return res.status(400).json({error: "url parameter event_id must be a number"})
    else if (numberError([req.body.active])) return res.status(400).json({error: "number field is a string"});
    //todo check if user is logged in, maybe it does, I don't know
    else if (req.body.eventName == undefined) return res.status(400).json({error: "bad request : missing eventName parameter"});
    else if (req.body.startTime == undefined) return res.status(400).json({error: "bad request : missing startTime parameter"});
    else if (req.body.location == undefined) return res.status(400).json({error: "bad request : missing location parameter"});
    else if (req.body.longitude == undefined) return res.status(400).json({error: "bad request : missing longitude parameter"});
    else if (req.body.latitude == undefined) return res.status(400).json({error: "bad request : missing latitude parameter"});

    if (req.body.active == undefined) req.body.active = 1;

    let description = req.body.description;
    if (description == undefined) description = "";

    eventDao.updateEvent({
            eventName: req.body.eventName,
            hostId: req.userId,
            active: req.body.active,
            location: req.body.location,
            longitude: req.body.longitude,
            latitude: req.body.latitude,
            description: description,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            eventId: req.params.event_id
        },
        (status, data) => {
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

    if (req.body.username == undefined) return res.status(400).json({error: "request missing username"});
    else if (req.body.password == undefined) return res.status(400).json({error: "request missing password"});
    else if (req.body.email == undefined) return res.status(400).json({error: "request missing email"});
    else if (req.body.firstName == undefined) return res.status(400).json({error: "request missing first name"});
    else if (req.body.lastName == undefined) return res.status(400).json({error: "request missing last name"});
    else if (req.body.phone == undefined) return res.status(400).json({error: "request missing phone"});
    else if (!sjekkMail(req.body.email)) return res.status(400).json({error: "parameter email is not a valid email"});
    else if (numberError([req.body.phone])) return res.status(400).json({error: "number field is a string"});

    userDao.checkCred({username: req.body.username, email: req.body.email}, (status, data) => {
        if (data.length > 0) {
            if (data[0].username === req.body.username && data[0].email === req.body.email) return res.status(409).json({error: "mail and username"});
            else if (data[0].username === req.body.username) return res.status(409).json({error: "username"});
            else return res.status(409).json({error: "mail"});
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
            },
            (status, data) => {
                let token = thisFunctionCreatesNewToken(user.mail, 0);
                res.status(status).json({data, jwt: token});
            });
    });
});


//post an event
app.post("/api/event", (req, res) => {
    console.log("Fikk POST-request fra klienten");

    if (numberError([req.body.active])) return res.status(400).json({error: "number field is a string"});
    else if (req.body.eventName == undefined) return res.status(400).json({error: "bad request : missing eventName parameter"});
    else if (req.body.startTime == undefined) return res.status(400).json({error: "bad request : missing startTime parameter"});
    else if (req.body.userId == undefined) return res.status(400).json({error: "bad request : missing userId parameter"});
    else if (req.body.location == undefined) return res.status(400).json({error: "bad request : missing location parameter"});
    else if (req.body.longitude == undefined) return res.status(400).json({error: "bad request : missing longitude parameter"});
    else if (req.body.latitude == undefined) return res.status(400).json({error: "bad request : missing latitude parameter"});


    eventDao.createEvent({
            eventName: req.body.eventName,
            userId: req.body.userId,
            location: req.body.location,
            longitude: req.body.longitude,
            latitude: req.body.latitude,
            description: req.body.description,
            startTime: req.body.startTime,
            endTime: req.body.endTime
        },
        (status, data) => {
            res.status(status);
            data.jwt = thisFunctionCreatesNewToken(req.email, req.userId);
            res.send(data);
        });
});

//post a ticket
app.post("/api/event/:event_id/ticket", (req, res) => {
    console.log("Fikk POST-request fra klienten");

    if (req.body.name == undefined) return res.status(400).json({error: "post-request missing ticket name"});
    else if (req.body.price == undefined) return res.status(400).json({error: "post-request ticket missing ticket-price"});
    else if (req.body.amount == undefined) return res.status(400).json({error: "post request missing number of tickets"});
    else if (numberError([req.params.event_id, req.body.price, req.body.amount])) return res.status(400).json({error: "number field is a string"})

    eventDao.createTicket({
            description: req.body.description,
            name: req.body.name,
            eventId: req.params.event_id,
            price: req.body.price,
            amount: req.body.amount
        },
        (status, data) => {
            res.status(status);
            let token = thisFunctionCreatesNewToken(req.email, req.userId);
            res.json({data, jwt: token});
        });
});


//post a performance
app.post("/api/event/:event_id/performance", (req, res) => {
    console.log("Fikk POST-request fra klienten");

    if (req.body.userId == undefined) return res.status(400).json({error: "bad request : missing artist parameter"});
    else if (req.body.startTime == undefined) return res.status(400).json({error: "bad requst : missing startTime parameter"});
    else if (req.body.endTime == undefined) return res.status(400).json({error: "bad request : missing endTime parameter"});
    else if (numberError([req.params.event_id])) return res.status(400).json({error: "url parameter event_id must be a number"});
    else if (numberError([req.body.userId])) return res.status(400).json({error: "number field is a string"});

    if (req.body.contract == undefined) req.body.contract = "";

    eventDao.createPerformance({
            artistId: req.body.userId,
            eventId: req.params.event_id,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            contract: req.body.contract
        },
        (status, data) => {
            res.status(status);
            let token = thisFunctionCreatesNewToken(req.email, req.userId);
            res.json({data, jwt: token});
        });
});

//post a rider
app.post("/api/performance/:performance_id/rider", (req, res) => {
    console.log("Fikk POST-request fra klienten");

    if (req.body.amount == undefined) return res.json({error: "bad request : missing amount parameter"});
    else if (numberError([req.params.performance_id])) return res.status(400).json({error: "paramenter performance_id must be a number"});
    else if (numberError([req.body.amount])) return res.status(400).json({error: "number field is a string"});

    eventDao.createRider({
            performanceId: req.params.performance_id,
            name: req.body.name,
            amount: req.body.amount
        },
        (status, data) => {
            res.status(status);
            let token = thisFunctionCreatesNewToken(req.email, req.userId);
            res.json({data, jwt: token});
        });
});

// post new crew
app.post('/api/event/:event_id/crew', (req, res) => {
    console.log('fikk post-request fra klient');

    if (numberError([req.params.event_id])) res.status(400).json({error: "url parameter event_id must be a number"});
    else if (req.body.profession == undefined) return res.status(400).json({error: "parameter profession undefined"});
    else if (req.body.name == undefined) return res.status(400).json({error: "parameter name undefined"});
    else if (req.body.contactInfo == undefined) return res.status(400).json({error: "parameter contactInfo undefined"});

    eventDao.createCrew({
            profession: req.body.profession,
            name: req.body.name,
            contactInfo: req.body.contactInfo,
            eventId: req.params.event_id
        },
        (status, data) => {
            res.status(status);
            let token = thisFunctionCreatesNewToken(req.email, req.userId);
            res.json({data, jwt: token});
        });
});

// put contract
app.put('/api/event/event_id/performance/performance_id/contract', uploader.uploadContract);

// get contract
app.get('/api/event/event_id/performance/performance_id/contract', (req, res) => {
    console.log('Fikk get-request fra klient');

    eventDao.downloadContract(req.params.performance_id, (status, data) => {
        res.status(status);
        let token = thisFunctionCreatesNewToken(req.email, req.userId);

        // fs.writeFile('fil.pdf', data[0].contract, err => {
        //     if (err) return console.log('Error writing file');
        //     console.log('File saved!')
        // });

        res.json({data: data[0].contract, jwt: token});
    });
});

// put event picture
app.put('/api/event/event_id/performance/performance_id/picture', uploader.uploadEventPicture);

// get event picture
app.get('/api/event/event_id/performance/performance_id/picture', (req, res) => {
    console.log('Fikk get-request fra klient');

    eventDao.downloadPicture({
        eventId: req.params.event_id,
        performanceId: req.params.performance_id
    }, (status, data) => {
        res.status(status);
        let token = thisFunctionCreatesNewToken(req.email, req.userId);

        res.json({data: data[0].contract, jwt: token});
    });
});

// put user picture
app.put('/api/user/user_id/picture', uploader.uploadUserPicture);

// get user picture
app.get('/api/user/user_id/picture', (req, res) => {
    console.log('Fikk get-request fra klient');

    userDao.downloadPicture(req.params.user_id, (status, data) => {
        res.status(status);
        let token = thisFunctionCreatesNewToken(req.email, req.userId);

        res.json({data: data[0].contract, jwt: token});
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


//
// GET
// PUT - /api/
// event / event_id / picture
//
// GET
// PUT - /api/us
// er / user_id / picutre
// GET
// PUT - /api/
// event / event_id / perfomance / performance_id / contract