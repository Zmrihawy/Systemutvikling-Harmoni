// @flow

import Constants from "./databaseConsts.js";

const CONSTANTS = new Constants();
import Dao from "./dao.js";

module.exports = class ServerDao extends Dao {

    /**GET*/
    getAllRiders(sql: string | number, callback: (status: number, data: *) => void) {
        super.query((`SELECT ${CONSTANTS.RIDER_NAME}, ${CONSTANTS.RIDER_AMOUNT}, ${CONSTANTS.EVENT_NAME} FROM ${CONSTANTS.RIDER_TABLE} r JOIN ${CONSTANTS.PERFORMANCE_TABLE} p ON p.${CONSTANTS.RIDER_PERFORMANCE_ID} 
        = r.${CONSTANTS.PERFORMANCE_ID} WHERE ${CONSTANTS.EVENT_ID} = ?`), [sql], callback)
    }

    getContract(sql: { eventId: string | number, artistId: string | number }, callback: (status: number, data: *) => void) {
        if (typeof callback != "function" || callback === undefined || callback === null) return console.error("callback is not a function");
        super.query(`SELECT ${CONSTANTS.PERFORMANCE_CONTRACT} FROM ${CONSTANTS.PERFORMANCE_TABLE} WHERE ${CONSTANTS.PERFORMANCE_EVENT_ID} = ? AND ${CONSTANTS.PERFORMANCE_ARTIST_ID} = ?`, [sql.eventId, sql.artistId], callback);
    }

    getEventContracts(sql: string | number, callback: (status: number, data: *) => void) {
        super.query(`SELECT * FROM ${CONSTANTS.PERFORMANCE_TABLE} WHERE ${CONSTANTS.EVENT_ID} = ?`, [sql], callback);
    }

    getRiders(sql: string | number, callback: (status: number, data: *) => void) {
        super.query(`SELECT * FROM ${CONSTANTS.RIDER_TABLE} WHERE ${CONSTANTS.PERFORMANCE_ID} = ?`, [sql], callback);
    }

    getEvent(sql: string | number, callback: (status: number, data: *) => void) {
        // super.query(`SELECT * FROM ${CONSTANTS.EVENT_TABLE} e LEFT JOIN ${CONSTANTS.PERFORMANCE_TABLE} p ON e.${CONSTANTS.EVENT_ID} = p.${CONSTANTS.PERFORMANCE_EVENT_ID}
        //             LEFT JOIN ${CONSTANTS.TICKET_TABLE} t ON e.${CONSTANTS.EVENT_ID} = t.${CONSTANTS.TICKET_EVENT_ID}
        //             LEFT JOIN ${CONSTANTS.CREW_TABLE} c ON e.${CONSTANTS.EVENT_ID} = c.${CONSTANTS.CREW_EVENT_ID}
        //             WHERE e.${CONSTANTS.EVENT_ID} = ?`, [sql], callback);
        super.query(`SELECT * FROM ${CONSTANTS.EVENT_TABLE} WHERE ${CONSTANTS.EVENT_ID} = ?`, [sql], callback);
    }

    getAllEvents(callback: (status: number, data: *) => void) {
        super.query(`SELECT * FROM ${CONSTANTS.EVENT_TABLE}`, [], callback);
    }

    getUsersEvents(sql: { userId: string | number, active: string | number }, callback: (status: number, data: *) => void) {
        super.query(`SELECT ${CONSTANTS.EVENT_NAME},${CONSTANTS.EVENT_HOST_ID},${CONSTANTS.EVENT_START_TIME},${CONSTANTS.EVENT_END_TIME},${CONSTANTS.EVENT_LOCATION} FROM 
        ${CONSTANTS.EVENT_TABLE} a JOIN ${CONSTANTS.USER_TABLE} b ON a.${CONSTANTS.EVENT_HOST_ID} = b.${CONSTANTS.USER_ID} WHERE b.${CONSTANTS.USER_ID} = ? AND ${CONSTANTS.EVENT_ACTIVE} = ?`, [sql.userId, sql.active], callback);
    }

    getPerformance(sql: string | number, callback: (status: number, data: *) => void): void {
        super.query(`SELECT * FROM ${CONSTANTS.PERFORMANCE_TABLE} WHERE ${CONSTANTS.PERFORMANCE_ARTIST_ID} = ?`, [sql], callback);
    }

    getTickets(sql: number | string, callback: (status: number, data: *) => void) {
        super.query(`SELECT * FROM ${CONSTANTS.TICKET_TABLE} WHERE ${CONSTANTS.TICKET_EVENT_ID} = ?`, [sql], callback);
    }

    getCrew(sql: number | string, callback: (status: number, data: *) => void) {
        super.query(`SELECT * FROM ${CONSTANTS.CREW_TABLE} WHERE ${CONSTANTS.CREW_EVENT_ID} = ?`, [sql], callback);
    }


    /**CREATE*/
    createEvent(sql: { name: string, userId: string | number, location: string, category: string, startTime: string, endTime: string }, callback: (status: number, data: *) => void) {
        super.query(`INSERT INTO ${CONSTANTS.EVENT_TABLE} (${CONSTANTS.EVENT_NAME},${CONSTANTS.EVENT_HOST_ID},${CONSTANTS.EVENT_LOCATION},${CONSTANTS.EVENT_CATEGORY},${CONSTANTS.EVENT_START_TIME},${CONSTANTS.EVENT_END_TIME}) 
                    VALUES (?,?,?,?,?) `, [sql.name, sql.userId, sql.location, sql.category, sql.startTime, sql.endTime], callback);
    }

    createTicket(sql: { name: string, eventId: string | number, price: number | string, description: string, amount: string | number }, callback: (status: number, data: *) => void) {
        super.query(`INSERT INTO ${CONSTANTS.TICKET_TABLE} (${CONSTANTS.TICKET_NAME},${CONSTANTS.TICKET_EVENT_ID},${CONSTANTS.TICKET_PRICE},${CONSTANTS.TICKET_DESCRIPTION},${CONSTANTS.TICKET_AMOUNT}) 
                    VALUES (?,?,?,?,?) `, [sql.name, sql.eventId, sql.price, sql.description, sql.amount], callback);
    }

    createPerformance(sql: { artistId: string | number, eventId: string | number, startTime: string, endTime: string, contract: string }, callback: (status: number, data: *) => void) {
        super.query(`INSERT INTO ${CONSTANTS.PERFORMANCE_TABLE} (${CONSTANTS.PERFORMANCE_ARTIST_ID},${CONSTANTS.PERFORMANCE_EVENT_ID},${CONSTANTS.PERFORMANCE_START_TIME},${CONSTANTS.PERFORMANCE_END_TIME},
                    ${CONSTANTS.PERFORMANCE_CONTRACT}) VALUES (?,?,?,?,?) `, [sql.artistId, sql.eventId, sql.startTime, sql.endTime, sql.contract], callback);
    }

    createRider(sql: { performanceId: string | number, name: string, amount: string | number }, callback: (status: number, data: *) => void) {
        super.query(`INSERT INTO ${CONSTANTS.RIDER_TABLE} VALUES (?,?,?) `,
            [sql.performanceId, sql.name, sql.amount], callback);
    }

    createCrew(sql: { profession: string, name: string, contactInfo: string | number , eventId: string | number}, callback: (status: number, data: *) => void) {
        super.query(`INSERT INTO ${CONSTANTS.CREW_TABLE} (${CONSTANTS.CREW_PROFESSION},${CONSTANTS.CREW_NAME},${CONSTANTS.CREW_CONTACT_INFO},${CONSTANTS.CREW_EVENT_ID}) 
                    VALUES (?,?,?,?) `, [sql.profession, sql.name, sql.contactInfo, sql.eventId], callback);
    }

    /**DELETE*/
    deleteRider(sql: { performanceId: string | number, name: string }, callback: (status: number, data: *) => void) {
        super.query(`DELETE FROM ${CONSTANTS.RIDER_TABLE} WHERE ${CONSTANTS.RIDER_PERFORMANCE_ID} = ? AND ${CONSTANTS.RIDER_NAME} = ?`, [sql.performanceId, sql.name], callback);
    }

    deleteEvent(sql: string, callback: (status: number, data: *) => void) {
        super.query(`DELETE FROM ${CONSTANTS.EVENT_TABLE} WHERE ${CONSTANTS.EVENT_ID} = ?`, [sql], callback);
    }

    deleteTicket(sql: { name: string, eventId: string | number }, callback: (status: number, data: *) => void) {
        super.query(`DELETE FROM ${CONSTANTS.TICKET_TABLE} WHERE ${CONSTANTS.TICKET_NAME} = ? AND ${CONSTANTS.TICKET_EVENT_ID} = ?`, [sql.name, sql.eventId], callback);
    }

    deletePerformance(sql: string, callback: (status: number, data: *) => void) {
        super.query(`DELETE FROM ${CONSTANTS.PERFORMANCE_TABLE} WHERE ${CONSTANTS.PERFORMANCE_ARTIST_ID} = ?`, [sql], callback);
    }

    deleteCrew(sql: string, callback: (status: number, data: *) => void) {
        super.query(`DELETE FROM ${CONSTANTS.CREW_TABLE} WHERE ${CONSTANTS.CREW_ID} = ?`, [sql], callback);
    }

    /**UPDATE*/
    updateTicket(sql: { price: string | number, amount: string | number, description: string, name: string, eventId: string | number }, callback: (status: number, data: *) => void) {
        super.query(`UPDATE ${CONSTANTS.TICKET_TABLE} SET ${CONSTANTS.TICKET_PRICE} = ?, ${CONSTANTS.TICKET_AMOUNT} = ?, ${CONSTANTS.TICKET_DESCRIPTION} = ?  WHERE ${CONSTANTS.TICKET_NAME} = ? AND ${CONSTANTS.TICKET_EVENT_ID} = ? `,
            [sql.price, sql.amount, sql.description, sql.name, sql.eventId], callback);
    }

    updateRider(sql: { name: string, amount: string | number, performanceId: string | number, oldName: string }, callback: (status: number, data: *) => void) {
        super.query(`UPDATE ${CONSTANTS.RIDER_TABLE} SET ${CONSTANTS.RIDER_NAME} = ?, ${CONSTANTS.RIDER_AMOUNT} = ? WHERE ${CONSTANTS.RIDER_PERFORMANCE_ID} = ? and ${CONSTANTS.RIDER_NAME} = ?`,
            [sql.name, sql.amount, sql.performanceId, sql.oldName], callback);
    }

    updatePerformance(sql: { startTime: string, endTime: string, contract: string, performanceId: string | number }, callback: (status: number, data: *) => void) {
        super.query(`UPDATE ${CONSTANTS.PERFORMANCE_TABLE} SET ${CONSTANTS.PERFORMANCE_START_TIME} = ?, ${CONSTANTS.PERFORMANCE_END_TIME} = ?, ${CONSTANTS.PERFORMANCE_CONTRACT} = ? WHERE ${CONSTANTS.PERFORMANCE_ID} = ?`,
            [sql.startTime, sql.endTime, sql.contract, sql.performanceId], callback);
    }

    updateEvent(sql: { eventName: string, hostId: string | number, active: string | number, location: string, startTime: string | number, endTime: string | number, eventId: string | number }, callback: (status: number, data: *) => void) {
        super.query(`UPDATE ${CONSTANTS.EVENT_TABLE} SET ${CONSTANTS.EVENT_NAME} = ?, ${CONSTANTS.EVENT_HOST_ID} = ?, ${CONSTANTS.EVENT_ACTIVE} = ?, ${CONSTANTS.EVENT_LOCATION} = ?, ${CONSTANTS.EVENT_CATEGORY} = ?, 
            ${CONSTANTS.EVENT_START_TIME} = ?, ${CONSTANTS.EVENT_END_TIME} = ? WHERE ${CONSTANTS.EVENT_ID} = ?`, [sql.eventName, sql.hostId, sql.active, sql.location, sql.category, sql.startTime, sql.endTime, sql.eventId], callback);
    }

    updateCrew(sql: { profession: string, name: string, contactInfo: string, crewId: string | number }, callback: (status: number, data: *) => void) {
        super.query(`UPDATE ${CONSTANTS.CREW_TABLE} SET ${CONSTANTS.CREW_PROFESSION} = ?, ${CONSTANTS.CREW_NAME} = ?, ${CONSTANTS.CREW_CONTACT_INFO} = ? WHERE ${CONSTANTS.CREW_ID} = ?`,
            [sql.profession, sql.name, sql.contactInfo, sql.crewId], callback);
    }

};
