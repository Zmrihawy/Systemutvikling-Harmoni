var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var app = express();
var cors = require("cors");
var jwt = require("jsonwebtoken");
var apiRoutes = express.Router();
app.use(bodyParser.json()); // for å tolke JSON
const ServerDao = require("./dao/serverDao.js");

var crypto = require('crypto');

var nodemailer = require('nodemailer');
var generator = require('generate-password');


var pool = mysql.createPool({
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

let dao = new ServerDao(pool);

//Get one user
app.get("/user/:email", (req, res) => {
    console.log("/user/:username: fikk request fra klient");
    dao.getUser(req.params.email, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

//Get one event
app.get("/event/:event_id", (req, res) => {
    console.log("/event/:id: fikk request fra klient");
    dao.getEvent(req.params.event_id, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

//post a user
app.post("/user", (req, res) => {

    console.log("Fikk POST-request fra klienten");

    let user = req.body;
    
    let salt = crypto.randomBytes(16).toString('hex').slice(0,16);

    let pw = user.password;

    let hash = crypto.createHmac('sha512', salt);

    hash.update(pw);

    pw = hash.digest('hex');

    dao.createUser({username : user.username, password : pw, salt: salt, email : user.email, phone : user.phone, firstName : user.firstName, lastName : user.lastName}, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

//post an event
app.post("/event", (req, res) => {
    console.log("Fikk POST-request fra klienten");
    dao.createEvent(req.body, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

//post a ticket
app.post("/ticket", (req, res) => {
    console.log("Fikk POST-request fra klienten");
    dao.createTicket(req.body, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

//post a performance
app.post("/performance", (req, res) => {
    console.log("Fikk POST-request fra klienten");
    dao.createPerformance(req.body, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

//post a rider
app.post("/rider", (req, res) => {
    console.log("Fikk POST-request fra klienten");
    dao.createRider(req.body, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

//Update a user
app.put("/user/:bruker_id", (req, res) => {
    console.log("Fikk PUT-requesr fra klienten");
    dao.updateUser(req.params.user_id, req.body, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

//Update an event
app.put("/event/:event_id", (req, res) => {
    console.log("Fikk PUT-requesr fra klienten");
    dao.updateEvent(req.params.event_id, req.body, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

//Delete a user
app.delete("/user/:user_id", (req, res) => {
    console.log("Fikk DELETE-request fra klienten");
    dao.deleteUser(req.params.user_id, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

//Delete an event
app.delete("/event/:event_id", (req, res) => {
    console.log("Fikk DELETE-request fra klienten");
    dao.deleteEvent(req.params.event_id, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

//Get all users
app.get("/user", (req, res) => {
    console.log("/user: fikk request fra klient");
    dao.getUsers((status, data) => {
        res.status(status);
        res.json(data);
    });
});

//Get all events
app.get("/event", (req, res) => {
    console.log("/user: fikk request fra klient");
    dao.getAllEvents((status, data) => {
        res.status(status);
        res.json(data);
    });
});

//Get all contracts for an event
app.get("/event/:event_id", (req, res) => {
    console.log("Fikk request fra klienten");
    dao.getArrContracts(req.params.event_id, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

//Get all tickets for an event
app.get("/event/:event_id", (req, res) => {
    console.log("Fikk request fra klienten");
    dao.getTickets(req.params.event_id, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

//Get all riders for each artist in a specific event
app.get("/event/:event_id/user/:user_id", (req, res) => {
    console.log("/user/:username: fikk request fra klient");
    dao.getRiders({arr : req.params.event_id, artist: req.params.user_id}, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

//Get all events for one user
app.get("/user/:user_id/:active", (req, res) => {
    console.log("/user/:user_id/:active: fikk request fra klient");
    dao.getRiders({user : req.params.user_id, active: req.params.active}, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

//Get one contract
app.get("/event/:event_id/user/:user_id", (req, res) => {
    console.log("/user/:username: fikk request fra klient");
    dao.getContract({arr : req.params.event_id, artist: req.params.user_id}, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

//By request of a new password
//generate new password and send it via email

app.put("user/:usermail/", (req, res) => {
    dao.getUser(req.params.usermail, (status, data) => {

        if(data.length > 0){

            let password = generator.generate({
                length : 12, 
                numbers : true
            });
    
            dao.updateOne({epost : passwordHash.generate(password), email: data.email}, (stat, dat) => {

                let mailOptions = {
                    from: 'noreply.harmoni.123@gmail.com',
                    to: data.epost,
                    subject: 'New Password',
                    text: `Her er ditt nye passord: \n${password}`
                    };
                    
                transporter.sendMail(mailOptions, function(error, info){
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

// Burde være ekte sertifikat, lest fra config...
let privateKey = (publicKey = "shhhhhverysecret");

// Handles login and returns JWT-token as JSON
app.post("/login", (req, res) => {
    if (loginOk(req.body.userId, req.body.password)) {
        console.log("username & passord ok");
        let token = jwt.sign({ username: req.body.username }, privateKey, {
            expiresIn: 60
        });
        res.json({ jwt: token });
    } else {
        console.log("brukernavn & passord IKKE ok");
        res.status(401);
        res.json({ error: "Not authorized" });
    }

    function loginOk(usrId, pw){
        dao.getUser(usrId, (status, data) => {

            let hashPW = crypto.createHmac('sha512', data[0].salt);

            let pass = pw;

            hashPW.update(pass);

            pass = hashPW.digest('hex');

            if(pass === data[0].password.toString()) return true;

            return false;
            
        })
    }
});

// middleware-function
app.use("/api", (req, res, next) => {
    var token = req.headers["x-access-token"];
    jwt.verify(token, publicKey, (err, decoded) => {
        if (err) {
            console.log("Token IKKE ok");
            res.status(401);
            res.json({ error: "Not authorized" });
        } else {
            console.log("Token ok: " + decoded.username);
            next();
        }
    });
});

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
});

var server = app.listen(8080);
