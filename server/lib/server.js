"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.thisFunctionCreatesNewToken = thisFunctionCreatesNewToken;
exports.userDao = exports.eventDao = void 0;

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

var _upload = _interopRequireDefault(require("./upload"));

var _discordBot = _interopRequireDefault(require("./discord-bot"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var fs = require('fs');

var apiRoutes = _express["default"].Router();

var app = (0, _express["default"])();
var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};
app.use((0, _cors["default"])(corsOptions));
app.use((0, _cors["default"])(corsOptions));
app.use(_bodyParser["default"].json());

var pool = _mysql["default"].createPool({
  connectionLimit: 2,
  host: "mysql.stud.iie.ntnu.no",
  user: "kwgulake",
  password: "qra2ZQqh",
  database: "kwgulake",
  multipleStatements: true
});

pool.on('error', function (req, res) {
  return res.status(500).json({
    error: "internal server error"
  });
});

var transporter = _nodemailer["default"].createTransport({
  service: 'gmail',
  auth: {
    user: 'noreply.harmoni.123@gmail.com',
    pass: 'qra2ZQqh'
  }
});

var eventDao = new _eventDao["default"](pool);
exports.eventDao = eventDao;
var userDao = new _userDao["default"](pool);
exports.userDao = userDao;
var uploader = new _upload["default"]();
var publicKey;
var privateKey = publicKey = "arbeiderklassenrusteropptilvepnetrevolusjon"; // middleware-functions

app.use("/api", function (req, res, next) {
  var token = req.headers["x-access-token"];
  if (token == undefined) return res.status(400).json({
    error: "missing access token header"
  });

  _jsonwebtoken["default"].verify(token, publicKey, function (err, decoded) {
    if (err) {
      console.log("Token IKKE ok");
      res.status(401).json({
        error: "Not authorized -> Token Expired"
      });
    } else {
      req.email = decoded.email;
      req.userId = decoded.userId;
      console.log(req.userId + "har gjort en request");
      next();
    }

    ;
  });
}); // Handles login and returns JWT-token as JSON

app.post("/login", function (req, res) {
  console.log(req.body.email + " trying to log in");
  if (req.body.email == undefined) return res.status(400).json({
    error: "bad request : missing email parameter"
  });else if (req.body.password == undefined) return res.status(400).json({
    error: " bad request : mssing password parameter"
  });else if (!sjekkMail(req.body.email)) return res.status(400).json({
    error: "parameter email is not a valid email"
  });
  userDao.getPassword(req.body.email, function (status, data) {
    if (data[0] == undefined) return res.status(401).json({
      error: "wrong email"
    });

    var hashPW = _crypto["default"].createHmac('sha512', data[0].salt);

    var pass = req.body.password;
    hashPW.update(pass);
    pass = hashPW.digest('hex');
    var login = data[0].user_id;

    if (data.length > 1) {
      if (pass.toUpperCase() === data[0].password_hex.toString() || pass.toUpperCase() === data[1].password_hex.toString()) {
        console.log("User ID:", login);
        console.log("username & passord ok");

        var token = _jsonwebtoken["default"].sign({
          email: req.body.email,
          userId: login
        }, privateKey, {
          expiresIn: 50000
        });

        return res.json({
          jwt: token,
          userId: login
        });
      }

      return res.status(401).json({
        error: "wrong password"
      });
    } else {
      if (data[0] === undefined) return res.json('user undefined');

      if (pass.toUpperCase() === data[0].password_hex.toString()) {
        console.log("User ID:", login);
        console.log("username & passord ok");

        var _token = _jsonwebtoken["default"].sign({
          email: req.body.email,
          userId: login
        }, privateKey, {
          expiresIn: 50000
        });

        return res.json({
          jwt: _token,
          userId: login
        });
      }
    }

    return res.status(401).json({
      error: "wrong password"
    });
  });
});

function thisFunctionCreatesNewToken(passedMail, userId) {
  var newToken = _jsonwebtoken["default"].sign({
    email: passedMail,
    userId: userId
  }, privateKey, {
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


app.get("/api/user/:id", function (req, res) {
  console.log("/user/".concat(req.params.id, " fikk request fra klient"));
  if (numberError([req.params.id])) return res.status(400).json({
    error: "parameter user_id must be a number"
  });
  userDao.getUser(req.params.id, function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email, req.userId);
    res.json({
      data: data,
      jwt: token
    });
  });
}); //Get one event

app.get("/api/event/:event_id", function (req, res) {
  console.log("/event/:event_id fikk request fra klient");
  if (numberError([req.params.event_id])) return res.status(400).json({
    error: "url parameter event_id must be a number"
  });
  eventDao.getEvent(req.params.event_id, function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email, req.userId);
    res.json({
      data: data,
      jwt: token
    });
  });
}); //Get all users

app.get("/api/users", function (req, res) {
  console.log("/user: fikk request fra klient");
  userDao.getAllUsers(function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email, req.userId);
    res.json({
      data: data,
      jwt: token
    });
  });
}); //Get all events

app.get("/api/events", function (req, res) {
  console.log("/user: fikk request fra klient");
  eventDao.getAllEvents(function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email, req.userId);
    res.json({
      data: data,
      jwt: token
    });
  });
}); //Get all performances for an event

app.get("/api/event/:event_id/performances", function (req, res) {
  console.log("Fikk request fra klienten");
  if (numberError([req.params.event_id])) return res.status(400).json({
    error: "parameter event_id must be a number"
  });
  eventDao.getEvent(req.params.event_id, function (status, data) {
    if (data[0].host_id == req.user_id) {
      eventDao.getEventPerformancesHost(req.userId, function (status, data) {
        res.status(status);
        var token = thisFunctionCreatesNewToken(req.email, req.userId);
        res.json({
          data: data,
          jwt: token
        });
      });
    } else {
      eventDao.getEventPerformancesArtist({
        eventId: req.params.event_id,
        userId: req.userId
      }, function (status, data) {
        res.status(status);
        var token = thisFunctionCreatesNewToken(req.email, req.userId);
        res.json({
          data: data,
          jwt: token
        });
      });
    }
  });
}); //Get all tickets for an event

app.get("/api/event/:event_id/tickets", function (req, res) {
  console.log("Fikk request fra klienten");
  if (numberError([req.params.event_id])) return res.status(400).json({
    error: "url parameter event_id must be a number"
  });
  eventDao.getTickets(req.params.event_id, function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email, req.userId);
    res.json({
      data: data,
      jwt: token
    });
  });
}); //Get all raiders for one user

app.get("/api/user/event/:event_id/:performance_id", function (req, res) {
  console.log("/user/:user_id/:active: fikk request fra klient");
  if (numberError([req.params.performance_id])) return res.status(400).json({
    error: "number field cannot be string"
  });
  eventDao.getRiders(req.params.performanceId, function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email, req.userId);
    res.json({
      data: data,
      jwt: token
    });
  });
}); //get all active/archived events for user

app.get("/api/user/:user_id/event/:active", function (req, res) {
  console.log("fikk request get fra klient");
  if (numberError([req.params.user_id, req.params.active])) return res.status(400).json({
    error: "number field cannot be string"
  });
  eventDao.getUsersEvents({
    userId: req.params.user_id,
    active: req.params.active
  }, function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email, req.userId);
    res.json({
      data: data,
      jwt: token
    });
  });
}); //get crew given in a specific event

app.get('/api/event/:event_id/crew', function (req, res) {
  console.log('Fikk get-request fra klient');
  if (numberError([req.params.event_id])) return res.status(400).json({
    error: "number field cannot be string"
  });
  eventDao.getCrew(req.params.event_id, function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email, req.userId);
    res.json({
      data: data,
      jwt: token
    });
  });
});
/*
*
*   DELETE METHODS
*
*/
//Delete rider

app["delete"]('/api/performance/:performance_id/rider', function (req, res) {
  console.log("Fikk DELETE-request fra klienten");
  if (numberError([req.params.performance_id])) return res.status(400).json({
    error: "number field cannot be string"
  });
  if (req.body.name == undefined) return res.status(400).json({
    error: "bad request missing body-parameter name"
  });
  eventDao.deleteRider({
    performanceId: req.params.performance_id,
    name: req.body.name
  }, function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email, req.userId);
    res.json({
      data: data,
      jwt: token
    });
  });
}); //Delete ticket

app["delete"]("/api/event/:event_id/ticket", function (req, res) {
  console.log("Fikk Delete-request fra klient");
  if (numberError([req.params.event_id])) return res.status(400).json({
    error: "url parameter event_id must be number"
  });
  if (req.body.name == undefined) return res.status(400).json({
    error: "bad request missing body-parameter name"
  });
  eventDao.deleteTicket({
    eventId: req.params.event_id,
    name: req.body.name
  }, function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email, req.userId);
    res.json({
      data: data,
      jwt: token
    });
  });
}); //Delete performance

app["delete"]("/api/performance/:performance_id", function (req, res) {
  console.log("Fikk DELETE-request fra klienten");
  if (numberError([req.params.performance_id])) return res.status(400).json({
    error: "url parameter performance_id must be a number"
  });
  eventDao.deletePerformance(req.params.performance_id, function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email, req.userId);
    res.json({
      data: data,
      jwt: token
    });
  });
}); //Delete a user

app["delete"]("/api/user/:user_id", function (req, res) {
  console.log("Fikk DELETE-request fra klienten");
  if (numberError([req.params.user_id])) return res.status(400).json({
    error: "url parameter user_id must be a number"
  });else if (req.body.password == undefined) return res.status(400).json({
    error: "request missing password"
  });
  userDao.getPassword(req.params.email, function (status, data) {
    var pw = req.body.password;

    var hashPW = _crypto["default"].createHmac('sha512', data[0].salt);

    var pass = pw;
    hashPW.update(pass);
    pass = hashPW.digest('hex');

    if (data.length === 2) {
      if (data[0].password_hex.toString() === pass.toUpperCase() || data[1].password_hex.toString() === pass.toUpperCase()) {
        userDao.deleteUser(req.params.user_id, function (st, dt) {
          res.status(st);
          return res.json(dt);
        });
      }

      return res.json(401).json({
        error: "Wrong password"
      });
    } else {
      if (data[0].password_hex.toString() === pass.toUpperCase()) {
        userDao.deleteUser(req.params.user_id, function (st, dt) {
          res.status(st);
          return res.json(dt);
        });
      }

      return res.json(401).json({
        error: "Wrong password"
      });
    }
  });
}); //Delete an event

app["delete"]("/api/event/:event_id", function (req, res) {
  console.log("Fikk DELETE-request fra klienten");
  if (numberError([req.params.event_id])) return res.status(400).json({
    error: "url parameter event_id must be a number"
  });
  eventDao.getEvent(req.params.event_id, function (status, data) {
    if (data[0].user_id === req.userId) {
      eventDao.deleteEvent(req.params.event_id, function (status, data) {
        res.status(status);
        var token = thisFunctionCreatesNewToken(req.email, req.userId);
        res.json({
          data: data,
          jwt: token
        });
      });
    } else res.status(401).json({
      error: "not authorized"
    });
  });
});
/*
*
*   UPDATE - METHODS
*
*/
//Update a user

app.put("/api/user/:user_id", function (req, res) {
  console.log("Fikk PUT-request fra klienten");
  if (numberError([req.params.user_id, req.body.phone])) return res.status(400).json({
    error: "number field cannot be a string"
  });else if (req.userId != req.params.user_id) return res.status(401).json({
    error: "Cannot edit other users"
  });else if (req.body.username == undefined) res.status(400).json({
    error: "Missing parameter username"
  });else if (req.body.email == undefined) return res.status(400).json({
    error: "Missing parameter email"
  });else if (req.body.phone == undefined) return res.status(400).json({
    error: "Missing parameter phone"
  });else if (req.body.firstName == undefined) return res.status(400).json({
    error: "Missing parameter firstName"
  });else if (req.body.lastName == undefined) return res.status(400).json({
    error: "Missing parameter lastName"
  });else if (!sjekkMail(req.body.email)) return res.status(400).json({
    error: "inc mail is not valid"
  });
  userDao.updateUser({
    username: req.body.username,
    email: req.body.email,
    phone: req.body.phone,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    userId: req.params.user_id
  }, function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email, req.userId);
    res.json({
      data: data,
      jwt: token
    });
  });
}); //Update crew

app.put('/api/event/:event_id/crew/:crew_id', function (req, res) {
  console.log('fikk put-request fra klient');
  if (req.body.profession == undefined) return res.status(400).json({
    error: "parameter profession undefined"
  });else if (req.body.name == undefined) return res.status(400).json({
    error: "parameter name undefined"
  });else if (req.body.contactInfo == undefined) return res.status(400).json({
    error: "parameter contactInfo undefined"
  });else if (numberError([req.params.event_id, req.params.crew_id])) return res.status(400).json({
    error: "Number field cannot be string"
  });
  eventDao.updateCrew({
    profession: req.body.profession,
    name: req.body.name,
    contactInfo: req.body.contactInfo,
    crewId: req.params.crew_id
  }, function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email, req.userId);
    res.json({
      data: data,
      jwt: token
    });
  });
}); //Update performance

app.put("/api/performance/:performance_id", function (req, res) {
  console.log("Fikk PUT-request fra klienten");
  if (req.body.startTime == undefined) return res.status(400).json({
    error: "bad request"
  });else if (req.body.endTime == undefined) return res.status(400).json({
    error: "request missing end-time parameter"
  });else if (numberError([req.params.performance_id])) return res.status(400).json({
    error: "url parameter performance_id must be a number"
  });
  if (req.body.contract == undefined) req.body.contract = "";
  eventDao.updatePerformance({
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    name: req.body.name,
    contract: req.body.contract,
    performanceId: req.params.performance_id
  }, function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email, req.userId);
    res.json({
      data: data,
      jwt: token
    });
  });
}); //Update ticket

app.put("/api/event/:event_id/ticket", function (req, res) {
  console.log("Fikk PUT-request fra klienten");
  if (req.body.price == undefined) return res.status(400).json({
    error: "request missing ticket - price"
  });else if (req.body.amount == undefined) return res.status(400).json({
    error: "request missing number of tickets"
  });else if (req.body.name == undefined) return res.status(400).json({
    error: "request missing ticket-name"
  });else if (numberError([req.params.event_id, req.body.price, req.body.amount])) return res.status(400).json({
    error: "number field is a string"
  });
  eventDao.updateTicket({
    description: req.body.description,
    name: req.body.name,
    eventId: req.params.event_id,
    price: req.body.price,
    amount: req.body.amount
  }, function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email, req.userId);
    res.json({
      data: data,
      jwt: token
    });
  });
}); //put rider

app.put("/api/performance/:performance_id/rider", function (req, res) {
  console.log("Fikk PUT-request fra klienten");
  if (req.body.name == undefined) return res.status(400).json({
    error: "bad request : missing name"
  });else if (req.body.amount == undefined) return res.status(400).json({
    error: "bad request : missing amount of tickets"
  });else if (req.body.oldName == undefined) return res.status(400).json({
    error: "bad request : missing old name - parameter"
  });else if (numberError([req.params.performance_id])) return res.status(400).json({
    error: "url parameter performance_id must be a number"
  });else if (numberError([req.body.amount])) return res.status(400).json({
    error: "number field is a string"
  });
  eventDao.updateRider({
    name: req.body.name,
    amount: req.body.amount,
    performanceId: req.params.performance_id,
    oldName: req.body.oldName
  }, function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email, req.userId);
    res.json({
      data: data,
      jwt: token
    });
  });
}); //By request of a new password
//generate new password and send it via email

app.put("/user/:usermail", function (req, res) {
  console.log("Fikk PUT-request fra klienten");
  if (!sjekkMail(req.params.usermail)) return res.status(400).json({
    error: "given mail is not a valid mail"
  });
  userDao.getPassword(req.params.usermail, function (status, data) {
    if (data.length === 0) return res.status(400).json({
      errror: "user not found"
    });
    if (data.length > 2) return res.status(501).json({
      errror: "internal server error"
    });
    console.log(data.length);

    var password = _generatePassword["default"].generate({
      length: 12,
      numbers: true
    });

    var pw = password;

    var hashPW = _crypto["default"].createHmac('sha512', data[0].salt);

    hashPW.update(pw);
    pw = hashPW.digest('hex');

    if (data.length === 1) {
      userDao.createPassword({
        userId: data[0].user_id,
        password: pw,
        autogen: 1
      }, function (stat, dat) {
        return sendMail(req, res, password);
      });
    } else {
      if (data[1] === undefined) return res.json('password trouble');
      userDao.updatePassword({
        passId: data[1].password_id,
        password: pw,
        autogen: 1
      }, function (stat, dat) {
        return sendMail(req, res, password);
      });
    }
  });

  function sendMail(req, res, password) {
    var mailOptions = {
      from: 'noreply.harmoni.123@gmail.com',
      to: req.params.usermail,
      subject: 'New Password',
      text: "Her er ditt nye passord:\n".concat(password)
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
}); //Update password

app.put("/api/user/:user_id/password", function (req, res) {
  console.log("Fikk put-request om å oppdatere passord");
  if (numberError([req.params.user_id])) return res.status(400).res.json({
    error: "number field cannot be string"
  });else if (req.params.user_id != req.userId) return res.status(401).json({
    error: "cannot change password of another user"
  });
  userDao.getPassword(req.email, function (status, data) {
    if (data.length > 2) return res.status(500).json({
      error: "token error"
    });
    if (data[0] == undefined) return res.status(401).json({
      error: "wrong email"
    });

    var hashPW = _crypto["default"].createHmac('sha512', data[0].salt);

    var pass = req.body.oldPassword;
    hashPW.update(pass);
    pass = hashPW.digest('hex');

    if (data.length === 2) {
      if (pass.toUpperCase() !== data[0].password_hex.toString() && pass.toUpperCase() !== data[1].password_hex.toString()) {
        return res.status(401).json({
          error: "wrong password"
        });
      }
    } else if (pass.toUpperCase() !== data[0].password_hex.toString()) return res.status(401).json({
      error: "wrong password"
    });

    var hashpw2 = _crypto["default"].createHmac('sha512', data[0].salt);

    var pw = req.body.newPassword;
    hashpw2.update(pw);
    pw = hashpw2.digest('hex');
    userDao.setPassword({
      userId: req.userId,
      password: pw
    }, function (status, data) {
      res.status(status);
      var token = thisFunctionCreatesNewToken(req.mail, req.userId);
      res.json({
        data: data,
        jwt: token
      });
    });
  });
}); //Update an event

app.put("/api/event/:event_id", function (req, res) {
  console.log("Fikk PUT-request fra klienten");
  if (numberError([req.params.event_id])) return res.status(400).json({
    error: "url parameter event_id must be a number"
  });else if (numberError([req.body.active])) return res.status(400).json({
    error: "number field is a string"
  }); //todo check if user is logged in, maybe it does, I don't know
  else if (req.body.eventName == undefined) return res.status(400).json({
      error: "bad request : missing eventName parameter"
    });else if (req.body.startTime == undefined) return res.status(400).json({
      error: "bad request : missing startTime parameter"
    });else if (req.body.location == undefined) return res.status(400).json({
      error: "bad request : missing location parameter"
    });else if (req.body.longitude == undefined) return res.status(400).json({
      error: "bad request : missing longitude parameter"
    });else if (req.body.latitude == undefined) return res.status(400).json({
      error: "bad request : missing latitude parameter"
    });
  if (req.body.active == undefined) req.body.active = 1;
  var description = req.body.description;
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
  }, function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email, req.userId);
    res.json({
      data: data,
      jwt: token
    });
  });
});
/*
*
*           POST - METHODS
*
*/
//post a user

app.post("/user", function (req, res) {
  console.log("Fikk POST-request fra klienten");
  if (req.body.username == undefined) return res.status(400).json({
    error: "request missing username"
  });else if (req.body.password == undefined) return res.status(400).json({
    error: "request missing password"
  });else if (req.body.email == undefined) return res.status(400).json({
    error: "request missing email"
  });else if (req.body.firstName == undefined) return res.status(400).json({
    error: "request missing first name"
  });else if (req.body.lastName == undefined) return res.status(400).json({
    error: "request missing last name"
  });else if (req.body.phone == undefined) return res.status(400).json({
    error: "request missing phone"
  });else if (!sjekkMail(req.body.email)) return res.status(400).json({
    error: "parameter email is not a valid email"
  });else if (numberError([req.body.phone])) return res.status(400).json({
    error: "number field is a string"
  });
  userDao.checkCred({
    username: req.body.username,
    email: req.body.email
  }, function (status, data) {
    if (data.length > 0) {
      if (data[0].username === req.body.username && data[0].email === req.body.email) return res.status(409).json({
        error: "mail and username"
      });else if (data[0].username === req.body.username) return res.status(409).json({
        error: "username"
      });else return res.status(409).json({
        error: "mail"
      });
    }

    var user = req.body;

    var salt = _crypto["default"].randomBytes(16).toString('hex').slice(0, 16).toUpperCase();

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
      var token = thisFunctionCreatesNewToken(user.mail, 0);
      res.status(status).json({
        data: data,
        jwt: token
      });
    });
  });
}); //post an event

app.post("/api/event", function (req, res) {
  console.log("Fikk POST-request fra klienten");
  if (numberError([req.body.active])) return res.status(400).json({
    error: "number field is a string"
  });else if (req.body.eventName == undefined) return res.status(400).json({
    error: "bad request : missing eventName parameter"
  });else if (req.body.startTime == undefined) return res.status(400).json({
    error: "bad request : missing startTime parameter"
  });else if (req.body.userId == undefined) return res.status(400).json({
    error: "bad request : missing userId parameter"
  });else if (req.body.location == undefined) return res.status(400).json({
    error: "bad request : missing location parameter"
  });else if (req.body.longitude == undefined) return res.status(400).json({
    error: "bad request : missing longitude parameter"
  });else if (req.body.latitude == undefined) return res.status(400).json({
    error: "bad request : missing latitude parameter"
  });
  eventDao.createEvent({
    eventName: req.body.eventName,
    userId: req.body.userId,
    location: req.body.location,
    longitude: req.body.longitude,
    latitude: req.body.latitude,
    description: req.body.description,
    startTime: req.body.startTime,
    endTime: req.body.endTime
  }, function (status, data) {
    res.status(status);
    data.jwt = thisFunctionCreatesNewToken(req.email, req.userId);
    res.send(data);
  });
}); //post a ticket

app.post("/api/event/:event_id/ticket", function (req, res) {
  console.log("Fikk POST-request fra klienten");
  if (req.body.name == undefined) return res.status(400).json({
    error: "post-request missing ticket name"
  });else if (req.body.price == undefined) return res.status(400).json({
    error: "post-request ticket missing ticket-price"
  });else if (req.body.amount == undefined) return res.status(400).json({
    error: "post request missing number of tickets"
  });else if (numberError([req.params.event_id, req.body.price, req.body.amount])) return res.status(400).json({
    error: "number field is a string"
  });
  eventDao.createTicket({
    description: req.body.description,
    name: req.body.name,
    eventId: req.params.event_id,
    price: req.body.price,
    amount: req.body.amount
  }, function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email, req.userId);
    res.json({
      data: data,
      jwt: token
    });
  });
}); //post a performance

app.post("/api/event/:event_id/performance", function (req, res) {
  console.log("Fikk POST-request fra klienten");
  if (req.body.userId == undefined) return res.status(400).json({
    error: "bad request : missing artist parameter"
  });else if (req.body.startTime == undefined) return res.status(400).json({
    error: "bad requst : missing startTime parameter"
  });else if (req.body.endTime == undefined) return res.status(400).json({
    error: "bad request : missing endTime parameter"
  });else if (numberError([req.params.event_id])) return res.status(400).json({
    error: "url parameter event_id must be a number"
  });else if (numberError([req.body.userId])) return res.status(400).json({
    error: "number field is a string"
  });
  if (req.body.contract == undefined) req.body.contract = "";
  eventDao.createPerformance({
    artistId: req.body.userId,
    eventId: req.params.event_id,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    name: req.body.name,
    contract: req.body.contract
  }, function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email, req.userId);
    res.json({
      data: data,
      jwt: token
    });
  });
}); //post a rider

app.post("/api/performance/:performance_id/rider", function (req, res) {
  console.log("Fikk POST-request fra klienten");
  if (req.body.amount == undefined) return res.json({
    error: "bad request : missing amount parameter"
  });else if (numberError([req.params.performance_id])) return res.status(400).json({
    error: "paramenter performance_id must be a number"
  });else if (numberError([req.body.amount])) return res.status(400).json({
    error: "number field is a string"
  });
  eventDao.createRider({
    performanceId: req.params.performance_id,
    name: req.body.name,
    amount: req.body.amount
  }, function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email, req.userId);
    res.json({
      data: data,
      jwt: token
    });
  });
}); // post new crew

app.post('/api/event/:event_id/crew', function (req, res) {
  console.log('fikk post-request fra klient');
  if (numberError([req.params.event_id])) res.status(400).json({
    error: "url parameter event_id must be a number"
  });else if (req.body.profession == undefined) return res.status(400).json({
    error: "parameter profession undefined"
  });else if (req.body.name == undefined) return res.status(400).json({
    error: "parameter name undefined"
  });else if (req.body.contactInfo == undefined) return res.status(400).json({
    error: "parameter contactInfo undefined"
  });
  eventDao.createCrew({
    profession: req.body.profession,
    name: req.body.name,
    contactInfo: req.body.contactInfo,
    eventId: req.params.event_id
  }, function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email, req.userId);
    res.json({
      data: data,
      jwt: token
    });
  });
}); // put contract

app.put('/api/event/:event_id/performance/:performance_id/contract', uploader.uploadContract); // get contract

app.get('/api/event/:event_id/performance/:performance_id/contract', function (req, res) {
  console.log('Fikk get-request fra klient');
  eventDao.downloadContract(req.params.performance_id, function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email, req.userId);
    if (data[0] == undefined) return res.json({
      data: "No contract exists",
      jwt: token
    });
    res.json({
      data: data[0].contract,
      jwt: token
    });
  });
}); // put event picture

app.put('/api/event/:event_id/picture', uploader.uploadEventPicture); // get event picture

app.get('/api/event/:event_id/picture', function (req, res) {
  console.log('Fikk get-request fra klient');
  eventDao.downloadPicture(req.params.event_id, function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email, req.userId);
    if (data[0] == undefined) return res.json({
      data: "No picture exists",
      jwt: token
    });
    res.json({
      data: data[0].picture,
      jwt: token
    });
  });
}); // put user picture

app.put('/api/user/:user_id/picture', uploader.uploadUserPicture); // get user picture

app.get('/api/user/:user_id/picture', function (req, res) {
  console.log('Fikk get-request fra klient');
  userDao.downloadPicture(req.params.user_id, function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email, req.userId);
    if (data[0] == undefined) return res.json({
      data: "No picture exists",
      jwt: token
    });
    res.json({
      data: data[0].picture,
      jwt: token
    });
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

function numberError(nums) {
  for (var i = 0; i < nums.length; i++) {
    if (isNaN(nums[i])) return true;

    if (typeof nums[i] === 'string') {
      if (nums[i].trim() === '') return true;
    }
  }

  return false;
}

function sjekkMail(inc) {
  var re = /\S+@\S+\.\S+/;
  return re.test(inc);
}

var server = app.listen(8080);
console.log("running"); //
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