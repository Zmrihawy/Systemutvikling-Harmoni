import Dao from './dao.js';


module.exports = class ServerDao extends Dao {

    /**GET*/
    getContract(sql, callback) {
        super.query(`SELECT ${PERFORMANCE_CONTRACT} FROM ${PERFORMANCE_TABLE} WHERE ${PERFORMANCE_EVENT_ID} = ? AND ${PERFORMANCE_ARTIST_ID} = ?`, [sql.event, sql.artist], callback);
    }

    getEventContracts(sql, callback) {
        super.query(`SELECT * FROM ${PERFORMANCE_TABLE} WHERE ${EVENT_ID} = ?`, [sql], callback);
    }

    getUser(sql, callback) {
        super.query(`SELECT * FROM ${USER_TABLE} WHERE ${USER_EMAIL} = ?`, [sql], callback);
    }

    getUsers(sql, callback) {
        super.query(`SELECT * FROM ${USER_TABLE}`, [], callback);
    }

    getTickets(sql, callback) {
        super.query(`SELECT * FROM ${TICKET_TABLE} WHERE ${EVENT_ID} = ?`, [sql], callback);
    }

    getRiders(sql, callback) {
        super.query(`SELECT * FROM ${RIDER_TABLE} WHERE ${EVENT_ID} = ? AND ${USER_ID} = ?`, [sql.event, sql.artist], callback);
    }

    getEvent(sql, callback) {
        super.query(`SELECT * FROM ${EVENT_TABLE} WHERE ${EVENT_ID} = ?`, [sql], callback);
    }

    getAllEvents(callback) {
        super.query(`SELECT * FROM ${EVENT_TABLE}`, [], callback);
    }

    getUsersEvents(sql, callback) {
        super.query(`SELECT * FROM ${EVENT_TABLE} a JOIN ${USER_TABLE} b ON a.${EVENT_HOST_ID} = b.${USER_ID} WHERE aktiv = ?`, [sql.user, sql.active], callback);
    }

    /**CREATE*/
    createUser(sql, callback) {
        super.query(`INSERT INTO ${USER_TABLE} (${USER_USERNAME},${USER_PASSWORD},${USER_SALT},${USER_EMAIL},${USER_PHONE},${USER_FIRST_NAME},${USER_LAST_NAME}) 
                    VALUES (?,?,?,?,?,?)`, [sql.username, sql.password, sql.salt, sql.email, sql.phone, sql.firstName, sql.lastName], callback);
    }

    createEvent(sql, callback) {
        super.query(`INSERT INTO ${EVENT_TABLE} (${EVENT_NAME},${EVENT_HOST_ID},${EVENT_START_TIME},${EVENT_END_TIME},${EVENT_LOCATION}) 
                    VALUES (?,?,?) `, [sql.name, sql.userId, sql.startTime, sql.endTime, sql.location], callback);
    }

    createTicket(sql, callback) {
        super.query(`INSERT INTO ${TICKET_TABLE} (${TICKET_NAME},${TICKET_EVENT_ID},${TICKET_PRICE},${TICKET_DESCRIPTION},${TICKET_AMOUNT}) 
                    VALUES (?,?,?,?,?) `, [sql.name, sql.eventId, sql.price, sql.description, sql.amount], callback);
    }

    createPerformance(sql, callback) {
        super.query(`INSERT INTO ${PERFORMANCE_TABLE} (${PERFORMANCE_ARTIST_ID},${PERFORMANCE_EVENT_ID},${PERFORMANCE_START_TIME},${PERFORMANCE_END_TIME}
                    ${PERFORMANCE_CONTRACT}) VALUES (?,?,?,?) `, [sql.artistId, sql.eventId, sql.startTime, sql.endTime, sql.contract], callback);
    }

    createRiders(sql, callback) {
        super.query(`INSERT INTO ${RIDER_TABLE} (${RIDER_PERFORMANCE_ID},${RIDER_DESCRIPTION}) VALUES (?,?) `,
            [sql.performanceId, sql.description], callback);
    }

    /**DELETE*/
    deleteUser(){

    }

    /**UPDATE*/
    updateUsername() {

    }

};
