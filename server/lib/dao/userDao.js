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

var Dao = require("./dao.js");

var Constants = require("./databaseConsts.js");

var CONSTANTS = new Constants();

module.exports =
/*#__PURE__*/
function (_Dao) {
  _inherits(UserDao, _Dao);

  function UserDao() {
    _classCallCheck(this, UserDao);

    return _possibleConstructorReturn(this, _getPrototypeOf(UserDao).apply(this, arguments));
  }

  _createClass(UserDao, [{
    key: "getUser",
    value: function getUser(sql, callback) {
      _get(_getPrototypeOf(UserDao.prototype), "query", this).call(this, "SELECT ".concat(CONSTANTS.USER_ID, ", ").concat(CONSTANTS.USER_USERNAME, ", ").concat(CONSTANTS.USER_EMAIL, ", ").concat(CONSTANTS.USER_PHONE, ", ").concat(CONSTANTS.USER_FIRST_NAME, ", ").concat(CONSTANTS.USER_LAST_NAME, " \n                    FROM ").concat(CONSTANTS.USER_TABLE, " WHERE ").concat(CONSTANTS.USER_ID, " = ?"), [sql], callback);
    }
  }, {
    key: "getPassword",
    value: function getPassword(sql, callback) {
      _get(_getPrototypeOf(UserDao.prototype), "query", this).call(this, "SELECT ".concat(CONSTANTS.USER_ID, ", HEX(").concat(CONSTANTS.USER_PASSWORD, ") as ").concat(CONSTANTS.USER_PASSWORD, " , HEX(").concat(CONSTANTS.USER_SALT, ") as ").concat(CONSTANTS.USER_SALT, " FROM ").concat(CONSTANTS.USER_TABLE, " WHERE ").concat(CONSTANTS.USER_EMAIL, " = ?"), [sql], callback);
    }
  }, {
    key: "getAllUsers",
    value: function getAllUsers(callback) {
      _get(_getPrototypeOf(UserDao.prototype), "query", this).call(this, "SELECT ".concat(CONSTANTS.USER_ID, ", ").concat(CONSTANTS.USER_USERNAME, " FROM ").concat(CONSTANTS.USER_TABLE), [], callback);
    }
  }, {
    key: "createUser",
    value: function createUser(sql, callback) {
      _get(_getPrototypeOf(UserDao.prototype), "query", this).call(this, "INSERT INTO ".concat(CONSTANTS.USER_TABLE, " (").concat(CONSTANTS.USER_USERNAME, ", ").concat(CONSTANTS.USER_PASSWORD, ", ").concat(CONSTANTS.USER_SALT, ",").concat(CONSTANTS.USER_EMAIL, ",").concat(CONSTANTS.USER_PHONE, ",").concat(CONSTANTS.USER_FIRST_NAME, ",").concat(CONSTANTS.USER_LAST_NAME, ") \n                    VALUES (?,UNHEX(?),UNHEX(?),?,?,?,?)"), [sql.username, sql.password, sql.salt, sql.email, sql.phone, sql.firstName, sql.lastName], callback);
    }
  }, {
    key: "deleteUser",
    value: function deleteUser(sql, callback) {
      _get(_getPrototypeOf(UserDao.prototype), "query", this).call(this, "DELETE FROM ".concat(CONSTANTS.USER_TABLE, " WHERE ").concat(CONSTANTS.USER_ID, " = ?"), [sql], callback);
    }
  }, {
    key: "updatePassword",
    value: function updatePassword(sql, callback) {
      _get(_getPrototypeOf(UserDao.prototype), "query", this).call(this, "UPDATE ".concat(CONSTANTS.USER_TABLE, " SET ").concat(CONSTANTS.USER_PASSWORD, " = UNHEX(?) WHERE ").concat(CONSTANTS.USER_ID, " = ?"), [sql.password, sql.userId], callback);
    }
  }, {
    key: "updateUser",
    value: function updateUser(sql, callback) {
      var userAtributes = [sql.username, sql.email, sql.phone, sql.firstName, sql.lastName, sql.userId];

      _get(_getPrototypeOf(UserDao.prototype), "query", this).call(this, "UPDATE ".concat(CONSTANTS.USER_TABLE, " SET ").concat(CONSTANTS.USER_USERNAME, " = ?, ").concat(CONSTANTS.USER_EMAIL, " = ?, ").concat(CONSTANTS.USER_PHONE, " = ?, ").concat(CONSTANTS.USER_FIRST_NAME, " = ?, ").concat(CONSTANTS.USER_LAST_NAME, " = ? WHERE ").concat(CONSTANTS.USER_ID, " = ?"), userAtributes, callback);
    }
  }]);

  return UserDao;
}(Dao);