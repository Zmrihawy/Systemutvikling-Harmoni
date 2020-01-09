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

const MASTER_TOKEN:string = "MASTER"; //TODO DELEEEEEETE

var apiRoutes = express.Router();

var app = express();

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

let privateKey = (publicKey = "shhhhhverysecret");

// middleware-function


app.use("/api", (req, res, next) => {
    var token = req.headers["x-access-token"];

    if(token === MASTER_TOKEN){
        req.email = req.body.email;
        next();
    } else {
        jwt.verify(token, publicKey, (err, decoded) => {
            if (err) {
                console.log("Token IKKE ok");
                res.status(401);
                res.json({ error: "Not authorized -> Token Expired" });
            } else {
                userDao.getUser(req.body.userId, (status, data) => {
                    console.log(decoded);
                    console.log(data);
                    console.log("OSOADUSDIOSABDOUASDBOAUSDBUSODA");
                    if(data.length === 0){
                        res.status(401);
                        res.json({error : "Not authorized -> Invalid Token"});
                    } else if(data[0].email === decoded.email) {
                        req.email = decoded.email;
                        next();
                    } else {
                        res.status(401);
                        res.json({error : "Not authorized -> Wrong username"});
                    }
                });
            }
        });
    }

});

function thisFunctionCreatesNewToken(passedMail): {jwt: string} {

    let newToken = jwt.sign({email: passedMail}, privateKey, {
        expiresIn: 60
    });

    return newToken;
}

//Get one user
app.get("/api/user/:id", (req, res) => {
    console.log(`/user/${req.params.id} fikk request fra klient`);
    userDao.getUser(req.params.id, (status, data) => {
        res.status(status);
        let token =  thisFunctionCreatesNewToken(req.email);
        res.json({data, jwt: token});
    });
});

//Get all users
app.get("/api/users", (req, res) => {
    console.log("/user: fikk request fra klient");
    userDao.getAllUsers((status, data) => {
        res.status(status);
        let token =  thisFunctionCreatesNewToken(req.email);
        res.json({data, jwt: token});
    });
});

//Delete rider
app.delete('/api/event/:event_id/rider', (req, res) => {
    console.log("Fikk DELETE-request fra klienten");
    eventDao.deleteRider(req.body, (status, data) => {
        res.status(status);
        let token =  thisFunctionCreatesNewToken(req.email);
        res.json({data, jwt: token});
    });
});

// DELETE TICKET

app.delete("/api/event/:event_id/ticket", (req, res) => {
    console.log("Fikk Delete-request fra klient");
    eventDao.deleteTicket(req.body, (status, data) => {
        res.status(status);
        let token =  thisFunctionCreatesNewToken(req.email);
        res.json({data, jwt: token});
    })

})

// DELETE PERFORMANCE

app.delete("/api/event/:event_id/performance", (req, res) => {
    eventDao.deletePerformance(req.body, (status, data) => {
        res.status(status);
        let token =  thisFunctionCreatesNewToken(req.email);
        res.json({data, jwt: token});
    })
})

// UPDATE PERFORMANCE

app.put("/api/event/:event_id/performance", (req, res) => {
    eventDao.updatePerformance(req.body, (status, data) => {
        res.status(status);
        let token =  thisFunctionCreatesNewToken(req.email);
        res.json({data, jwt: token});
    })
});

//Delete a user
app.delete("/api/user/:user_id", (req, res) => {

    console.log("Fikk DELETE-request fra klienten");

    userDao.getPassword(req.params.user_id, (status, data) => {

        let pw = req.body.password;

        let hashPW = crypto.createHmac('sha512', data[0].salt);

        let pass = pw;

        hashPW.update(pass);

        pass = hashPW.digest('hex');

        if (data[0].password.toString() === pass.toUpperCase()) {
            userDao.deleteUser(req.params.user_id, (st, dt) => {
                res.status(st);
                dt["jwt"] = thisFunctionCreatesNewToken(req.email);
                res.json(dt);
            });
        } else {
            res.error("Feil passord");
        }
    })
});

//Update a user
app.put("/api/user/:user_id", (req, res) => {
    console.log("Fikk PUT-requesr fra klienten");
    userDao.updateUser(req.body, (status, data) => {
        res.status(status);
        let token =  thisFunctionCreatesNewToken(req.email);
        res.json({data, jwt: token});
    });
});

//post a user
app.post("/user", (req, res) => {

    console.log("Fikk POST-request fra klienten");

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

//Get one event
app.get("/api/event/:event_id", (req, res) => {
    console.log("/event/:id: fikk request fra klient");
    eventDao.getEvent(req.params.event_id, (status, data) => {
        res.status(status);
        let token =  thisFunctionCreatesNewToken(req.email);
        res.json({data, jwt: token});
    });
});

//post an event
app.post("/api/event", (req, res) => {
    console.log("Fikk POST-request fra klienten");
    eventDao.createEvent(req.body, (status, data) => {
        console.log("sdasa",data);
        res.status(status);
        data.jwt = thisFunctionCreatesNewToken(req.email);
        res.send(data);
    });
});

//post a ticket
app.post("/api/event/:event_id/ticket", (req, res) => {
    console.log("Fikk POST-request fra klienten");
    eventDao.createTicket(req.body, (status, data) => {
        res.status(status);
        let token =  thisFunctionCreatesNewToken(req.email);
        res.json({data, jwt: token});
    });
});

//put ticket
app.put("/api/event/:event_id/ticket", (req, res) => {
    console.log("Fikk PUT-request fra klienten");
    eventDao.updateTicket(req.body, (status, data) => {
        res.status(status);
        let token =  thisFunctionCreatesNewToken(req.email);
        res.json({data, jwt: token});
    });
});

//put rider
app.put("/api/event/:event_id/rider", (req, res) => {
    console.log("Fikk PUT-request fra klienten");
    eventDao.updateRider(req.body, (status, data) => {
        res.status(status);
        let token =  thisFunctionCreatesNewToken(req.email);
        res.json({data, jwt: token});
    });
});

//post a performance
app.post("api/event/:event_id/user", (req, res) => {
    console.log("Fikk POST-request fra klienten");
    eventDao.createPerformance(req.body, (status, data) => {
        res.status(status);
        let token =  thisFunctionCreatesNewToken(req.email);
        res.json({data, jwt: token});
    });
});

//post a rider
app.post("/api/event/:event_id/rider", (req, res) => {
    console.log("Fikk POST-request fra klienten");
    eventDao.createRider(req.body, (status, data) => {
        res.status(status);
        let token =  thisFunctionCreatesNewToken(req.email);
        res.json({data, jwt: token});
    });
});

//Update an event
app.put("/api/event/:event_id", (req, res) => {
    console.log("Fikk PUT-request fra klienten");
    eventDao.updateEvent(req.body, (status, data) => {
        res.status(status);
        let token =  thisFunctionCreatesNewToken(req.email);
        res.json({data, jwt: token});
    });
});

//Delete an event
app.delete("/api/event/:event_id", (req, res) => {
    console.log("Fikk DELETE-request fra klienten");
    eventDao.deleteEvent(req.params.event_id, (status, data) => {

        res.status(status);
        let token =  thisFunctionCreatesNewToken(req.email);
        res.json({data, jwt: token});
    });
});

//Get all events
app.get("/api/events", (req, res) => {
    console.log("/user: fikk request fra klient");
    eventDao.getAllEvents((status, data) => {
        res.status(status);
        let token =  thisFunctionCreatesNewToken(req.email);
        res.json({data, jwt: token});
    });
});

//Get all contracts for an event
app.get("/api/event/:event_id/contract", (req, res) => {
    console.log("Fikk request fra klienten");

    eventDao.getEventContracts(req.params.event_id, (status, data) => {
        res.status(status);
        let token =  thisFunctionCreatesNewToken(req.email);
        res.json({data, jwt: token});
    });
});

//Edit contract

app.put("/api/event/:event_id/contract", (req, res) => {
    console.log("Fikk put-request om å endre kontrakt");

    eventDao.updateContract(req.body, (status, data) => {
        res.status(status);
        let token =  thisFunctionCreatesNewToken(req.email);
        res.json({data, jwt: token});
    })


});

//Get all tickets for an event
app.get("/api/event/:event_id/tickets", (req, res) => {
    console.log("Fikk request fra klienten");
    eventDao.getEventTickets(req.params.event_id, (status, data) => {
        res.status(status);
        let token =  thisFunctionCreatesNewToken(req.email);
        res.json({data, jwt: token});
    });
});

//Get all riders for each artist in a specific event

app.get("/api/event/:event_id/rider", (req, res) => {
    console.log("Fikk request fra klienten");
    eventDao.getAllRiders(req.params.event_id, (status, data) => {
        res.status(status);
        let token =  thisFunctionCreatesNewToken(req.email);
        res.json({data, jwt: token});
    });
});

//Get all raiders for one user
app.get("/api/user/event/:event_id/:performance_id", (req, res) => {
    console.log("/user/:user_id/:active: fikk request fra klient");
    if (req.params.performanceId == null || req.params.performanceId == undefined) return res.error("feil i fetch-call");
    eventDao.getPerformanceRiders(req.params.perfromanceId, (status, data) => {
        res.status(status);
        let token =  thisFunctionCreatesNewToken(req.email);
        res.json({data, jwt: token});
    });
});

//get all active events for user

app.get("/api/user/:user_id/event/:active", (req, res) => {
    console.log("fikk request get fra klient");
    eventDao.getUsersEvents({userId: req.params.user_id, active: req.params.active}, (status, data) => {
        res.status(status);
        let token =  thisFunctionCreatesNewToken(req.email);
        res.json({data, jwt: token});
    });
});


//By request of a new password
//generate new password and send it via email

app.put("/user/:usermail", (req, res) => {
    userDao.getUser(req.params.usermail, (status, data) => {

        if (data.length === 1) {

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
            });
        } else {
            res.error("Mail not found");
        }
    });
});

// Handles login and returns JWT-token as JSON
app.post("/login", (req, res) => {

    loginOk(req.body.email, req.body.password).then(data => {
        let log: number = data;
        console.log("User ID", log);

        if (log > 0) {
            console.log("username & passord ok");
            let token = jwt.sign({email: req.body.email}, privateKey, {
                expiresIn: 50000
            });
            res.json({jwt: token, userId: log});
        } else {
            console.log("brukernavn & passord IKKE ok");
            res.status(401);
            res.json({error: "Not authorized"});
        }
    });

    async function loginOk(email: string, pw: string): Promise {
        return new Promise(resolve => {
            userDao.getPassword(email, (status, data) => {
                let log = -1;

                let hashPW = crypto.createHmac('sha512', data[0].salt);

                let pass: string = pw;

                hashPW.update(pass);

                pass = hashPW.digest('hex');

                //console.log(data[0]);
                console.log(pass.toUpperCase());
                console.log(data[0].password.toString());

                console.log("lengde inc passowrd " + pass.length);
                console.log(("lengde sql password " + data[0].password.length));
                if (pass.toUpperCase() === data[0].password.toString()) log = data[0].user_id;
                resolve(log);
            });
        });
    }

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

var server = app.listen(8080);

console.log("running");