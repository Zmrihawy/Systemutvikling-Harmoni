var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var app = express();
var apiRoutes = express.Router();
app.use(bodyParser.json()); // for å tolke JSON
const ServerDao = require("./dao/serverDao.js");

var nodemailer = require('nodemailer');
var generator = require('generate-password');

var passwordHash = require('password-hash');

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
app.get("/bruker/:email", (req, res) => {
    console.log("/bruker/:brukernavn: fikk request fra klient");
    dao.getUser(req.params.email, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

//Get one event
app.get("/arrangement/:arr_id", (req, res) => {
    console.log("/arrangement/:id: fikk request fra klient");
    dao.getEvent(req.params.arr_id, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

//post a user
app.post("/bruker", (req, res) => {
    console.log("Fikk POST-request fra klienten");

    let user = req.body;
    let pw = passwordHash.generate(user.password);

    dao.createUser({username : user.username, password : pw, email : user.email, phone : user.phone, firstName : user.firstName, lastName : user.lastName}, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

//post an event
app.post("/arrangement", (req, res) => {
    console.log("Fikk POST-request fra klienten");
    dao.createEvent(req.body, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

//Update a user
app.put("/bruker/:bruker_id", (req, res) => {
    console.log("Fikk PUT-requesr fra klienten");
    dao.updateUser(req.params.bruker_id, req.body, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

//Update an event
app.put("/arrangement/:arr_id", (req, res) => {
    console.log("Fikk PUT-requesr fra klienten");
    dao.updateEvent(req.params.arr_id, req.body, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

//Delete a user
app.delete("/bruker/:bruker_id", (req, res) => {
    console.log("Fikk DELETE-request fra klienten");
    dao.deleteUser(req.params.bruker_id, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

//Delete an event
app.delete("/arrangement/:arr_id", (req, res) => {
    console.log("Fikk DELETE-request fra klienten");
    dao.deleteEvent(req.params.arr_id, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

//Get all users
app.get("/bruker", (req, res) => {
    console.log("/bruker: fikk request fra klient");
    dao.getUsers((status, data) => {
        res.status(status);
        res.json(data);
    });
});

//Get all events
app.get("/arrangement", (req, res) => {
    console.log("/bruker: fikk request fra klient");
    dao.getAllEvents((status, data) => {
        res.status(status);
        res.json(data);
    });
});

//Get all contracts for an event
app.get("/arrangement/:arr_id", (req, res) => {
    console.log("Fikk request fra klienten");
    dao.getArrContracts(req.params.arr_id, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

//Get all tickets for an event
app.get("/arrangement/:arr_id", (req, res) => {
    console.log("Fikk request fra klienten");
    dao.getTickets(req.params.arr_id, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

//Get all riders for each artist in a specific event
app.get("/arrangement/:arr_id/bruker/:bruker_id", (req, res) => {
    console.log("/bruker/:brukernavn: fikk request fra klient");
    dao.getRiders({arr : req.params.arr_id, artist: req.params.bruker_id}, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

//Get all events for one user
app.get("/bruker/:bruker_id/:active", (req, res) => {
    console.log("/bruker/:bruker_id/:active: fikk request fra klient");
    dao.getRiders({bruker : req.params.bruker_id, active: req.params.active}, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

//Get one contract
app.get("/arrangement/:arr_id/bruker/:bruker_id", (req, res) => {
    console.log("/bruker/:brukernavn: fikk request fra klient");
    dao.getContract({arr : req.params.arr_id, artist: req.params.bruker_id}, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.put("/:brukermail/", (req, res) => {
    dao.getUser(req.params.brukermail, (status, data) => {
        res.status(status);

        let password = generator.generate({
            length : 12, 
            numbers : true
        });

        dao.updateOne({epost : passwordHash.generate(password), email: data.email}, (stat, dat) => {

            res.status(stat);

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
    });
});

var server = app.listen(8080);
