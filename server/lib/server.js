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
app.use(bodyParser.json()); // for å tolke JSON

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
let eventDao = new EventDao(pool);
let userDao = new UserDao(pool);
let publicKey;
let privateKey = publicKey = "shhhhhverysecret"; // middleware-function

app.use("/api", (req, res, next) => {
  var token = req.headers["x-access-token"];
  jwt.verify(token, publicKey, (err, decoded) => {
    if (err) {
      console.log("Token IKKE ok");
      res.status(401);
      res.json({
        error: "Not authorized"
      });
    } else {
      console.log("Token ok: " + decoded.username);
      next();
    }
  });
}); //Get one user

app.get("/api/user/:id", (req, res) => {
  console.log(`/user/${req.params.id} fikk request fra klient`);
  userDao.getUser(req.params.id, (status, data) => {
    res.status(status);
    res.json(data);
  });
}); //Get all users

app.get("/api/users", (req, res) => {
  console.log("/user: fikk request fra klient");
  userDao.getUsers((status, data) => {
    res.status(status);
    res.json(data);
  });
}); //Delete raider

app.delete('/event/:event_id/raider', (req, res) => {}); //Delete a user

app.delete("/user/:user_id", (req, res) => {
  console.log("Fikk DELETE-request fra klienten");
  userDao.getUser(req.params.user_id);
  userDao.getPassword(req.params.user_id, (status, data) => {
    let pw = req.body.password;
    let hashPW = crypto.createHmac('sha512', data[0].salt);
    let pass = pw;
    hashPW.update(pass);
    pass = hashPW.digest('hex');

    if (data[0].password.toString() === pass.toUpperCase()) {
      userDao.deleteUser(req.params.user_id, (st, dt) => {
        res.status(st);
        res.json(dt);
      });
    } else {
      res.error("Feil passord");
    }
  });
}); //Update a user

app.put("/user/:user_id", (req, res) => {
  console.log("Fikk PUT-requesr fra klienten");
  userDao.updateUser(req.body, (status, data) => {
    res.status(status);
    res.json(data);
  });
}); //post a user

app.post("/user", (req, res) => {
  console.log("Fikk POST-request fra klienten");
  let user = req.body;
  let salt = crypto.randomBytes(16).toString('hex').slice(0, 16);
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
}); //Get one event

app.get("/api/event/:event_id", (req, res) => {
  console.log("/event/:id: fikk request fra klient");
  eventDao.getEvent(req.params.event_id, (status, data) => {
    res.status(status);
    res.json(data);
  });
}); //post an event

app.post("/api/event", (req, res) => {
  console.log("Fikk POST-request fra klienten");
  eventDao.createEvent(req.body, (status, data) => {
    res.status(status);
    res.json(data);
  });
}); //post a ticket

app.post("/api/event/:event_id/ticket", (req, res) => {
  console.log("Fikk POST-request fra klienten");
  eventDao.createTicket(req.body, (status, data) => {
    res.status(status);
    res.json(data);
  });
}); //put ticket

app.put("/api/event/:event_id/ticket", (req, res) => {}); //put rider

app.put("/api/event/:event_id/rider", (req, res) => {}); //post a performance

app.post("api/event/:event_id/user", (req, res) => {
  console.log("Fikk POST-request fra klienten");
  eventDao.createPerformance(req.body, (status, data) => {
    res.status(status);
    res.json(data);
  });
}); //post a rider

app.post("/api/event/:event_id/rider", (req, res) => {
  console.log("Fikk POST-request fra klienten");
  eventDao.createRider(req.body, (status, data) => {
    res.status(status);
    res.json(data);
  });
}); //Update an event

app.put("/event/:event_id", (req, res) => {
  console.log("Fikk PUT-requesr fra klienten");
  eventDao.updateEvent(req.params.event_id, req.body, (status, data) => {
    res.status(status);
    res.json(data);
  });
}); //Delete an event

app.delete("/event/:event_id", (req, res) => {
  console.log("Fikk DELETE-request fra klienten");
  eventDao.deleteEvent(req.params.event_id, (status, data) => {
    // ## TODO sett inn token verify 
    res.status(status);
    res.json(data);
  });
}); //Get all events

app.get("/api/events", (req, res) => {
  console.log("/user: fikk request fra klient");
  eventDao.getAllEvents((status, data) => {
    res.status(status);
    res.json(data);
  });
}); //Get all contracts for an event

app.get("/api/event/:event_id/contract", (req, res) => {
  console.log("Fikk request fra klienten"); //jwt .verify => if decoded username = arrangør => get all
  //else get 1 

  eventDao.getEventContracts(req.params.event_id, (status, data) => {
    //let token = req.headers["x-access-token"];
    res.status(status);
    res.json(data);
  });
}); //Edit contract

app.put("/api/event/:event_id/contract", (req, res) => {//dao.updateCONTRACT()
}); //Get all tickets for an event

app.get("/api/event/:event_id/tickets", (req, res) => {
  console.log("Fikk request fra klienten");
  eventDao.getEventTickets(req.params.event_id, (status, data) => {
    res.status(status);
    res.json(data);
  });
}); //Get all riders for each artist in a specific event

app.get("/api/event/:event_id/raider", (req, res) => {
  console.log("Fikk request fra klienten"); //jwt .verify => if decoded username = arrangør => get all
  //else get 1 

  eventDao.getAllRaiders(req.params.event_id, (status, data) => {
    res.status(status);
    res.json(data);
  });
}); //Get all raiders for one user

app.get("/user/event/:event_id/:performance_id", (req, res) => {
  console.log("/user/:user_id/:active: fikk request fra klient");
  eventDao.getRiders({
    performanceId: req.params.perfromanceId
  }, (status, data) => {
    res.status(status);
    res.json(data);
  });
}); //By request of a new password
//generate new password and send it via email

app.put("/user/:usermail", (req, res) => {
  userDao.getUser(req.params.usermail, (status, data) => {
    if (data.length > 0) {
      let password = generator.generate({
        length: 12,
        numbers: true
      }); //#TODO

      userDao.updateOne({
        epost: generator.generate(password),
        email: data.email
      }, (stat, dat) => {
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
}); // Burde være ekte sertifikat, lest fra config...
// Handles login and returns JWT-token as JSON

app.post("/login", (req, res) => {
  let log = loginOk(req.body.email, req.body.password);

  if (log > 0) {
    console.log("username & passord ok");
    let token = jwt.sign({
      username: req.body.username
    }, privateKey, {
      expiresIn: 60
    });
    res.json({
      jwt: token,
      user_id: log
    });
  } else {
    console.log("brukernavn & passord IKKE ok");
    res.status(401);
    res.json({
      error: "Not authorized"
    });
  }

  function loginOk(email, pw) {
    userDao.getPassword(email, (status, data) => {
      let hashPW = crypto.createHmac('sha512', data[0].salt);
      let pass = pw;
      hashPW.update(pass);
      pass = hashPW.digest('hex');
      if (pass.toUpperCase() === data[0].password.toString()) return data[0].user_id;
      return -1;
    });
    return -1;
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
});body*/

var server = app.listen(8080);