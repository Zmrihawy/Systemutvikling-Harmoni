"use strict";

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

var Constants = require("./databaseConsts.js");

var CONSTANTS = new Constants();

var Dao = require("./dao.js");

module.exports =
/*#__PURE__*/
function (_Dao) {
  _inherits(ServerDao, _Dao);

  function ServerDao() {
    _classCallCheck(this, ServerDao);

    return _possibleConstructorReturn(this, _getPrototypeOf(ServerDao).apply(this, arguments));
  }

  _createClass(ServerDao, [{
    key: "getPerformance",

    /**GET*/
    value: function getPerformance(sql, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "SELECT * FROM ".concat(CONSTANTS.PERFORMANCE_TABLE, " WHERE ").concat(CONSTANTS.PERFORMANCE_ARTIST_ID, " = ?"), [sql], callback);
    }
  }, {
    key: "getContract",
    value: function getContract(sql, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "SELECT ".concat(CONSTANTS.PERFORMANCE_CONTRACT, " FROM ").concat(CONSTANTS.PERFORMANCE_TABLE, " WHERE ").concat(CONSTANTS.PERFORMANCE_EVENT_ID, " = ? AND ").concat(CONSTANTS.PERFORMANCE_ARTIST_ID, " = ?"), [sql.eventId, sql.artistId], callback);
    }
  }, {
    key: "getEventContracts",
    value: function getEventContracts(sql, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "SELECT * FROM ".concat(CONSTANTS.PERFORMANCE_TABLE, " WHERE ").concat(CONSTANTS.EVENT_ID, " = ?"), [sql], callback);
    }
  }, {
    key: "getTickets",
    value: function getTickets(sql, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "SELECT * FROM ".concat(CONSTANTS.TICKET_TABLE, " WHERE ").concat(CONSTANTS.EVENT_ID, " = ?"), [sql], callback);
    }
  }, {
    key: "getRiders",
    value: function getRiders(sql, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "SELECT * FROM ".concat(CONSTANTS.RIDER_TABLE, " WHERE ").concat(CONSTANTS.PERFORMANCE_ID, " = ?"), [sql.performanceId], callback);
    }
  }, {
    key: "getEvent",
    value: function getEvent(sql, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "SELECT * FROM ".concat(CONSTANTS.EVENT_TABLE, " WHERE ").concat(CONSTANTS.EVENT_ID, " = ?"), [sql], callback);
    }
  }, {
    key: "getAllEvents",
    value: function getAllEvents(callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "SELECT * FROM ".concat(CONSTANTS.EVENT_TABLE), [], callback);
    }
  }, {
    key: "getUsersEvents",
    value: function getUsersEvents(sql, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "SELECT * FROM ".concat(CONSTANTS.EVENT_TABLE, " a JOIN ").concat(CONSTANTS.USER_TABLE, " b ON a.").concat(CONSTANTS.EVENT_HOST_ID, " = b.").concat(CONSTANTS.USER_ID, " WHERE aktiv = ?"), [sql.userId, sql.active], callback);
    }
    /**CREATE*/

  }, {
    key: "createEvent",
    value: function createEvent(sql, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "INSERT INTO ".concat(CONSTANTS.EVENT_TABLE, " (").concat(CONSTANTS.EVENT_NAME, ",").concat(CONSTANTS.EVENT_HOST_ID, ",").concat(CONSTANTS.EVENT_START_TIME, ",").concat(CONSTANTS.EVENT_END_TIME, ",").concat(CONSTANTS.EVENT_LOCATION, ") \n                    VALUES (?,?,?) "), [sql.name, sql.userId, sql.startTime, sql.endTime, sql.location], callback);
    }
  }, {
    key: "createTicket",
    value: function createTicket(sql, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "INSERT INTO ".concat(CONSTANTS.TICKET_TABLE, " (").concat(CONSTANTS.TICKET_NAME, ",").concat(CONSTANTS.TICKET_EVENT_ID, ",").concat(CONSTANTS.TICKET_PRICE, ",").concat(CONSTANTS.TICKET_DESCRIPTION, ",").concat(CONSTANTS.TICKET_AMOUNT, ") \n                    VALUES (?,?,?,?,?) "), [sql.name, sql.eventId, sql.price, sql.description, sql.amount], callback);
    }
  }, {
    key: "createPerformance",
    value: function createPerformance(sql, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "INSERT INTO ".concat(CONSTANTS.PERFORMANCE_TABLE, " (").concat(CONSTANTS.PERFORMANCE_ARTIST_ID, ",").concat(CONSTANTS.PERFORMANCE_EVENT_ID, ",").concat(CONSTANTS.PERFORMANCE_START_TIME, ",").concat(CONSTANTS.PERFORMANCE_END_TIME, "\n                    ").concat(CONSTANTS.PERFORMANCE_CONTRACT, ") VALUES (?,?,?,?) "), [sql.artistId, sql.eventId, sql.startTime, sql.endTime, sql.contract], callback);
    }
  }, {
    key: "createRiders",
    value: function createRiders(sql, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "INSERT INTO ".concat(CONSTANTS.RIDER_TABLE, " (").concat(CONSTANTS.RIDER_PERFORMANCE_ID, ",").concat(RIDER_DESCRIPTION, ") VALUES (?,?) "), [sql.performanceId, sql.description], callback);
    }
    /**DELETE*/

  }, {
    key: "deleteRider",
    value: function deleteRider(sql, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "DELETE FROM ".concat(CONSTANTS.RIDER_TABLE, " WHERE ").concat(CONSTANTS.RIDER_PERFORMANCE_ID, " = ? AND ").concat(CONSTANTS.RIDER_NAME), [sql], callback);
    }
  }, {
    key: "deleteEvent",
    value: function deleteEvent(sql, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "DELETE FROM ".concat(CONSTANTS.EVENT_TABLE, " WHERE ").concat(CONSTANTS.EVENT_ID), [sql], callback);
    }
  }, {
    key: "deleteTicket",
    value: function deleteTicket(sql, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "DELETE FROM ".concat(CONSTANTS.TICKET_TABLE, " WHERE ").concat(CONSTANTS.TICKET_NAME, " = ? AND ").concat(CONSTANTS.TICKET_EVENT_ID, " = ?"), [sql.name, sql.eventId], callback);
    }
  }, {
    key: "deletePerformance",
    value: function deletePerformance(sql, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "DELETE FROM ".concat(CONSTANTS.PERFORMANCE_TABLE, " WHERE ").concat(CONSTANTS.PERFORMANCE_ARTIST_ID, " = ?"), [sql], callback);
    }
    /**UPDATE*/

  }, {
    key: "updateTicket",
    value: function updateTicket(sql, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "UPDATE ".concat(CONSTANTS.TICKET_TABLE, " SET ").concat(CONSTANTS.TICKET_PRICE, " = ?, ").concat(CONSTANTS.TICKET_AMOUNT, " = ?, ").concat(CONSTANTS.TICKET_DESCRIPTION, " = ?  WHERE ").concat(CONSTANTS.TICKET_NAME, " = ? AND ").concat(CONSTANTS.TICKET_EVENT_ID, " = ? ")[(sql.price, sql.description, sql.name, sql.eventId)], callback);
    }
  }, {
    key: "updateRider",
    value: function updateRider(sql, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "UPDATE ".concat(CONSTANTS.RIDER_TABLE, " SET ").concat(CONSTANTS.RIDER_NAME, " = ?, ").concat(CONSTANTS.RIDER_AMOUNT, " = ? WHERE ").concat(CONSTANTS.RIDER_PERFORMANCE_ID, " and ").concat(CONSTANTS.RIDER_NAME, " = ?"), [sql.name, sql.amount, sql.performanceId, sql.oldName], callback);
    }
  }, {
    key: "updatePerformance",
    value: function updatePerformance(sql, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "UPDATE ".concat(CONSTANTS.PERFORMANCE_TABLE, " SET ").concat(CONSTANTS.PERFORMANCE_START_TIME, " = ?, ").concat(CONSTANTS.PERFORMANCE_END_TIME, " = ?, ").concat(CONSTANTS.PERFORMANCE_CONTRACT, " = ? WHERE ").concat(CONSTANTS.PERFORMANCE_ID, " = ?"), [sql.startTime, sql.endTime, sql.contract, sql.performanceId], callback);
    }
  }, {
    key: "updateEvent",
    value: function updateEvent(sql, callback) {
      _get(_getPrototypeOf(ServerDao.prototype), "query", this).call(this, "UPDATE ".concat(CONSTANTS.EVENT_TABLE, " SET ").concat(CONSTANTS.EVENT_NAME, " = ?, ").concat(CONSTANTS.EVENT_HOST_ID, " = ?, ").concat(CONSTANTS.EVENT_ACTIVE, " = ?, ").concat(CONSTANTS.EVENT_LOCATION, " = ?, ").concat(CONSTANTS.EVENT_START_TIME, " = ?,\n            ").concat(CONSTANTS.EVENT_END_TIME, " = ? WHERE ").concat(CONSTANTS.EVENT_ID, " = ?"), [sql.hostId, sql.active, sql.location, sql.startTime, sql.endTime, sql.eventId], callback);
    }
  }]);

  return ServerDao;
}(Dao);