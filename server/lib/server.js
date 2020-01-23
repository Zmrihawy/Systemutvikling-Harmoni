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
app.use(_bodyParser["default"].json()); //Creates connection pool with two connections

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
var privateKey = publicKey = "arbeiderklassenrusteropptilvepnetrevolusjon";
app.use("/api", function (req, res, next) {
  var token = req.headers["x-access-token"];

  if (token == undefined) {
    console.log('request has no token');
    return res.status(400).json({
      error: "missing access token header"
    });
  }

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
  });
}); // Handles login and returns JWT-token as JSON

app.post("/login", function (req, res) {
  console.log(req.body.email + " trying to log in");
  if (req.body.email == undefined) return res.status(400).json({
    error: "bad request : missing email parameter"
  });else if (req.body.password == undefined) return res.status(400).json({
    error: " bad request : missing password parameter"
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
          expiresIn: 1800
        });

        return res.json({
          jwt: token,
          userId: login,
          artist: data[0].artist
        });
      }

      return res.status(401).json({
        error: "wrong password"
      });
    } else {
      if (pass.toUpperCase() === data[0].password_hex.toString()) {
        console.log("User ID:", login);
        console.log("username & passord ok");

        var _token = thisFunctionCreatesNewToken(req.body.email, login);

        return res.json({
          jwt: _token,
          userId: login,
          artist: data[0].artist
        });
      }
    }

    return res.status(401).json({
      error: "wrong password"
    });
  });
});
/**
 * This function creates new token
 */

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
  var token = thisFunctionCreatesNewToken(req.email, req.userId);
  if (numberError([req.params.id])) return res.status(400).json({
    jwt: token,
    error: "parameter user_id must be a number"
  });
  userDao.getUser(req.params.id, function (status, data) {
    res.status(status);
    res.json({
      data: data,
      jwt: token
    });
  });
}); //Get one event

app.get("/api/event/:event_id", function (req, res) {
  console.log("/event/:event_id fikk request fra klient");
  var token = thisFunctionCreatesNewToken(req.email, req.userId);
  if (numberError([req.params.event_id])) return res.status(400).json({
    jwt: token,
    error: "url parameter event_id must be a number"
  });
  eventDao.getEventParticipants(req.params.event_id, function (status, data) {
    if (checkEventAccess(data, req.userId)) {
      eventDao.getEvent(req.params.event_id, function (status, data) {
        res.status(status).json({
          data: data,
          jwt: token
        });
      });
    } else {
      res.status(403).json({
        jwt: token,
        error: "Not authorized to access this information"
      });
    }
  });
}); //Get all artists

app.get("/api/user", function (req, res) {
  console.log("/user: fikk request fra klient");
  var token = thisFunctionCreatesNewToken(req.email, req.userId);
  userDao.getAllArtists(function (status, data) {
    res.status(status);
    res.json({
      data: data,
      jwt: token
    });
  });
}); //Get all performances for an event

app.get("/api/event/:event_id/performance", function (req, res) {
  console.log("Fikk request fra klienten");
  var token = thisFunctionCreatesNewToken(req.email, req.userId);
  if (numberError([req.params.event_id])) return res.status(400).json({
    jwt: token,
    error: "parameter event_id must be a number"
  });
  eventDao.getEventParticipants(req.params.event_id, function (status, data) {
    if (checkEventAccess(data, req.userId)) {
      eventDao.getEventPerformances(req.params.event_id, function (status, data) {
        res.status(status).json({
          data: data,
          jwt: token
        });
      });
    } else {
      res.status(403).json({
        jwt: token,
        error: "Not authorized to access this information"
      });
    }
  });
}); //Get all tickets for an event

app.get("/api/event/:event_id/ticket", function (req, res) {
  console.log("Fikk request fra klienten");
  var token = thisFunctionCreatesNewToken(req.email, req.userId);
  if (numberError([req.params.event_id])) return res.status(400).json({
    jwt: token,
    error: "url parameter event_id must be a number"
  });
  eventDao.getEventParticipants(req.params.event_id, function (status, data) {
    if (checkEventAccess(data, req.userId)) {
      eventDao.getTickets(req.params.event_id, function (status, data) {
        res.status(status).json({
          data: data,
          jwt: token
        });
      });
    } else {
      res.status(403).json({
        jwt: token,
        error: "Not authorized to access this information"
      });
    }
  });
}); //Get all raiders for one user

app.get("/api/event/:event_id/performance/:performance_id", function (req, res) {
  console.log("/user/:user_id/:active: fikk request fra klient");
  var token = thisFunctionCreatesNewToken(req.email, req.userId);
  if (numberError([req.params.performance_id])) return res.status(400).json({
    jwt: token,
    error: "number field cannot be string"
  });
  eventDao.getEventParticipants(req.params.event_id, function (status, data) {
    if (checkEventAccess(data, req.userId)) {
      eventDao.getRiders(req.params.performance_id, function (status, data) {
        res.status(status).json({
          data: data,
          jwt: token
        });
      });
    } else {
      res.status(403).json({
        jwt: token,
        error: "Not authorized to access this information"
      });
    }
  });
}); //get all active/archived events for user

app.get("/api/user/:user_id/event/:active", function (req, res) {
  console.log("fikk request get fra klient");
  var token = thisFunctionCreatesNewToken(req.email, req.userId);
  if (numberError([req.params.user_id, req.params.active])) return res.status(400).json({
    jwt: token,
    error: "number field cannot be string"
  });else if (req.params.user_id != req.userId) return res.status(401).json({
    jwt: token,
    error: 'You are not authorized'
  });
  eventDao.getUserEvents({
    userId: req.params.user_id,
    active: req.params.active
  }, function (status, data) {
    res.status(status).json({
      data: data,
      jwt: token
    });
  });
}); //get crew given in a specific event

app.get('/api/event/:event_id/crew', function (req, res) {
  console.log('Fikk get-request fra klient');
  var token = thisFunctionCreatesNewToken(req.email, req.userId);
  if (numberError([req.params.event_id])) return res.status(400).json({
    jwt: token,
    error: "number field cannot be string"
  });
  eventDao.getEventParticipants(req.params.event_id, function (status, data) {
    if (checkEventAccess(data, req.userId)) {
      eventDao.getCrew(req.params.event_id, function (status, data) {
        res.status(status).json({
          data: data,
          jwt: token
        });
      });
    } else {
      res.status(403).json({
        jwt: token,
        error: "Not authorized to access this information"
      });
    }
  });
});
/**
 * This function checks if a specific user has access to a specitic event
 */

function checkEventAccess(data, userId) {
  if (data[0].host_id == userId) return true;else {
    for (var i = 0; i < data.length; i++) {
      if (data[i].user_id == userId) return true;
    }
  }
  return false;
}
/*
*
*   DELETE METHODS
*
*/
//Delete rider


app["delete"]('/api/event/:event_id/performance/:performance_id/rider', function (req, res) {
  console.log("Fikk DELETE-request fra klienten");
  var token = thisFunctionCreatesNewToken(req.email, req.userId);
  if (numberError([req.params.performance_id])) return res.status(400).json({
    jwt: token,
    error: "number field cannot be string"
  });
  if (req.body.name == undefined) return res.status(400).json({
    jwt: token,
    error: "bad request missing body-parameter name"
  });
  eventDao.getEventParticipants(req.params.event_id, function (status, data) {
    if (data[0].host_id == req.userId) {
      eventDao.deleteRider({
        performanceId: req.params.performance_id,
        name: req.body.name
      }, function (status, data) {
        res.status(status).json({
          data: data,
          jwt: token
        });
      });
    } else {
      res.status(403).json({
        jwt: token,
        error: "Not authorized to access this information"
      });
    }
  });
}); //Delete ticket

app["delete"]("/api/event/:event_id/ticket", function (req, res) {
  console.log("Fikk Delete-request fra klient");
  var token = thisFunctionCreatesNewToken(req.email, req.userId);
  if (numberError([req.params.event_id])) return res.status(400).json({
    jwt: token,
    error: "url parameter event_id must be number"
  });
  if (req.body.name == undefined) return res.status(400).json({
    jwt: token,
    error: "bad request missing body-parameter name"
  });
  eventDao.getEventParticipants(req.params.event_id, function (status, data) {
    if (data[0].host_id == req.userId) {
      eventDao.deleteTicket({
        eventId: req.params.event_id,
        name: req.body.name
      }, function (status, data) {
        res.status(status).json({
          data: data,
          jwt: token
        });
      });
    } else {
      res.status(403).json({
        jwt: token,
        error: "Not authorized to access this information"
      });
    }
  });
}); //Delete performance

app["delete"]("/api/event/:event_id/performance/:performance_id", function (req, res) {
  console.log("Fikk DELETE-request fra klienten");
  var token = thisFunctionCreatesNewToken(req.email, req.userId);
  if (numberError([req.params.performance_id])) return res.status(400).json({
    jwt: token,
    error: "url parameter performance_id must be a number"
  });
  eventDao.getEventParticipants(req.params.event_id, function (status, data) {
    if (data[0].host_id == req.userId) {
      eventDao.deletePerformance(req.params.performance_id, function (status, data) {
        res.status(status).json({
          data: data,
          jwt: token
        });
      });
    } else {
      res.status(403).json({
        jwt: token,
        error: "Not authorized to access this information"
      });
    }
  });
}); //Delete a user

app["delete"]("/api/user/:user_id", function (req, res) {
  console.log("Fikk DELETE-request fra klienten");
  if (numberError([req.params.user_id])) return res.status(400).json({
    error: "url parameter user_id must be a number"
  });else if (req.body.password == undefined) return res.status(400).json({
    error: "request missing password"
  });else if (req.params.user_id != req.userId) return res.status(403).json({
    error: "not your user"
  });
  userDao.getPassword(req.email, function (status, data) {
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
      } else {
        return res.json(403).json({
          error: "Wrong password"
        });
      }
    } else {
      if (data[0].password_hex.toString() === pass.toUpperCase()) {
        userDao.deleteUser(req.params.user_id, function (st, dt) {
          res.status(st);
          return res.json(dt);
        });
      } else {
        return res.json(403).json({
          error: "Wrong password"
        });
      }
    }
  });
}); //Delete an event

app["delete"]("/api/event/:event_id", function (req, res) {
  console.log("Fikk DELETE-request fra klienten");
  var token = thisFunctionCreatesNewToken(req.email, req.userId);
  if (numberError([req.params.event_id])) return res.status(400).json({
    jwt: token,
    error: "url parameter event_id must be a number"
  });
  eventDao.getEventParticipants(req.params.event_id, function (status, data) {
    if (data[0].host_id == req.userId) {
      eventDao.deleteEvent(req.params.event_id, function (status, data) {
        res.status(status).json({
          data: data,
          jwt: token
        });
      });
    } else {
      res.status(403).json({
        jwt: token,
        error: "Not authorized to access this information"
      });
    }
  });
}); //Delete a crew member 

app["delete"]("/api/event/:event_id/crew", function (req, res) {
  console.log("Fikk DELETE-request fra klienten");
  var token = thisFunctionCreatesNewToken(req.email, req.userId);
  if (numberError[(req.params.event_id, req.body.crewId)]) return res.status(400).json({
    jwt: token,
    error: "url parameters must be a number"
  });
  eventDao.getEventParticipants(req.params.event_id, function (status, data) {
    if (data[0].host_id == req.userId) {
      eventDao.deleteCrew(req.body.crewId, function (status, data) {
        res.status(status).json({
          data: data,
          jwt: token
        });
      });
    } else {
      res.status(403).json({
        jwt: token,
        error: "Not authorized to access this information"
      });
    }
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
  var token = thisFunctionCreatesNewToken(req.email, req.userId);
  if (numberError([req.params.user_id, req.body.phone])) return res.status(400).json({
    jwt: token,
    error: "number field cannot be a string"
  });else if (req.userId != req.params.user_id) return res.status(401).json({
    jwt: token,
    error: "Cannot edit other users"
  });else if (req.body.username == undefined) return res.status(400).json({
    jwt: token,
    error: "Missing parameter username"
  });else if (req.body.email == undefined) return res.status(400).json({
    jwt: token,
    error: "Missing parameter email"
  });else if (req.body.phone == undefined) return res.status(400).json({
    jwt: token,
    error: "Missing parameter phone"
  });else if (req.body.firstName == undefined) return res.status(400).json({
    jwt: token,
    error: "Missing parameter firstName"
  });else if (req.body.lastName == undefined) return res.status(400).json({
    jwt: token,
    error: "Missing parameter lastName"
  });else if (!sjekkMail(req.body.email)) return res.status(400).json({
    jwt: token,
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
    res.json({
      data: data,
      jwt: token
    });
  });
}); //Update crew

app.put('/api/event/:event_id/crew', function (req, res) {
  console.log('fikk put-request fra klient');
  var token = thisFunctionCreatesNewToken(req.email, req.userId);
  if (req.body.profession == undefined) return res.status(400).json({
    jwt: token,
    error: "parameter profession undefined"
  });else if (req.body.name == undefined) return res.status(400).json({
    jwt: token,
    error: "parameter name undefined"
  });else if (req.body.contactInfo == undefined) return res.status(400).json({
    jwt: token,
    error: "parameter contactInfo undefined"
  });else if (numberError([req.params.event_id, req.body.crewId])) return res.status(400).json({
    jwt: token,
    error: "Number field cannot be string"
  });
  eventDao.getEventParticipants(req.params.event_id, function (status, data) {
    if (data[0].host_id == req.userId) {
      eventDao.updateCrew({
        profession: req.body.profession,
        name: req.body.name,
        contactInfo: req.body.contactInfo,
        crewId: req.body.crewId
      }, function (status, data) {
        res.status(status).json({
          data: data,
          jwt: token
        });
      });
    } else {
      res.status(403).json({
        jwt: token,
        error: "Not authorized to access this information"
      });
    }
  });
}); //Update performance

app.put("/api/event/:event_id/performance/:performance_id", function (req, res) {
  console.log("Fikk PUT-request fra klienten");
  var token = thisFunctionCreatesNewToken(req.email, req.userId);
  if (req.body.startTime == undefined) return res.status(400).json({
    jwt: token,
    error: "bad request"
  });else if (req.body.endTime == undefined) return res.status(400).json({
    jwt: token,
    error: "request missing end-time parameter"
  });else if (numberError([req.params.event_id, req.params.performance_id])) return res.status(400).json({
    jwt: token,
    error: "url parameter performance_id must be a number"
  });
  eventDao.getEventParticipants(req.params.event_id, function (status, data) {
    if (data[0].host_id == req.userId) {
      eventDao.updatePerformance({
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        name: req.body.name,
        performanceId: req.params.performance_id
      }, function (status, data) {
        res.status(status).json({
          data: data,
          jwt: token
        });
      });
    } else {
      res.status(403).json({
        jwt: token,
        error: "Not authorized to access this information"
      });
    }
  });
}); //Update ticket

app.put("/api/event/:event_id/ticket", function (req, res) {
  console.log("Fikk PUT-request fra klienten");
  var token = thisFunctionCreatesNewToken(req.email, req.userId);
  if (req.body.price == undefined) return res.status(400).json({
    jwt: token,
    error: "request missing ticket - price"
  });else if (req.body.amount == undefined) return res.status(400).json({
    jwt: token,
    error: "request missing number of tickets"
  });else if (req.body.name == undefined) return res.status(400).json({
    jwt: token,
    error: "request missing ticket-name"
  });else if (req.body.oldName == undefined) return res.status(400).json({
    jwt: token,
    error: "request missing ticket - old name"
  });else if (numberError([req.params.event_id, req.body.price, req.body.amount])) return res.status(400).json({
    jwt: token,
    error: "number field is a string"
  });
  eventDao.getEventParticipants(req.params.event_id, function (status, data) {
    if (data[0].host_id == req.userId) {
      eventDao.updateTicket({
        name: req.body.name,
        eventId: req.params.event_id,
        price: req.body.price,
        amount: req.body.amount,
        oldName: req.body.oldName
      }, function (status, data) {
        res.status(status).json({
          data: data,
          jwt: token
        });
      });
    } else {
      res.status(403).json({
        jwt: token,
        error: "Not authorized to access this information"
      });
    }
  });
}); //Update rider

app.put("/api/event/:event_id/performance/:performance_id/rider", function (req, res) {
  console.log("Fikk PUT-request fra klienten");
  var token = thisFunctionCreatesNewToken(req.email, req.userId);
  if (req.body.name == undefined) return res.status(400).json({
    jwt: token,
    error: "bad request : missing name"
  });else if (req.body.amount == undefined) return res.status(400).json({
    jwt: token,
    error: "bad request : missing amount of tickets"
  });else if (req.body.oldName == undefined) return res.status(400).json({
    jwt: token,
    error: "bad request : missing old name - parameter"
  });else if (numberError([req.params.event_id])) return res.status(400).json({
    jwt: token,
    error: "url parameter performance_id must be a number"
  });else if (numberError([req.params.performance_id])) return res.status(400).json({
    jwt: token,
    error: "url parameter performance_id must be a number"
  });else if (numberError([req.body.amount])) return res.status(400).json({
    jwt: token,
    error: "number field is a string"
  });else if (req.body.confirmed == undefined) return res.status(400).json({
    jwt: token,
    error: "bad request : missing confirmed - parameter"
  });
  eventDao.getEventParticipants(req.params.event_id, function (status, data) {
    if (data[0].host_id == req.userId) {
      eventDao.updateRider({
        name: req.body.name,
        amount: req.body.amount,
        performanceId: req.params.performance_id,
        confirmed: req.body.confirmed,
        oldName: req.body.oldName
      }, function (status, data) {
        res.status(status).json({
          data: data,
          jwt: token
        });
      });
    } else {
      res.status(403).json({
        jwt: token,
        error: "Not authorized to access this information"
      });
    }
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
  /**
   * This function sends an email
   */

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
  var token = thisFunctionCreatesNewToken(req.mail, req.userId);
  if (numberError([req.params.user_id])) return res.status(400).json({
    jwt: token,
    error: "number field cannot be string"
  });else if (req.params.user_id != req.userId) return res.status(401).json({
    jwt: token,
    error: "cannot change password of another user"
  });
  userDao.getPassword(req.email, function (status, data) {
    if (data.length > 2) return res.status(500).json({
      jwt: token,
      error: "token error"
    });
    if (data[0] == undefined) return res.status(401).json({
      jwt: token,
      error: "wrong email"
    });

    var hashPW = _crypto["default"].createHmac('sha512', data[0].salt);

    var pass = req.body.oldPassword;
    hashPW.update(pass);
    pass = hashPW.digest('hex');

    if (data.length === 2) {
      if (pass.toUpperCase() !== data[0].password_hex.toString() && pass.toUpperCase() !== data[1].password_hex.toString()) {
        return res.status(401).json({
          jwt: token,
          error: "wrong password"
        });
      }
    } else if (pass.toUpperCase() !== data[0].password_hex.toString()) return res.status(401).json({
      jwt: token,
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
      res.json({
        data: data,
        jwt: token
      });
    });
  });
}); //Update an event

app.put("/api/event/:event_id", function (req, res) {
  console.log("Fikk PUT-request fra klienten");
  var token = thisFunctionCreatesNewToken(req.email, req.userId);
  if (numberError([req.params.event_id])) return res.status(400).json({
    jwt: token,
    error: "url parameter event_id must be a number"
  });else if (numberError([req.body.active])) return res.status(400).json({
    jwt: token,
    error: "number field is a string"
  }); //todo check if user is logged in, maybe it does, I don't know
  else if (req.body.eventName == undefined) return res.status(400).json({
      jwt: token,
      error: "bad request : missing eventName parameter"
    });else if (req.body.startTime == undefined) return res.status(400).json({
      jwt: token,
      error: "bad request : missing startTime parameter"
    });else if (req.body.location == undefined) return res.status(400).json({
      jwt: token,
      error: "bad request : missing location parameter"
    });else if (req.body.longitude == undefined) return res.status(400).json({
      jwt: token,
      error: "bad request : missing longitude parameter"
    });else if (req.body.latitude == undefined) return res.status(400).json({
      jwt: token,
      error: "bad request : missing latitude parameter"
    });
  if (req.body.active == undefined) req.body.active = 1;
  var description = req.body.description;
  if (description == undefined) description = "";
  eventDao.getEventParticipants(req.params.event_id, function (status, data) {
    if (data[0].host_id == req.userId) {
      eventDao.updateEvent({
        eventName: req.body.eventName,
        hostId: req.body.userId,
        active: req.body.active,
        location: req.body.location,
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        description: description,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        eventId: req.params.event_id
      }, function (status, data) {
        res.status(status).json({
          data: data,
          jwt: token
        });
      });
    } else {
      res.status(403).json({
        jwt: token,
        error: "Not authorized to access this information"
      });
    }
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
  });else if (req.body.artist == undefined) return res.status(400).json({
    error: "request missing artist"
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
      lastName: user.lastName,
      artist: user.artist
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
  var token = thisFunctionCreatesNewToken(req.email, req.userId);
  if (req.body.eventName == undefined) return res.status(400).json({
    jwt: token,
    error: "bad request : missing eventName parameter"
  });else if (req.body.startTime == undefined) return res.status(400).json({
    jwt: token,
    error: "bad request : missing startTime parameter"
  });else if (req.body.userId == undefined) return res.status(400).json({
    jwt: token,
    error: "bad request : missing userId parameter"
  });else if (req.body.location == undefined) return res.status(400).json({
    jwt: token,
    error: "bad request : missing location parameter"
  });else if (req.body.longitude == undefined) return res.status(400).json({
    jwt: token,
    error: "bad request : missing longitude parameter"
  });else if (req.body.latitude == undefined) return res.status(400).json({
    jwt: token,
    error: "bad request : missing latitude parameter"
  });
  userDao.getUser(req.userId, function (status, data) {
    if (data[0].artist == 0) {
      eventDao.createEvent({
        eventName: req.body.eventName,
        userId: req.body.userId,
        location: req.body.location,
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        description: req.body.description,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        picture: req.body.picture
      }, function (status, data) {
        res.status(status);
        data.jwt = token;
        res.send(data);
      });
    }
  });
}); //post a ticket

app.post("/api/event/:event_id/ticket", function (req, res) {
  console.log("Fikk POST-request fra klienten");
  var token = thisFunctionCreatesNewToken(req.email, req.userId);
  if (req.body.name == undefined) return res.status(400).json({
    jwt: token,
    error: "post-request missing ticket name"
  });else if (req.body.price == undefined) return res.status(400).json({
    jwt: token,
    error: "post-request ticket missing ticket-price"
  });else if (req.body.amount == undefined) return res.status(400).json({
    jwt: token,
    error: "post request missing number of tickets"
  });else if (numberError([req.params.event_id, req.body.price, req.body.amount])) return res.status(400).json({
    jwt: token,
    error: "number field is a string"
  });
  eventDao.getEventParticipants(req.params.event_id, function (status, data) {
    if (data[0].host_id == req.userId) {
      eventDao.createTicket({
        name: req.body.name,
        eventId: req.params.event_id,
        price: req.body.price,
        amount: req.body.amount
      }, function (status, data) {
        res.status(status).json({
          data: data,
          jwt: token
        });
      });
    } else {
      res.status(403).json({
        jwt: token,
        error: "Not authorized to access this information"
      });
    }
  });
}); //post a performance

app.post("/api/event/:event_id/performance", function (req, res) {
  console.log("Fikk POST-request fra klienten");
  var token = thisFunctionCreatesNewToken(req.email, req.userId);
  if (req.body.startTime == undefined) return res.status(400).json({
    jwt: token,
    error: "bad requst : missing startTime parameter"
  });else if (req.body.endTime == undefined) return res.status(400).json({
    jwt: token,
    error: "bad request : missing endTime parameter"
  });else if (numberError([req.params.event_id])) return res.status(400).json({
    jwt: token,
    error: "url parameter event_id must be a number"
  });
  eventDao.getEventParticipants(req.params.event_id, function (status, data) {
    if (data.length == 0) return res.status(200).json({
      jwt: token,
      error: 'no data received'
    });

    if (data[0].host_id == req.userId) {
      eventDao.createPerformance({
        artistId: req.body.userId,
        eventId: req.params.event_id,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        name: req.body.name
      }, function (status, data) {
        res.status(status).json({
          data: data,
          jwt: token
        });
      });
    } else {
      res.status(403).json({
        jwt: token,
        error: "Not authorized to access this information"
      });
    }
  });
}); //post a rider

app.post("/api/event/:event_id/performance/:performance_id/rider", function (req, res) {
  console.log("Fikk POST-request fra klienten");
  var token = thisFunctionCreatesNewToken(req.email, req.userId);
  if (req.body.amount == undefined) return res.json({
    error: "bad request : missing amount parameter"
  });else if (numberError([req.params.performance_id, req.params.event_id])) return res.status(400).json({
    jwt: token,
    error: "url parameteres must be a number"
  });else if (numberError([req.body.amount])) return res.status(400).json({
    jwt: token,
    error: "number field is a string"
  });
  eventDao.getEventParticipants(req.params.event_id, function (status, data) {
    if (data[0].host_id == req.userId) {
      eventDao.createRider({
        performanceId: req.params.performance_id,
        name: req.body.name,
        amount: req.body.amount,
        confirmed: 1
      }, function (status, data) {
        res.status(status).json({
          data: data,
          jwt: token
        });
      });
    } else if (checkEventAccess(data, req.userId)) {
      eventDao.createRider({
        performanceId: req.params.performance_id,
        name: req.body.name,
        amount: req.body.amount,
        confirmed: 0
      }, function (status, data) {
        res.status(status).json({
          data: data,
          jwt: token
        });
      });
    } else {
      res.status(403).json({
        jwt: token,
        error: "Not authorized to access this information"
      });
    }
  });
}); // post new crew

app.post('/api/event/:event_id/crew', function (req, res) {
  console.log('fikk post-request fra klient');
  var token = thisFunctionCreatesNewToken(req.email, req.userId);
  if (numberError([req.params.event_id])) res.status(400).json({
    jwt: token,
    error: "url parameter event_id must be a number"
  });else if (req.body.profession == undefined) return res.status(400).json({
    jwt: token,
    error: "parameter profession undefined"
  });else if (req.body.name == undefined) return res.status(400).json({
    jwt: token,
    error: "parameter name undefined"
  });else if (req.body.contactInfo == undefined) return res.status(400).json({
    jwt: token,
    error: "parameter contactInfo undefined"
  });
  eventDao.getEventParticipants(req.params.event_id, function (status, data) {
    if (data[0].host_id == req.userId) {
      eventDao.createCrew({
        profession: req.body.profession,
        name: req.body.name,
        contactInfo: req.body.contactInfo,
        eventId: req.params.event_id
      }, function (status, data) {
        res.status(status).json({
          data: data,
          jwt: token
        });
      });
    } else {
      res.status(403).json({
        jwt: token,
        error: "Not authorized to access this information"
      });
    }
  });
}); // put contract

app.put('/api/event/:event_id/performance/:performance_id/contract', uploader.uploadContract); // get contract

app.get('/api/event/:event_id/performance/:performance_id/contract', function (req, res) {
  console.log('Fikk get-request fra klient');
  var token = thisFunctionCreatesNewToken(req.email, req.userId);
  eventDao.downloadContract(req.params.performance_id, function (status, data) {
    res.status(status);
    if (data[0] == undefined) return res.status(400).json({
      data: "No contract exists",
      jwt: token
    });
    res.json({
      data: data[0].contract,
      jwt: token
    });
  });
}); // put event picture

app.put('/api/event/:event_id/picture', uploader.uploadEventPicture); // put user picture

app.put('/api/user/:user_id/picture', uploader.uploadUserPicture);
/**
 * This function checks if items in the input-array are numbers or not
 */

function numberError(nums) {
  for (var i = 0; i < nums.length; i++) {
    if (isNaN(nums[i])) return true;

    if (typeof nums[i] === 'string') {
      if (nums[i].trim() === '') return true;
    }
  }

  return false;
}
/**
 * This function checks if inputstring is a mailadress
 */


function sjekkMail(inc) {
  var re = /\S+@\S+\.\S+/;
  return re.test(inc);
}

var server = app.listen(8080);
console.log("running");