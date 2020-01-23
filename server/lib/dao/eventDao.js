"use strict";

var _databaseConsts = _interopRequireDefault(require("./databaseConsts.js"));

var _dao = _interopRequireDefault(require("./dao.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var CONSTANTS = new _databaseConsts["default"]();

module.exports =
/*#__PURE__*/
function (_Dao) {
  _inherits(ServerDao, _Dao);

  function ServerDao() {
    _classCallCheck(this, ServerDao);

    return _possibleConstructorReturn(this, _getPrototypeOf(ServerDao).apply(this, arguments));
  }

  _createClass(ServerDao, [{
    key: "getEventParticipants",

    /**
     * This function gets all users linked to an event from the database
     */
    value: function getEventParticipants(sql, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "SELECT p.".concat(CONSTANTS.PERFORMANCE_ARTIST_ID, ", e.").concat(CONSTANTS.EVENT_HOST_ID, " FROM ").concat(CONSTANTS.EVENT_TABLE, " e LEFT JOIN ").concat(CONSTANTS.PERFORMANCE_TABLE, " p \n        ON p.").concat(CONSTANTS.PERFORMANCE_EVENT_ID, " = e.").concat(CONSTANTS.EVENT_ID, " WHERE e.").concat(CONSTANTS.EVENT_ID, " = ?"), [sql], callback);
    }
    /**
     * This function gets all riders for in a performance from the database.
     */

  }, {
    key: "getRiders",
    value: function getRiders(sql, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "SELECT * FROM ".concat(CONSTANTS.RIDER_TABLE, " WHERE ").concat(CONSTANTS.RIDER_PERFORMANCE_ID, " = ?"), [sql], callback);
    }
    /**
     * This function gets an event and the first name and last name of the host from the database
     */

  }, {
    key: "getEvent",
    value: function getEvent(sql, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "SELECT e.*, u.".concat(CONSTANTS.USER_FIRST_NAME, ", u.").concat(CONSTANTS.USER_LAST_NAME, " FROM ").concat(CONSTANTS.EVENT_TABLE, " as e \n        JOIN ").concat(CONSTANTS.USER_TABLE, " as u ON e.").concat(CONSTANTS.EVENT_HOST_ID, " = u.").concat(CONSTANTS.USER_ID, " WHERE ").concat(CONSTANTS.EVENT_ID, " = ?"), [sql], callback);
    }
    /**
     * This function gets all active or inactive events for a specific user from the database
     */

  }, {
    key: "getUserEvents",
    value: function getUserEvents(sql, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "SELECT DISTINCT e.".concat(CONSTANTS.EVENT_NAME, ", e.").concat(CONSTANTS.EVENT_ID, ", e.").concat(CONSTANTS.EVENT_START_TIME, ", e.").concat(CONSTANTS.EVENT_END_TIME, ", ").concat(CONSTANTS.EVENT_LOCATION, ", ").concat(CONSTANTS.EVENT_PICTURE, " FROM\n         ").concat(CONSTANTS.EVENT_TABLE, " e JOIN ").concat(CONSTANTS.PERFORMANCE_TABLE, " p ON e.").concat(CONSTANTS.EVENT_ID, " = p.").concat(CONSTANTS.PERFORMANCE_EVENT_ID, " WHERE ((p.").concat(CONSTANTS.PERFORMANCE_ARTIST_ID, " = ? OR e.").concat(CONSTANTS.EVENT_HOST_ID, " = ?) AND ").concat(CONSTANTS.EVENT_ACTIVE, " = ?)"), [sql.userId, sql.userId, sql.active], callback);
    }
    /**
     * This function gets all performances in an event from the database
     */

  }, {
    key: "getEventPerformances",
    value: function getEventPerformances(sql, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "SELECT ".concat(CONSTANTS.USER_USERNAME, ", u.").concat(CONSTANTS.USER_ID, ", ").concat(CONSTANTS.PERFORMANCE_EVENT_ID, ", ").concat(CONSTANTS.USER_PICTURE, ", ").concat(CONSTANTS.PERFORMANCE_NAME, ", ").concat(CONSTANTS.PERFORMANCE_START_TIME, ", ").concat(CONSTANTS.PERFORMANCE_END_TIME, ", ").concat(CONSTANTS.PERFORMANCE_ID, " \n        FROM ").concat(CONSTANTS.PERFORMANCE_TABLE, " as p LEFT JOIN ").concat(CONSTANTS.USER_TABLE, " as u ON p.").concat(CONSTANTS.PERFORMANCE_ARTIST_ID, " = u.").concat(CONSTANTS.USER_ID, " WHERE ").concat(CONSTANTS.PERFORMANCE_EVENT_ID, " = ?"), [sql], callback);
    }
    /**
     * This function gets all tickets for a specific event from the database
     */

  }, {
    key: "getTickets",
    value: function getTickets(sql, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "SELECT * FROM ".concat(CONSTANTS.TICKET_TABLE, " WHERE ").concat(CONSTANTS.TICKET_EVENT_ID, " = ?"), [sql], callback);
    }
    /**
     * This function gets crew for a specific event from the database
     */

  }, {
    key: "getCrew",
    value: function getCrew(sql, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "SELECT * FROM ".concat(CONSTANTS.CREW_TABLE, " WHERE ").concat(CONSTANTS.CREW_EVENT_ID, " = ?"), [sql], callback);
    }
    /**CREATE*/

    /**
     * This function posts a new event to the database
     */

  }, {
    key: "createEvent",
    value: function createEvent(sql, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "INSERT INTO ".concat(CONSTANTS.EVENT_TABLE, " (").concat(CONSTANTS.EVENT_NAME, ",").concat(CONSTANTS.EVENT_HOST_ID, ",").concat(CONSTANTS.EVENT_LOCATION, ",").concat(CONSTANTS.EVENT_LONGITUDE, ",").concat(CONSTANTS.EVENT_LATITUDE, ", ").concat(CONSTANTS.EVENT_PICTURE, ",\n                    ").concat(CONSTANTS.EVENT_DESCRIPTION, ",").concat(CONSTANTS.EVENT_START_TIME, ",").concat(CONSTANTS.EVENT_END_TIME, ",").concat(CONSTANTS.EVENT_ACTIVE, ") \n                    VALUES (?,?,?,?,?,?,?,?,?,1) "), [sql.eventName, sql.userId, sql.location, Number(sql.longitude), Number(sql.latitude), sql.picture, sql.description, sql.startTime, sql.endTime], callback);
    }
    /**
     * This function posts a new ticket to the database
     */

  }, {
    key: "createTicket",
    value: function createTicket(sql, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "INSERT INTO ".concat(CONSTANTS.TICKET_TABLE, " (").concat(CONSTANTS.TICKET_NAME, ",").concat(CONSTANTS.TICKET_EVENT_ID, ",").concat(CONSTANTS.TICKET_PRICE, ",").concat(CONSTANTS.TICKET_AMOUNT, ") \n                    VALUES (?,?,?,?) "), [sql.name, sql.eventId, sql.price, sql.amount], callback);
    }
    /**
     * This function posts a new performance to the database
     */

  }, {
    key: "createPerformance",
    value: function createPerformance(sql, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "INSERT INTO ".concat(CONSTANTS.PERFORMANCE_TABLE, " (").concat(CONSTANTS.PERFORMANCE_ARTIST_ID, ",").concat(CONSTANTS.PERFORMANCE_EVENT_ID, ",").concat(CONSTANTS.PERFORMANCE_START_TIME, ",").concat(CONSTANTS.PERFORMANCE_END_TIME, ",").concat(CONSTANTS.PERFORMANCE_NAME, ") VALUES (?,?,?,?,?) "), [sql.artistId, sql.eventId, sql.startTime, sql.endTime, sql.name], callback);
    }
    /**
     * This function posts a new rider to the database
     */

  }, {
    key: "createRider",
    value: function createRider(sql, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "INSERT INTO ".concat(CONSTANTS.RIDER_TABLE, " VALUES (?,?,?,?) "), [sql.performanceId, sql.name, sql.amount, sql.confirmed], callback);
    }
    /**
     * This function posts a new crew to the database
     */

  }, {
    key: "createCrew",
    value: function createCrew(sql, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "INSERT INTO ".concat(CONSTANTS.CREW_TABLE, " (").concat(CONSTANTS.CREW_PROFESSION, ",").concat(CONSTANTS.CREW_NAME, ",").concat(CONSTANTS.CREW_CONTACT_INFO, ",").concat(CONSTANTS.CREW_EVENT_ID, ") \n                    VALUES (?,?,?,?) "), [sql.profession, sql.name, sql.contactInfo, sql.eventId], callback);
    }
    /**DELETE*/

    /**
     * This function deletes a rider from the database
     */

  }, {
    key: "deleteRider",
    value: function deleteRider(sql, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "DELETE FROM ".concat(CONSTANTS.RIDER_TABLE, " WHERE ").concat(CONSTANTS.RIDER_PERFORMANCE_ID, " = ? AND ").concat(CONSTANTS.RIDER_NAME, " = ?"), [sql.performanceId, sql.name], callback);
    }
    /**
     * This function deletes an event from the database
     */

  }, {
    key: "deleteEvent",
    value: function deleteEvent(sql, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "DELETE FROM ".concat(CONSTANTS.EVENT_TABLE, " WHERE ").concat(CONSTANTS.EVENT_ID, " = ?"), [sql], callback);
    }
    /**
     * This function deletes a ticket from the database
     */

  }, {
    key: "deleteTicket",
    value: function deleteTicket(sql, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "DELETE FROM ".concat(CONSTANTS.TICKET_TABLE, " WHERE ").concat(CONSTANTS.TICKET_NAME, " = ? AND ").concat(CONSTANTS.TICKET_EVENT_ID, " = ?"), [sql.name, sql.eventId], callback);
    }
    /**
     * This function deletes a performance from the database
     */

  }, {
    key: "deletePerformance",
    value: function deletePerformance(sql, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "DELETE FROM ".concat(CONSTANTS.PERFORMANCE_TABLE, " WHERE ").concat(CONSTANTS.PERFORMANCE_ID, " = ?"), [sql], callback);
    }
    /**
     * This function deletes a crew from the database
     */

  }, {
    key: "deleteCrew",
    value: function deleteCrew(sql, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "DELETE FROM ".concat(CONSTANTS.CREW_TABLE, " WHERE ").concat(CONSTANTS.CREW_ID, " = ?"), [sql], callback);
    }
    /**UPDATE*/

    /**
     * This function updates a ticket in the database
     */

  }, {
    key: "updateTicket",
    value: function updateTicket(sql, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "UPDATE ".concat(CONSTANTS.TICKET_TABLE, " SET ").concat(CONSTANTS.TICKET_PRICE, " = ?, ").concat(CONSTANTS.TICKET_AMOUNT, " = ?, ").concat(CONSTANTS.TICKET_NAME, " = ? WHERE ").concat(CONSTANTS.TICKET_NAME, " = ? AND ").concat(CONSTANTS.TICKET_EVENT_ID, " = ? "), [sql.price, sql.amount, sql.name, sql.oldName, sql.eventId], callback);
    }
    /**
     * This function updates a rider in the database
     */

  }, {
    key: "updateRider",
    value: function updateRider(sql, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "UPDATE ".concat(CONSTANTS.RIDER_TABLE, " SET ").concat(CONSTANTS.RIDER_NAME, " = ?, ").concat(CONSTANTS.RIDER_AMOUNT, " = ? , ").concat(CONSTANTS.RIDER_CONFIRMED, " = ? WHERE ").concat(CONSTANTS.RIDER_PERFORMANCE_ID, " = ? and ").concat(CONSTANTS.RIDER_NAME, " = ?"), [sql.name, sql.amount, sql.confirmed, sql.performanceId, sql.oldName], callback);
    }
    /**
     * This function updates a performance in the database
     */

  }, {
    key: "updatePerformance",
    value: function updatePerformance(sql, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "UPDATE ".concat(CONSTANTS.PERFORMANCE_TABLE, " SET ").concat(CONSTANTS.PERFORMANCE_START_TIME, " = ?, ").concat(CONSTANTS.PERFORMANCE_END_TIME, " = ?, ").concat(CONSTANTS.PERFORMANCE_NAME, " = ? WHERE ").concat(CONSTANTS.PERFORMANCE_ID, " = ?"), [sql.startTime, sql.endTime, sql.name, sql.performanceId], callback);
    }
    /**
     * This function updates an event in the database
     */

  }, {
    key: "updateEvent",
    value: function updateEvent(sql, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "UPDATE ".concat(CONSTANTS.EVENT_TABLE, " SET ").concat(CONSTANTS.EVENT_NAME, " = ?, ").concat(CONSTANTS.EVENT_ACTIVE, " = ?, ").concat(CONSTANTS.EVENT_LOCATION, " = ?, ").concat(CONSTANTS.EVENT_LONGITUDE, " = ?, ").concat(CONSTANTS.EVENT_LATITUDE, " = ?,").concat(CONSTANTS.EVENT_DESCRIPTION, " = ?, \n            ").concat(CONSTANTS.EVENT_START_TIME, " = ?, ").concat(CONSTANTS.EVENT_END_TIME, " = ? WHERE ").concat(CONSTANTS.EVENT_ID, " = ?"), [sql.eventName, sql.active, sql.location, Number(sql.longitude), Number(sql.latitude), sql.description, sql.startTime, sql.endTime, sql.eventId], callback);
    }
    /**
     * This function updates a crew in the database
     */

  }, {
    key: "updateCrew",
    value: function updateCrew(sql, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "UPDATE ".concat(CONSTANTS.CREW_TABLE, " SET ").concat(CONSTANTS.CREW_PROFESSION, " = ?, ").concat(CONSTANTS.CREW_NAME, " = ?, ").concat(CONSTANTS.CREW_CONTACT_INFO, " = ? WHERE ").concat(CONSTANTS.CREW_ID, " = ?"), [sql.profession, sql.name, sql.contactInfo, sql.crewId], callback);
    }
    /**UPLOADS AND DOWNLOADS*/

    /**
     * This function uploads a crontract to the database
     */

  }, {
    key: "uploadContract",
    value: function uploadContract(performanceId, contract, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "UPDATE ".concat(CONSTANTS.PERFORMANCE_TABLE, " SET ").concat(CONSTANTS.PERFORMANCE_CONTRACT, " = ? WHERE ").concat(CONSTANTS.PERFORMANCE_ID, " = ?"), [contract, performanceId], callback);
    }
    /**
     * This function gets a contract from the database
     */

  }, {
    key: "downloadContract",
    value: function downloadContract(performanceId, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "SELECT ".concat(CONSTANTS.PERFORMANCE_CONTRACT, " FROM ").concat(CONSTANTS.PERFORMANCE_TABLE, " WHERE ").concat(CONSTANTS.PERFORMANCE_ID, " = ?"), [performanceId], callback);
    }
    /**
     * This function uploads a picture to the database
     */

  }, {
    key: "uploadPicture",
    value: function uploadPicture(eventId, picture, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "UPDATE ".concat(CONSTANTS.EVENT_TABLE, " SET ").concat(CONSTANTS.EVENT_PICTURE, " = ? WHERE ").concat(CONSTANTS.EVENT_ID, " = ?"), [picture, eventId], callback);
    }
  }]);

  return ServerDao;
}(_dao["default"]);