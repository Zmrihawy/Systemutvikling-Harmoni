// @flow

import Constants from "./databaseConsts.js";

const CONSTANTS = new Constants();
import Dao from "./dao.js";

module.exports = class ServerDao extends Dao {

    /**GET*/
    getRiders(sql: number, callback: (status: number, data: *) => void) {
        super.query(`SELECT ${CONSTANTS.RIDER_NAME}, ${CONSTANTS.RIDER_AMOUNT} FROM ${CONSTANTS.RIDER_TABLE} WHERE ${CONSTANTS.RIDER_PERFORMANCE_ID} = ?`, [sql], callback);
    }

    getEvent(sql: number, callback: (status: number, data: *) => void) {
        super.query(`SELECT * FROM ${CONSTANTS.EVENT_TABLE} WHERE ${CONSTANTS.EVENT_ID} = ?`, [sql], callback);
    }

    getAllEvents(callback: (status: number, data: *) => void) {
        super.query(`SELECT * FROM ${CONSTANTS.EVENT_TABLE}`, [], callback);
    }

    getUsersEvents(sql: { userId: string | number, active: string | number }, callback: (status: number, data: *) => void) {
        super.query(`SELECT ${CONSTANTS.EVENT_NAME}, ${CONSTANTS.EVENT_ID},${CONSTANTS.EVENT_START_TIME},${CONSTANTS.EVENT_LOCATION} FROM 
        ${CONSTANTS.EVENT_TABLE} a JOIN ${CONSTANTS.USER_TABLE} b ON a.${CONSTANTS.EVENT_HOST_ID} = b.${CONSTANTS.USER_ID} WHERE b.${CONSTANTS.USER_ID} = ? AND ${CONSTANTS.EVENT_ACTIVE} = ?`, [sql.userId, sql.active], callback);
    }

    getEventPerformancesHost(sql: number, callback: (status: number, data: *) => void): void {
        super.query(`SELECT u.${CONSTANTS.USER_PICTURE}, u.${CONSTANTS.USER_USERNAME}, u.${CONSTANTS.USER_ID}, p.${CONSTANTS.PERFORMANCE_NAME}, p.${CONSTANTS.PERFORMANCE_CONTRACT}, p.${CONSTANTS.PERFORMANCE_START_TIME}, p.${CONSTANTS.PERFORMANCE_END_TIME}, p.${CONSTANTS.PERFORMANCE_ID} 
        FROM ${CONSTANTS.PERFORMANCE_TABLE} as p LEFT JOIN ${CONSTANTS.USER_TABLE} as u ON p.${CONSTANTS.PERFORMANCE_ARTIST_ID} = u.${CONSTANTS.USER_ID} WHERE p.${CONSTANTS.PERFORMANCE_EVENT_ID} = ?`, [sql], callback);
    }

    getEventPerformancesArtist(sql: {eventId: number, userId: string | number}, callback: (status: number, data: *) => void): void {
        super.query(`SELECT * FROM ((SELECT u.${CONSTANTS.USER_PICTURE}, u.${CONSTANTS.USER_USERNAME}, u.${CONSTANTS.USER_ID}, p.${CONSTANTS.PERFORMANCE_NAME}, p.${CONSTANTS.PERFORMANCE_CONTRACT}, p.${CONSTANTS.PERFORMANCE_START_TIME}, p.${CONSTANTS.PERFORMANCE_END_TIME}, p.${CONSTANTS.PERFORMANCE_ID} 
        FROM ${CONSTANTS.PERFORMANCE_TABLE} as p LEFT JOIN ${CONSTANTS.USER_TABLE} as u ON p.${CONSTANTS.PERFORMANCE_ARTIST_ID} = u.${CONSTANTS.USER_ID} WHERE p.${CONSTANTS.PERFORMANCE_EVENT_ID} = ? AND u.${CONSTANTS.USER_ID} = ?) 
        JOIN ( SELECT u2.${CONSTANTS.USER_PICTURE}, u2.${CONSTANTS.USER_USERNAME}, u2.${CONSTANTS.USER_ID}, p2.${CONSTANTS.PERFORMANCE_NAME}, p2.${CONSTANTS.PERFORMANCE_CONTRACT}, p2.${CONSTANTS.PERFORMANCE_START_TIME}, p2.${CONSTANTS.PERFORMANCE_END_TIME}, p2.${CONSTANTS.PERFORMANCE_ID} 
        FROM ${CONSTANTS.PERFORMANCE_TABLE} as p2 LEFT JOIN ${CONSTANTS.USER_TABLE} as u2 ON p2.${CONSTANTS.PERFORMANCE_ARTIST_ID} = u2.${CONSTANTS.USER_ID} WHERE p2.${CONSTANTS.PERFORMANCE_EVENT_ID} = ? AND u2.${CONSTANTS.USER_ID} IS NOT ?))`, [sql.eventId, sql.userId, sql.eventId, sql.userId], callback);
    }

    getTickets(sql: number | string, callback: (status: number, data: *) => void) {
        super.query(`SELECT * FROM ${CONSTANTS.TICKET_TABLE} WHERE ${CONSTANTS.TICKET_EVENT_ID} = ?`, [sql], callback);
    }

    getCrew(sql: number | string, callback: (status: number, data: *) => void) {
        super.query(`SELECT * FROM ${CONSTANTS.CREW_TABLE} WHERE ${CONSTANTS.CREW_EVENT_ID} = ?`, [sql], callback);
    }


    /**CREATE*/
    createEvent(sql: { eventName: string, userId: string | number, location: string, latitude: number, longitude: number, description: string, startTime: string, endTime: string }, callback: (status: number, data: *) => void) {
        super.query(`INSERT INTO ${CONSTANTS.EVENT_TABLE} (${CONSTANTS.EVENT_NAME},${CONSTANTS.EVENT_HOST_ID},${CONSTANTS.EVENT_LOCATION},${CONSTANTS.EVENT_LONGITUDE},${CONSTANTS.EVENT_LATITUDE},
                    ${CONSTANTS.EVENT_DESCRIPTION},${CONSTANTS.EVENT_START_TIME},${CONSTANTS.EVENT_END_TIME}) 
                    VALUES (?,?,?,?,?,?,?,?) `, [sql.eventName, sql.userId, sql.location, Number(sql.longitude), Number(sql.latitude), sql.description, sql.startTime, sql.endTime], callback);
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

    createCrew(sql: { profession: string, name: string, contactInfo: string | number, eventId: string | number }, callback: (status: number, data: *) => void) {
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

    updateEvent(sql: { eventName: string, hostId: string | number, active: string | number, location: string, long: string | number, lat: string | number, description: string, startTime: string | number, endTime: string | number, eventId: string | number }, callback: (status: number, data: *) => void) {
        super.query(`UPDATE ${CONSTANTS.EVENT_TABLE} SET ${CONSTANTS.EVENT_NAME} = ?, ${CONSTANTS.EVENT_HOST_ID} = ?, ${CONSTANTS.EVENT_ACTIVE} = ?, ${CONSTANTS.EVENT_LOCATION} = ?, ${CONSTANTS.EVENT_LONGITUDE} = ?, ${CONSTANTS.EVENT_LATITUDE} = ?,${CONSTANTS.EVENT_DESCRIPTION} = ?, 
            ${CONSTANTS.EVENT_START_TIME} = ?, ${CONSTANTS.EVENT_END_TIME} = ? WHERE ${CONSTANTS.EVENT_ID} = ?`, [sql.eventName, sql.hostId, sql.active, sql.location, Number(sql.long), Number(sql.lat), sql.description, sql.startTime, sql.endTime, sql.eventId], callback);
    }

    updateCrew(sql: { profession: string, name: string, contactInfo: string, crewId: string | number }, callback: (status: number, data: *) => void) {
        super.query(`UPDATE ${CONSTANTS.CREW_TABLE} SET ${CONSTANTS.CREW_PROFESSION} = ?, ${CONSTANTS.CREW_NAME} = ?, ${CONSTANTS.CREW_CONTACT_INFO} = ? WHERE ${CONSTANTS.CREW_ID} = ?`,
            [sql.profession, sql.name, sql.contactInfo, sql.crewId], callback);
    }

};
