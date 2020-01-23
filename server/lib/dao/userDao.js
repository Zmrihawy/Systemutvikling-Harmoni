"use strict";

var _dao = _interopRequireDefault(require("./dao.js"));

var _databaseConsts = _interopRequireDefault(require("./databaseConsts.js"));

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
  _inherits(UserDao, _Dao);

  function UserDao() {
    _classCallCheck(this, UserDao);

    return _possibleConstructorReturn(this, _getPrototypeOf(UserDao).apply(this, arguments));
  }

  _createClass(UserDao, [{
    key: "getUser",

    /**
     * This function gets one user from the database
     */
    value: function getUser(sql, callback) {
      _get(_getPrototypeOf(UserDao.prototype), "query", this).call(this, "SELECT ".concat(CONSTANTS.USER_ID, ", ").concat(CONSTANTS.USER_USERNAME, ", ").concat(CONSTANTS.USER_EMAIL, ", ").concat(CONSTANTS.USER_PHONE, ", ").concat(CONSTANTS.USER_FIRST_NAME, ", ").concat(CONSTANTS.USER_LAST_NAME, ", ").concat(CONSTANTS.USER_ARTIST, ", ").concat(CONSTANTS.USER_PICTURE, "\n                    FROM ").concat(CONSTANTS.USER_TABLE, " WHERE ").concat(CONSTANTS.USER_ID, " = ?"), [sql], callback);
    }
    /**
     * This function gets the password for a specific user
     */

  }, {
    key: "getPassword",
    value: function getPassword(sql, callback) {
      _get(_getPrototypeOf(UserDao.prototype), "query", this).call(this, "SELECT u.".concat(CONSTANTS.USER_ID, ", u.").concat(CONSTANTS.USER_ARTIST, ", HEX(p.").concat(CONSTANTS.PASSWORD_PASSWORD, ") as ").concat(CONSTANTS.PASSWORD_PASSWORD, ", HEX(u.").concat(CONSTANTS.USER_SALT, ") as ").concat(CONSTANTS.USER_SALT, ", p.").concat(CONSTANTS.PASSWORD_AUTOGEN, " FROM ").concat(CONSTANTS.USER_TABLE, " u LEFT JOIN ").concat(CONSTANTS.PASSWORD_TABLE, " p ON \n        p.").concat(CONSTANTS.USER_ID, " = u.").concat(CONSTANTS.PASSWORD_USER_ID, " WHERE ").concat(CONSTANTS.USER_EMAIL, " = ? ORDER BY p.").concat(CONSTANTS.PASSWORD_AUTOGEN), [sql], callback);
    }
    /**
     * This function gets all artists from the database
     */

  }, {
    key: "getAllArtists",
    value: function getAllArtists(callback) {
      _get(_getPrototypeOf(UserDao.prototype), "query", this).call(this, "SELECT ".concat(CONSTANTS.USER_ID, ", ").concat(CONSTANTS.USER_USERNAME, ", ").concat(CONSTANTS.USER_FIRST_NAME, ", ").concat(CONSTANTS.USER_LAST_NAME, " FROM ").concat(CONSTANTS.USER_TABLE, " WHERE ").concat(CONSTANTS.USER_ARTIST, " = 1"), [], callback);
    }
    /**
     * This function gets username and useremail for a specific user identified by username or email
     */

  }, {
    key: "checkCred",
    value: function checkCred(sql, callback) {
      _get(_getPrototypeOf(UserDao.prototype), "query", this).call(this, "SELECT DISTINCT ".concat(CONSTANTS.USER_USERNAME, ", ").concat(CONSTANTS.USER_EMAIL, " FROM ").concat(CONSTANTS.USER_TABLE, " WHERE ").concat(CONSTANTS.USER_USERNAME, " = ? OR ").concat(CONSTANTS.USER_EMAIL, " = ?"), [sql.username, sql.email], callback);
    }
    /**
     * This function posts a new user to the database
     */

  }, {
    key: "createUser",
    value: function createUser(sql, callback) {
      _get(_getPrototypeOf(UserDao.prototype), "query", this).call(this, "INSERT INTO ".concat(CONSTANTS.USER_TABLE, " (").concat(CONSTANTS.USER_USERNAME, ", ").concat(CONSTANTS.USER_SALT, ",").concat(CONSTANTS.USER_EMAIL, ",").concat(CONSTANTS.USER_PHONE, ",").concat(CONSTANTS.USER_FIRST_NAME, ",").concat(CONSTANTS.USER_LAST_NAME, ", ").concat(CONSTANTS.USER_ARTIST, ") \n                    VALUES (?,UNHEX(?),?,?,?,?,?);\n                    INSERT INTO ").concat(CONSTANTS.PASSWORD_TABLE, " (").concat(CONSTANTS.PASSWORD_ID, ", ").concat(CONSTANTS.PASSWORD_PASSWORD, ", ").concat(CONSTANTS.PASSWORD_USER_ID, ", ").concat(CONSTANTS.PASSWORD_AUTOGEN, ")\n                    VALUES (DEFAULT, UNHEX(?), LAST_INSERT_ID(), 0)"), [sql.username, sql.salt, sql.email, sql.phone, sql.firstName, sql.lastName, sql.artist, sql.password], callback);
    }
    /**
     * This function posts a new password to the database
     */

  }, {
    key: "createPassword",
    value: function createPassword(sql, callback) {
      _get(_getPrototypeOf(UserDao.prototype), "query", this).call(this, "INSERT INTO ".concat(CONSTANTS.PASSWORD_TABLE, " (").concat(CONSTANTS.PASSWORD_ID, ", ").concat(CONSTANTS.PASSWORD_PASSWORD, ", ").concat(CONSTANTS.PASSWORD_USER_ID, ", ").concat(CONSTANTS.PASSWORD_AUTOGEN, ")\n        VALUES(DEFAULT, UNHEX(?), ?,?)"), [sql.password, sql.userId, sql.autogen], callback);
    }
    /**
     * This function deletes a user from the database
     */

  }, {
    key: "deleteUser",
    value: function deleteUser(sql, callback) {
      _get(_getPrototypeOf(UserDao.prototype), "query", this).call(this, "DELETE FROM ".concat(CONSTANTS.USER_TABLE, " WHERE ").concat(CONSTANTS.USER_ID, " = ?"), [sql], callback);
    }
    /**
     * This function updates a password in the database
     */

  }, {
    key: "updatePassword",
    value: function updatePassword(sql, callback) {
      _get(_getPrototypeOf(UserDao.prototype), "query", this).call(this, "UPDATE ".concat(CONSTANTS.PASSWORD_TABLE, " SET ").concat(CONSTANTS.PASSWORD_PASSWORD, " = UNHEX(?), ").concat(CONSTANTS.PASSWORD_AUTOGEN, " = ?  WHERE ").concat(CONSTANTS.PASSWORD_ID, " = ?"), [sql.password, sql.autogen, sql.passId], callback);
    }
    /**
     * This function updates a user in the database
     */

  }, {
    key: "updateUser",
    value: function updateUser(sql, callback) {
      _get(_getPrototypeOf(UserDao.prototype), "query", this).call(this, "UPDATE ".concat(CONSTANTS.USER_TABLE, " SET ").concat(CONSTANTS.USER_USERNAME, " = ?, ").concat(CONSTANTS.USER_EMAIL, " = ?, ").concat(CONSTANTS.USER_PHONE, " = ?, ").concat(CONSTANTS.USER_FIRST_NAME, " = ?, ").concat(CONSTANTS.USER_LAST_NAME, " = ? WHERE ").concat(CONSTANTS.USER_ID, " = ?"), [sql.username, sql.email, sql.phone, sql.firstName, sql.lastName, sql.userId], callback);
    }
    /**
     * This function deletes all the passwords of the user and then creates a single password for that same user
     */

  }, {
    key: "setPassword",
    value: function setPassword(sql, callback) {
      _get(_getPrototypeOf(UserDao.prototype), "query", this).call(this, "DELETE FROM ".concat(CONSTANTS.PASSWORD_TABLE, " WHERE ").concat(CONSTANTS.PASSWORD_USER_ID, " = ?;\n        INSERT INTO ").concat(CONSTANTS.PASSWORD_TABLE, " (").concat(CONSTANTS.PASSWORD_PASSWORD, ", ").concat(CONSTANTS.PASSWORD_USER_ID, ", ").concat(CONSTANTS.PASSWORD_AUTOGEN, ") VALUES\n        (UNHEX(?),?,0)"), [sql.userId, sql.password, sql.userId], callback);
    }
    /**UPLOADS AND DOWNLOADS*/

    /**
     * This function uploads a picture to the database
     */

  }, {
    key: "uploadPicture",
    value: function uploadPicture(userId, picture, callback) {
      _get(_getPrototypeOf(UserDao.prototype), "query", this).call(this, "UPDATE ".concat(CONSTANTS.USER_TABLE, " SET ").concat(CONSTANTS.USER_PICTURE, " = ? WHERE ").concat(CONSTANTS.USER_ID, " = ?"), [picture, userId], callback);
    }
  }]);

  return UserDao;
}(_dao["default"]);