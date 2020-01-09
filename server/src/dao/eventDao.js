// @flow

const Constants = require("./databaseConsts.js");
const CONSTANTS =  new Constants();
const Dao = require("./dao.js");

module.exports = class ServerDao extends Dao {

    /**GET*/
    getPerformance(sql :string | number, callback: Function) {
        super.query(`SELECT * FROM ${CONSTANTS.PERFORMANCE_TABLE} WHERE ${CONSTANTS.PERFORMANCE_ARTIST_ID} = ?`, [sql], callback);
    }

    getContract(sql : {eventId: string | number, artistId: string | number}, callback: Function) {
        super.query(`SELECT ${CONSTANTS.PERFORMANCE_CONTRACT} FROM ${CONSTANTS.PERFORMANCE_TABLE} WHERE ${CONSTANTS.PERFORMANCE_EVENT_ID} = ? AND ${CONSTANTS.PERFORMANCE_ARTIST_ID} = ?`, [sql.eventId, sql.artistId], callback);
    }

    getEventContracts(sql: string | number , callback: Function) {
        super.query(`SELECT * FROM ${CONSTANTS.PERFORMANCE_TABLE} WHERE ${CONSTANTS.EVENT_ID} = ?`, [sql], callback);
    }

    getEventTickets(sql : number | string, callback) {
        super.query(`SELECT * FROM ${CONSTANTS.TICKET_TABLE} WHERE ${CONSTANTS.EVENT_ID} = ?`, [sql], callback);
    }

    getPerformanceRiders(sql, callback) {
        super.query(`SELECT * FROM ${CONSTANTS.RIDER_TABLE} WHERE ${CONSTANTS.PERFORMANCE_ID} = ?`, [sql], callback);
    }

    getEvent(sql, callback) {
        super.query(`SELECT * FROM ${CONSTANTS.EVENT_TABLE} WHERE ${CONSTANTS.EVENT_ID} = ?`, [sql], callback);
    }

    getAllEvents(callback) {
        super.query(`SELECT * FROM ${CONSTANTS.EVENT_TABLE}`, [], callback);
    }

    getUsersEvents(sql, callback) {
        super.query(`SELECT * FROM ${CONSTANTS.EVENT_TABLE} a JOIN ${CONSTANTS.USER_TABLE} b ON a.${CONSTANTS.EVENT_HOST_ID} = b.${CONSTANTS.USER_ID} WHERE aktiv = ?`, [sql.userId, sql.active], callback);
    }

    /**CREATE*/
    createEvent(sql, callback) {
        super.query(`INSERT INTO ${CONSTANTS.EVENT_TABLE} (${CONSTANTS.EVENT_NAME},${CONSTANTS.EVENT_HOST_ID},${CONSTANTS.EVENT_START_TIME},${CONSTANTS.EVENT_END_TIME},${CONSTANTS.EVENT_LOCATION}) 
                    VALUES (?,?,?,?,?) `, [sql.name, sql.userId, sql.startTime, sql.endTime, sql.location], callback);
    }

    createTicket(sql, callback) {
        super.query(`INSERT INTO ${CONSTANTS.TICKET_TABLE} (${CONSTANTS.TICKET_NAME},${CONSTANTS.TICKET_EVENT_ID},${CONSTANTS.TICKET_PRICE},${CONSTANTS.TICKET_DESCRIPTION},${CONSTANTS.TICKET_AMOUNT}) 
                    VALUES (?,?,?,?,?) `, [sql.name, sql.eventId, sql.price, sql.description, sql.amount], callback);
    }

    createPerformance(sql, callback) {
        super.query(`INSERT INTO ${CONSTANTS.PERFORMANCE_TABLE} (${CONSTANTS.PERFORMANCE_ARTIST_ID},${CONSTANTS.PERFORMANCE_EVENT_ID},${CONSTANTS.PERFORMANCE_START_TIME},${CONSTANTS.PERFORMANCE_END_TIME},
                    ${CONSTANTS.PERFORMANCE_CONTRACT}) VALUES (?,?,?,?,?) `, [sql.artistId, sql.eventId, sql.startTime, sql.endTime, sql.contract], callback);
    }

    createRider(sql, callback) {
        super.query(`INSERT INTO ${CONSTANTS.RIDER_TABLE} VALUES (?,?,?) `,
            [sql.performanceId, sql.name, sql.amount], callback);
    }

    /**DELETE*/
    deleteRider(sql, callback) {
        super.query(`DELETE FROM ${CONSTANTS.RIDER_TABLE} WHERE ${CONSTANTS.RIDER_PERFORMANCE_ID} = ? AND ${CONSTANTS.RIDER_NAME} = ?`, [sql.performanceId, sql.name], callback);
    }

    deleteEvent(sql, callback) {
        super.query(`DELETE FROM ${CONSTANTS.EVENT_TABLE} WHERE ${CONSTANTS.EVENT_ID} = ?`, [sql], callback);
    }

    deleteTicket(sql, callback) {
        super.query(`DELETE FROM ${CONSTANTS.TICKET_TABLE} WHERE ${CONSTANTS.TICKET_NAME} = ? AND ${CONSTANTS.TICKET_EVENT_ID} = ?`, [sql.name, sql.eventId], callback);
    }

    deletePerformance(sql, callback) {
        super.query(`DELETE FROM ${CONSTANTS.PERFORMANCE_TABLE} WHERE ${CONSTANTS.PERFORMANCE_ARTIST_ID} = ?`, [sql], callback);
    }

    /**UPDATE*/
    updateTicket(sql :string, callback: Function) {
        super.query(`UPDATE ${CONSTANTS.TICKET_TABLE} SET ${CONSTANTS.TICKET_PRICE} = ?, ${CONSTANTS.TICKET_AMOUNT} = ?, ${CONSTANTS.TICKET_DESCRIPTION} = ?  WHERE ${CONSTANTS.TICKET_NAME} = ? AND ${CONSTANTS.TICKET_EVENT_ID} = ? `,
            [sql.price, sql.amount, sql.description, sql.name, sql.eventId], callback);
    }

    updateRider(sql :string, callback: Function) {
        super.query(`UPDATE ${CONSTANTS.RIDER_TABLE} SET ${CONSTANTS.RIDER_NAME} = ?, ${CONSTANTS.RIDER_AMOUNT} = ? WHERE ${CONSTANTS.RIDER_PERFORMANCE_ID} = ? and ${CONSTANTS.RIDER_NAME} = ?`,
            [sql.name, sql.amount, sql.performanceId, sql.oldName], callback);
    }

    updatePerformance(sql, callback) {
        super.query(`UPDATE ${CONSTANTS.PERFORMANCE_TABLE} SET ${CONSTANTS.PERFORMANCE_START_TIME} = ?, ${CONSTANTS.PERFORMANCE_END_TIME} = ?, ${CONSTANTS.PERFORMANCE_CONTRACT} = ? WHERE ${CONSTANTS.PERFORMANCE_ID} = ?`,
            [sql.startTime, sql.endTime, sql.contract, sql.performanceId], callback);
    }

    updateEvent(sql, callback) {
        super.query(`UPDATE ${CONSTANTS.EVENT_TABLE} SET ${CONSTANTS.EVENT_NAME} = ?, ${CONSTANTS.EVENT_HOST_ID} = ?, ${CONSTANTS.EVENT_ACTIVE} = ?, ${CONSTANTS.EVENT_LOCATION} = ?, ${CONSTANTS.EVENT_START_TIME} = ?,
            ${CONSTANTS.EVENT_END_TIME} = ? WHERE ${CONSTANTS.EVENT_ID} = ?`, [sql.eventName ,sql.hostId, sql.active, sql.location, sql.startTime, sql.endTime, sql.eventId], callback);
    }

    updateContract(sql, callback) {
        super.query(`UPDATE ${CONSTANTS.EVENT_TABLE} SET ${CONSTANTS.EVENT_NAME} = ?, ${CONSTANTS.EVENT_HOST_ID} = ?, ${CONSTANTS.EVENT_ACTIVE} = ?, ${CONSTANTS.EVENT_LOCATION} = ?, ${CONSTANTS.EVENT_START_TIME} = ?,
            ${CONSTANTS.EVENT_END_TIME} = ? WHERE ${CONSTANTS.EVENT_ID} = ?`, [sql.hostId, sql.active, sql.location, sql.startTime, sql.endTime, sql.eventId], callback);
    }

};
