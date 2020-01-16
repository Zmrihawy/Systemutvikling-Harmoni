"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

module.exports =
/*#__PURE__*/
function () {
  function Dao(pool) {
    _classCallCheck(this, Dao);

    // Dependency Injection
    this.pool = pool;
  }

  _createClass(Dao, [{
    key: "query",
    value: function query(sql, params, callback) {
      if (typeof callback != "function") return console.error("callback is not a function");
      console.log(sql);
      this.pool.getConnection(function (err, connection) {
        console.log("dao: connected to database");

        if (err) {
          console.log("dao: error connecting");
          callback(500, {
            error: "feil ved ved oppkobling"
          });
        } else {
          console.log("dao: running sql: " + sql);
          connection.query(sql, params, function (err, rows) {
            connection.release();

            if (err) {
              console.log(err);
              callback(500, {
                errno: err.errno,
                sqlMessage: err.sqlMessage
              });
            } else {
              console.log("dao: returning rows");
              callback(200, rows);
            }
          });
        }
      });
    }
  }]);

  return Dao;
}();