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

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var MASTER_TOKEN = "MASTER"; //TODO DELEEEEEETE

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
var privateKey = publicKey = "shhhhhverysecret"; // middleware-functiona

app.use("/api", function (req, res, next) {
  if (req.headers['x-access-token'] === undefined) return res.json({
    error: "missing access token header"
  });
  var token = req.headers["x-access-token"];

  if (token === MASTER_TOKEN) {
    req.email = req.body.email;
    req.userId = req.body.userId;
    next();
  } else {
    _jsonwebtoken["default"].verify(token, publicKey, function (err, decoded) {
      if (err) {
        console.log("Token IKKE ok");
        res.status(401);
        res.json({
          error: "Not authorized -> Token Expired"
        });
      } else {
        userDao.getUser(req.body.userId, function (status, data) {
          console.log(decoded);
          console.log(data);

          if (data.length === 0) {
            res.status(401);
            res.json({
              error: "Not authorized -> Invalid Token"
            });
          } else if (data[0].email === decoded.email) {
            req.email = decoded.email;
            req.userId = data[0].userId;
            next();
          } else {
            res.status(401);
            res.json({
              error: "Not authorized -> Wrong username"
            });
          }
        });
      }
    });
  }
});

function thisFunctionCreatesNewToken(passedMail) {
  var newToken = _jsonwebtoken["default"].sign({
    email: passedMail
  }, privateKey, {
    expiresIn: 60
  });

  return newToken;
} //Get one user


app.get("/api/user/:id", function (req, res) {
  console.log("/user/".concat(req.params.id, " fikk request fra klient"));
  userDao.getUser(req.params.id, function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email);
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
    var token = thisFunctionCreatesNewToken(req.email);
    res.json({
      data: data,
      jwt: token
    });
  });
}); //Delete rider

app["delete"]('/api/performance/:performance_id/rider', function (req, res) {
  console.log("Fikk DELETE-request fra klienten");
  if (req.body.name === undefined) return res.json({
    error: "bad request"
  });
  eventDao.deleteRider({
    performanceId: req.params.performance_id,
    name: req.body.name
  }, function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email);
    res.json({
      data: data,
      jwt: token
    });
  });
}); // DELETE TICKET

app["delete"]("/api/event/:event_id/ticket", function (req, res) {
  if (req.body.name === undefined) return res.json({
    error: "bad request"
  });
  console.log("Fikk Delete-request fra klient");
  eventDao.deleteTicket({
    eventId: req.params.event_id,
    name: req.body.name
  }, function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email);
    res.json({
      data: data,
      jwt: token
    });
  });
}); // DELETE PERFORMANCE

app["delete"]("/api/performance/:performance_id", function (req, res) {
  eventDao.deletePerformance(req.params.performance_id, function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email);
    res.json({
      data: data,
      jwt: token
    });
  });
}); // UPDATE PERFORMANCE

app.put("/api/performance/:performance_id", function (req, res) {
  if (req.body.startTime === undefined || req.body.endTime === undefined || req.body.contract === undefined) return res.json({
    error: "bad request"
  });
  eventDao.updatePerformance({
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    contract: req.body.contract,
    performanceId: req.params.performance_id
  }, function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email);
    res.json({
      data: data,
      jwt: token
    });
  });
}); //Delete a user

app["delete"]("/api/user/:user_id", function (req, res) {
  console.log("Fikk DELETE-request fra klienten");
  if (req.body.password === undefined) return res.json({
    error: "request missing password"
  });
  userDao.getPassword(req.params.user_id, function (status, data) {
    var pw = req.body.password;

    var hashPW = _crypto["default"].createHmac('sha512', data[0].salt);

    var pass = pw;
    hashPW.update(pass);
    pass = hashPW.digest('hex');

    if (data[0].password.toString() === pass.toUpperCase()) {
      userDao.deleteUser(req.params.user_id, function (st, dt) {
        res.status(st);
        dt["jwt"] = thisFunctionCreatesNewToken(req.email);
        res.json(dt);
      });
    } else {
      res.error("Feil passord");
    }
  });
}); //Update a user

app.put("/api/user/:user_id", function (req, res) {
  console.log("Fikk PUT-request fra klienten");
  if (req.body.username === undefined || req.body.username === null) return res.json({
    error: "request missing username"
  });
  if (req.body.email === undefined || req.body.email === null) return res.json({
    error: "request missing email"
  });
  if (req.body.firstName === undefined) return res.json({
    error: "request missing first-name"
  });
  if (req.body.lastName === undefined) return res.json({
    error: "requst misssing last-name"
  });
  var params = {
    username: req.body.username,
    email: req.body.email,
    phone: req.body.phone,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    userId: req.params.userId
  };
  userDao.updateUser(req.params, function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email);
    res.json({
      data: data,
      jwt: token
    });
  });
}); //post a user

app.post("/user", function (req, res) {
  console.log("Fikk POST-request fra klienten");
  if (req.body.username === undefined || req.body.username === null) return res.json({
    error: "request missing username"
  });
  if (req.body.password === undefined) return res.json({
    error: "request missing password"
  });
  if (req.body.email === undefined || req.body.email === null) return res.json({
    error: "request missing email"
  });
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
    res.status(status);
    res.json(data);
  });
}); //Get one event

app.get("/api/event/:event_id", function (req, res) {
  console.log("/event/:id: fikk request fra klient");
  eventDao.getEvent(req.params.event_id, function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email);
    res.json({
      data: data,
      jwt: token
    });
  });
}); //post an event

app.post("/api/event", function (req, res) {
  console.log("Fikk POST-request fra klienten");
  if (req.body.name === undefined || req.body.name === null) return res.json({
    error: "request missing event-name"
  });
  if (req.body.userId === undefined || req.body.userId === null) return res.json({
    error: "request missing event-host user Id"
  });
  eventDao.createEvent(req.body, function (status, data) {
    console.log("sdasa", data);
    res.status(status);
    data.jwt = thisFunctionCreatesNewToken(req.email);
    res.send(data);
  });
}); //post a ticket

app.post("/api/event/:event_id/ticket", function (req, res) {
  console.log("Fikk POST-request fra klienten");
  if (req.body.name === null || req.body.name === undefined) return res.json({
    error: "post-request missing ticket name"
  });
  if (req.body.eventId === null || req.body.eventId === undefined) return res.json({
    error: "post-request : ticket missing event"
  });
  if (req.body.price === null || req.body.price === undefined) return res.json({
    error: "post-request ticket missing ticket-price"
  });
  if (req.body.amount === null || req.body.amount === undefined) return res.json({
    error: "post request missing number of tickets"
  });
  eventDao.createTicket(req.body, function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email);
    res.json({
      data: data,
      jwt: token
    });
  });
}); //put ticket

app.put("/api/event/:event_id/ticket", function (req, res) {
  console.log("Fikk PUT-request fra klienten");
  if (req.body.price === undefined || req.body.price === null) return res.json({
    error: "request missing ticket - price"
  });
  if (req.body.amount == undefined) return res.json({
    error: "request missing number of tickets"
  });
  if (req.body.name == undefined) return res.json({
    error: "request missing ticket-name"
  });
  eventDao.updateTicket(req.body, function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email);
    res.json({
      data: data,
      jwt: token
    });
  });
}); //put rider

app.put("/api/performance/:performance_id/rider", function (req, res) {
  console.log("Fikk PUT-request fra klienten");
  if (req.body.name == undefined) return res.json({
    error: "bad request : missing name"
  });
  if (req.body.amount == undefined) return res.json({
    error: "bad request : missing amount of tickets"
  });
  if (req.body.oldName == undefined) return res.json({
    error: "bad request : missing old name - parameter"
  });
  eventDao.updateRider({
    name: req.body.name,
    amount: req.body.amount,
    performanceId: req.params.performance_id,
    oldName: req.body.oldName
  }, function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email);
    res.json({
      data: data,
      jwt: token
    });
  });
}); //post a performance

app.post("api/event/:event_id/performance", function (req, res) {
  console.log("Fikk POST-request fra klienten");
  if (req.body.artistId == undefined) return res.json({
    error: "bad request : missing artist parameter"
  });
  if (req.body.startTime == undefined) return res.json({
    error: "bad requst : missing startTime parameter"
  });
  if (req.body.endTime == undefined) return res.json({
    error: "bad request : missing endTime parameter"
  });
  if (req.body.contract == undefined) req.body.contract = "";
  eventDao.createPerformance({
    artistId: req.body.artistId,
    eventId: req.params.event_id,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    contract: req.body.contract
  }, function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email);
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
  });
  eventDao.createRider({
    performanceId: req.params.performance_id,
    name: req.params.name,
    amount: req.body.amount
  }, function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email);
    res.json({
      data: data,
      jwt: token
    });
  });
}); //Update an event

app.put("/api/event/:event_id", function (req, res) {
  console.log("Fikk PUT-request fra klienten");
  if (req.body.eventName == undefined) return res.json({
    error: "bad request : missing eventName parameter"
  });
  if (req.body.startTime == undefined) return res.json({
    error: "bad request : missing startTime parameter"
  });
  if (req.body.hostId == undefined) return res.json({
    error: "bad request : missing hostId parameter"
  });
  if (req.body.active == undefined) req.body.active = 1;
  if (req.body.location == undefined) return res.json({
    error: "bad request : mssing location parameter"
  });
  eventDao.updateEvent({
    eventName: req.body.eventName,
    hostId: req.body.hostId,
    active: req.body.active,
    location: req.body.location,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    eventId: req.params.event_id
  }, function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email);
    res.json({
      data: data,
      jwt: token
    });
  });
}); //Delete an event

app["delete"]("/api/event/:event_id", function (req, res) {
  console.log("Fikk DELETE-request fra klienten");
  eventDao.getEvent(req.params.event_id, function (status, data) {
    if (data[0].user_id === req.userId) {
      eventDao.deleteEvent(req.params.event_id, function (status, data) {
        res.status(status);
        var token = thisFunctionCreatesNewToken(req.email);
        res.json({
          data: data,
          jwt: token
        });
      });
    } else res.json({
      error: "not authorized"
    });
  });
}); //Get all events

app.get("/api/events", function (req, res) {
  console.log("/user: fikk request fra klient");
  eventDao.getAllEvents(function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email);
    res.json({
      data: data,
      jwt: token
    });
  });
}); //Get all contracts for an event

app.get("/api/event/:event_id/contract", function (req, res) {
  console.log("Fikk request fra klienten");
  eventDao.getEventContracts(req.params.event_id, function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email);
    res.json({
      data: data,
      jwt: token
    });
  });
}); //Edit contract

app.put("/api/event/:event_id/contract", function (req, res) {
  console.log("Fikk put-request om å endre kontrakt");
  eventDao.updateContract(req.body, function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email);
    res.json({
      data: data,
      jwt: token
    });
  });
}); //Get all tickets for an event

app.get("/api/event/:event_id/tickets", function (req, res) {
  console.log("Fikk request fra klienten");
  eventDao.getEventTickets(req.params.event_id, function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email);
    res.json({
      data: data,
      jwt: token
    });
  });
}); //Get all riders for each artist in a specific event

app.get("/api/event/:event_id/rider", function (req, res) {
  console.log("Fikk request fra klienten");
  eventDao.getAllRiders(req.params.event_id, function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email);
    res.json({
      data: data,
      jwt: token
    });
  });
}); //Get all raiders for one user

app.get("/api/user/event/:event_id/:performance_id", function (req, res) {
  console.log("/user/:user_id/:active: fikk request fra klient");
  if (req.params.performanceId == null || req.params.performanceId == undefined) return res.error("feil i fetch-call");
  eventDao.getPerformanceRiders(req.params.perfromanceId, function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email);
    res.json({
      data: data,
      jwt: token
    });
  });
}); //get all active events for user

app.get("/api/user/:user_id/event/:active", function (req, res) {
  console.log("fikk request get fra klient");
  eventDao.getUsersEvents({
    userId: req.params.user_id,
    active: req.params.active
  }, function (status, data) {
    res.status(status);
    var token = thisFunctionCreatesNewToken(req.email);
    res.json({
      data: data,
      jwt: token
    });
  });
}); //By request of a new password
//generate new password and send it via email

app.put("/user/:usermail", function (req, res) {
  userDao.getUser(req.params.usermail, function (status, data) {
    if (data.length === 1) {
      var password = _generatePassword["default"].generate({
        length: 12,
        numbers: true
      });

      var pw = password;

      var hashPW = _crypto["default"].createHmac('sha512', data[0].salt);

      hashPW.update(pw);
      pw = hashPW.digest('hex'); //#TODO

      userDao.updatePassword({
        userId: data[0].userId,
        password: pw
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
}); // Handles login and returns JWT-token as JSON

app.post("/login", function (req, res) {
  if (req.body.email == undefined) return res.json({
    error: "bad request : missing email parameter"
  });
  if (req.body.password == undefined) return res.json({
    error: " bad request : mssing password parameter"
  });
  loginOk(req.body.email, req.body.password).then(function (data) {
    var log = data;
    console.log("User ID", log);

    if (log > 0) {
      console.log("username & passord ok");

      var token = _jsonwebtoken["default"].sign({
        email: req.body.email
      }, privateKey, {
        expiresIn: 50000
      });

      res.json({
        jwt: token,
        userId: log
      });
    } else {
      console.log("brukernavn & passord IKKE ok");
      res.status(401);
      res.json({
        error: "Not authorized"
      });
    }
  });

  function loginOk(_x, _x2) {
    return _loginOk.apply(this, arguments);
  }

  function _loginOk() {
    _loginOk = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(email, pw) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", new Promise(function (resolve) {
                userDao.getPassword(email, function (status, data) {
                  var log = -1;

                  var hashPW = _crypto["default"].createHmac('sha512', data[0].salt);

                  var pass = pw;
                  hashPW.update(pass);
                  pass = hashPW.digest('hex'); //console.log(data[0]);

                  console.log(pass.toUpperCase());
                  console.log(data[0].password.toString());
                  console.log("lengde inc passowrd " + pass.length);
                  console.log("lengde sql password " + data[0].password.length);
                  if (pass.toUpperCase() === data[0].password.toString()) log = data[0].user_id;
                  resolve(log);
                });
              }));

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _loginOk.apply(this, arguments);
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