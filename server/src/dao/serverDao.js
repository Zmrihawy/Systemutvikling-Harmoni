import Dao from './dao.js';


module.exports = class ServerDao extends Dao {

    getContract(sql, callback) {
        super.query(`SELECT kontrakt FROM opptreden WHERE ${event_id} = ? AND ${user_id} = ?`, [sql.event, sql.artist], callback);
    }

    getEventContracts(sql, callback) {
        super.query(`SELECT * FROM ${performance_table} WHERE ${event_id} = ?`, [sql], callback);
    }

    getUser(sql, callback) {
        super.query(`SELECT * FROM ${user_table} WHERE ${user_email} = ?`, [sql], callback);
    }

    getUsers(sql, callback) {
        super.query(`SELECT * FROM ${user_table}`, [], callback);
    }

    getTickets(sql, callback) {
        super.query(`SELECT * FROM ${ticket_table} WHERE ${event_id} = ?`, [sql], callback);
    }

    getRiders(sql, callback) {
        super.query(`SELECT * FROM ${rider_table} WHERE ${event_id} = ? AND ${user_id} = ?`, [sql.event, sql.artist], callback);
    }

    getEvent(sql, callback) {
        super.query(`SELECT * FROM ${event_table} WHERE ${event_id} = ?`, [sql], callback);
    }

    getAllEvents(callback) {
        super.query(`SELECT * FROM ${event_table}`, [], callback);
    }

    getUsersEvents(sql, callback) {
        super.query(`SELECT * FROM ${event_table} a JOIN ${user_table} b ON a.${event_user_id} = b.${user_id} WHERE aktiv = ?`, [sql.user, sql.active], callback);
    }

    createUser(sql, callback) {
        super.query(`INSERT INTO ${user_table} (${user_username},${user_password},${user_email},${user_phone},${user_first_name},${user_last_name}) 
                    VALUES (?,?,?,?,?,?)`, [sql.username, sql.password, sql.email, sql.phone, sql.firstName, sql.lastName], callback);
    }

    createEvent(sql, callback) {
        //super.query
    }


};
