"use strict";

var _mysql = _interopRequireDefault(require("mysql"));

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cors = _interopRequireDefault(require("cors"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _crypto = _interopRequireDefault(require("crypto"));

var _nodemailer = _interopRequireDefault(require("nodemailer"));

var _generatePassword = _interopRequireDefault(require("generate-password"));

var _userDao = _interopRequireDefault(require("./dao/userDao.js"));

var _eventDao = _interopRequireDefault(require("./dao/eventDao.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var apiRoutes = _express["default"].Router();

var app = (0, _express["default"])();
app.use(_bodyParser["default"].json()); // for å tolke JSON

var pool = _mysql["default"].createPool({
  connectionLimit: 2,
  host: "mysql.stud.iie.ntnu.no",
  user: "kwgulake",
  password: "qra2ZQqh",
  database: "kwgulake",
  debug: false
});

var transporter = _nodemailer["default"].createTransport({
  service: 'gmail',
  auth: {
    user: 'noreply.harmoni.123@gmail.com',
    pass: 'qra2ZQqh'
  }
});

var eventDao = new _eventDao["default"](pool);
var userDao = new _userDao["default"](pool);
var publicKey;
var privateKey = publicKey = "shhhhhverysecret"; // middleware-function

app.use("/api", function (req, res, next) {
  var token = req.headers["x-access-token"];

  _jsonwebtoken["default"].verify(token, publicKey, function (err, decoded) {
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

app.get("/api/user/:id", function (req, res) {
  console.log("/user/".concat(req.params.id, " fikk request fra klient"));
  userDao.getUser(req.params.id, function (status, data) {
    res.status(status);
    res.json(data);
  });
}); //Get all users

app.get("/api/users", function (req, res) {
  console.log("/user: fikk request fra klient");
  userDao.getUsers(function (status, data) {
    res.status(status);
    res.json(data);
  });
}); //Delete raider

app["delete"]('/event/:event_id/raider', function (req, res) {}); //Delete a user

app["delete"]("/user/:user_id", function (req, res) {
  console.log("Fikk DELETE-request fra klienten");
  userDao.getUser(req.params.user_id);
  userDao.getPassword(req.params.user_id, function (status, data) {
    var pw = req.body.password;

    var hashPW = _crypto["default"].createHmac('sha512', data[0].salt);

    var pass = pw;
    hashPW.update(pass);
    pass = hashPW.digest('hex');

    if (data[0].password.toString() === pass.toUpperCase()) {
      userDao.deleteUser(req.params.user_id, function (st, dt) {
        res.status(st);
        res.json(dt);
      });
    } else {
      res.error("Feil passord");
    }
  });
}); //Update a user

app.put("/user/:user_id", function (req, res) {
  console.log("Fikk PUT-requesr fra klienten");
  userDao.updateUser(req.body, function (status, data) {
    res.status(status);
    res.json(data);
  });
}); //post a user

app.post("/user", function (req, res) {
  console.log("Fikk POST-request fra klienten");
  var user = req.body;

  var salt = _crypto["default"].randomBytes(16).toString('hex').slice(0, 16);

  var pw = user.password;

  var hash = _crypto["default"].createHmac('sha512', salt);

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
  }, function (status, data) {
    res.status(status);
    res.json(data);
  });
}); //Get one event

app.get("/api/event/:event_id", function (req, res) {
  console.log("/event/:id: fikk request fra klient");
  eventDao.getEvent(req.params.event_id, function (status, data) {
    res.status(status);
    res.json(data);
  });
}); //post an event

app.post("/api/event", function (req, res) {
  console.log("Fikk POST-request fra klienten");
  eventDao.createEvent(req.body, function (status, data) {
    res.status(status);
    res.json(data);
  });
}); //post a ticket

app.post("/api/event/:event_id/ticket", function (req, res) {
  console.log("Fikk POST-request fra klienten");
  eventDao.createTicket(req.body, function (status, data) {
    res.status(status);
    res.json(data);
  });
}); //put ticket

app.put("/api/event/:event_id/ticket", function (req, res) {}); //put rider

app.put("/api/event/:event_id/rider", function (req, res) {}); //post a performance

app.post("api/event/:event_id/user", function (req, res) {
  console.log("Fikk POST-request fra klienten");
  eventDao.createPerformance(req.body, function (status, data) {
    res.status(status);
    res.json(data);
  });
}); //post a rider

app.post("/api/event/:event_id/rider", function (req, res) {
  console.log("Fikk POST-request fra klienten");
  eventDao.createRider(req.body, function (status, data) {
    res.status(status);
    res.json(data);
  });
}); //Update an event

app.put("/event/:event_id", function (req, res) {
  console.log("Fikk PUT-requesr fra klienten");
  eventDao.updateEvent(req.params.event_id, req.body, function (status, data) {
    res.status(status);
    res.json(data);
  });
}); //Delete an event

app["delete"]("/event/:event_id", function (req, res) {
  console.log("Fikk DELETE-request fra klienten");
  eventDao.deleteEvent(req.params.event_id, function (status, data) {
    // ## TODO sett inn token verify 
    res.status(status);
    res.json(data);
  });
}); //Get all events

app.get("/api/events", function (req, res) {
  console.log("/user: fikk request fra klient");
  eventDao.getAllEvents(function (status, data) {
    res.status(status);
    res.json(data);
  });
}); //Get all contracts for an event

app.get("/api/event/:event_id/contract", function (req, res) {
  console.log("Fikk request fra klienten"); //jwt .verify => if decoded username = arrangør => get all
  //else get 1 

  eventDao.getEventContracts(req.params.event_id, function (status, data) {
    //let token = req.headers["x-access-token"];
    res.status(status);
    res.json(data);
  });
}); //Edit contract

app.put("/api/event/:event_id/contract", function (req, res) {//dao.updateCONTRACT()
}); //Get all tickets for an event

app.get("/api/event/:event_id/tickets", function (req, res) {
  console.log("Fikk request fra klienten");
  eventDao.getEventTickets(req.params.event_id, function (status, data) {
    res.status(status);
    res.json(data);
  });
}); //Get all riders for each artist in a specific event

app.get("/api/event/:event_id/raider", function (req, res) {
  console.log("Fikk request fra klienten"); //jwt .verify => if decoded username = arrangør => get all
  //else get 1 

  eventDao.getAllRaiders(req.params.event_id, function (status, data) {
    res.status(status);
    res.json(data);
  });
}); //Get all raiders for one user

app.get("/user/event/:event_id/:performance_id", function (req, res) {
  console.log("/user/:user_id/:active: fikk request fra klient");
  eventDao.getRiders({
    performanceId: req.params.perfromanceId
  }, function (status, data) {
    res.status(status);
    res.json(data);
  });
}); //By request of a new password
//generate new password and send it via email

app.put("/user/:usermail", function (req, res) {
  userDao.getUser(req.params.usermail, function (status, data) {
    if (data.length > 0) {
      var password = _generatePassword["default"].generate({
        length: 12,
        numbers: true
      }); //#TODO


      userDao.updateOne({
        epost: _generatePassword["default"].generate(password),
        email: data.email
      }, function (stat, dat) {
        var mailOptions = {
          from: 'noreply.harmoni.123@gmail.com',
          to: data.epost,
          subject: 'New Password',
          text: "Her er ditt nye passord: \n".concat(password)
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

app.post("/login", function (req, res) {
  var log = loginOk(req.body.email, req.body.password);

  if (log > 0) {
    console.log("username & passord ok");

    var token = _jsonwebtoken["default"].sign({
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
    userDao.getPassword(email, function (status, data) {
      var hashPW = _crypto["default"].createHmac('sha512', data[0].salt);

      var pass = pw;
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
console.log("running");