// @flow

module.exports = class Dao {
    pool : *;
    constructor(pool : *) {
      // Dependency Injection
      this.pool = pool;
    }
  
    query(sql: string, params: Array<mixed>, callback: (res : *, data: *) => void){
  
      if(typeof callback != "function") return console.error("callback is not a function");

      this.pool.getConnection((err, connection) => {
        // console.log("dao: connected to database");
        if (err) {
          console.log("dao: error connecting");
          callback(500, { error: "feil ved ved oppkobling" });
        } else {
          console.log("dao: running sql: " + sql);
          connection.query(sql, params, (err, rows) => {
            connection.release();
            if (err) {
              console.log(err);
              callback(500, { errno: err.errno, error: err.sqlMessage});
            } else {
              // console.log("dao: returning rows");
              callback(200, rows);
            }
          });
        }
      });
    }
  };