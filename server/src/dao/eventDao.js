// @flow

import Constants from "./databaseConsts.js";

const CONSTANTS = new Constants();
import Dao from "./dao.js";

module.exports = class ServerDao extends Dao {

    /**GET*/
    getEventParticipants(sql: number, callback: (status: number, data: *) => void) :void{
        super.query(`SELECT p.${CONSTANTS.PERFORMANCE_ARTIST_ID}, e.${CONSTANTS.EVENT_HOST_ID} FROM ${CONSTANTS.EVENT_TABLE} e LEFT JOIN ${CONSTANTS.PERFORMANCE_TABLE} p 
        ON p.${CONSTANTS.PERFORMANCE_EVENT_ID} = e.${CONSTANTS.EVENT_ID} WHERE e.${CONSTANTS.EVENT_ID} = ?`, [sql], callback);
    }

    getRiders(sql: number, callback: (status: number, data: *) => void) :void {
        super.query(`SELECT * FROM ${CONSTANTS.RIDER_TABLE} WHERE ${CONSTANTS.RIDER_PERFORMANCE_ID} = ?`, [sql], callback);
    }

    getEvent(sql: number, callback: (status: number, data: *) => void) :void {
        super.query(`SELECT e.*, u.${CONSTANTS.USER_USERNAME} FROM ${CONSTANTS.EVENT_TABLE} as e 
        JOIN ${CONSTANTS.USER_TABLE} as u ON e.${CONSTANTS.EVENT_HOST_ID} = u.${CONSTANTS.USER_ID} WHERE ${CONSTANTS.EVENT_ID} = ?`, [sql], callback);
    }

    getUserEvents(sql: { userId: string | number, active: string | number }, callback: (status: number, data: *) => void) :void {
        super.query(`SELECT ${CONSTANTS.EVENT_NAME}, ${CONSTANTS.EVENT_ID},${CONSTANTS.EVENT_START_TIME}, ${CONSTANTS.EVENT_END_TIME}, ${CONSTANTS.EVENT_LOCATION} FROM
        ${CONSTANTS.EVENT_TABLE} a JOIN ${CONSTANTS.USER_TABLE} b ON a.${CONSTANTS.EVENT_HOST_ID} = b.${CONSTANTS.USER_ID} WHERE b.${CONSTANTS.USER_ID} = ? AND ${CONSTANTS.EVENT_ACTIVE} = ?`, [sql.userId, sql.active], callback);
    }

    getEventPerformances(sql: number, callback: (status: number, data: *) => void) :void {
        super.query(`SELECT ${CONSTANTS.USER_USERNAME}, u.${CONSTANTS.USER_ID}, ${CONSTANTS.USER_PICTURE}, ${CONSTANTS.PERFORMANCE_NAME}, ${CONSTANTS.PERFORMANCE_START_TIME}, ${CONSTANTS.PERFORMANCE_END_TIME}, ${CONSTANTS.PERFORMANCE_ID} 
        FROM ${CONSTANTS.PERFORMANCE_TABLE} as p LEFT JOIN ${CONSTANTS.USER_TABLE} as u ON p.${CONSTANTS.PERFORMANCE_ARTIST_ID} = u.${CONSTANTS.USER_ID} WHERE ${CONSTANTS.PERFORMANCE_EVENT_ID} = ?`, [sql], callback);
    }

    getTickets(sql: number | string, callback: (status: number, data: *) => void) :void {
        super.query(`SELECT * FROM ${CONSTANTS.TICKET_TABLE} WHERE ${CONSTANTS.TICKET_EVENT_ID} = ?`, [sql], callback);
    }

    getCrew(sql: number | string, callback: (status: number, data: *) => void) :void {
        super.query(`SELECT * FROM ${CONSTANTS.CREW_TABLE} WHERE ${CONSTANTS.CREW_EVENT_ID} = ?`, [sql], callback);
    }

    /**CREATE*/
    createEvent(sql: { eventName: string, userId: string | number, location: string, latitude: number, longitude: number, description: string, startTime: string, endTime: string, picture: string }, callback: (status: number, data: *) => void) :void {
        super.query(`INSERT INTO ${CONSTANTS.EVENT_TABLE} (${CONSTANTS.EVENT_NAME},${CONSTANTS.EVENT_HOST_ID},${CONSTANTS.EVENT_LOCATION},${CONSTANTS.EVENT_LONGITUDE},${CONSTANTS.EVENT_LATITUDE}, ${CONSTANTS.EVENT_PICTURE},
                    ${CONSTANTS.EVENT_DESCRIPTION},${CONSTANTS.EVENT_START_TIME},${CONSTANTS.EVENT_END_TIME},${CONSTANTS.EVENT_ACTIVE}) 
                    VALUES (?,?,?,?,?,?,?,?,?,1) `, [sql.eventName, sql.userId, sql.location, Number(sql.longitude), Number(sql.latitude), sql.picture, sql.description, sql.startTime, sql.endTime], callback);
    }

    createTicket(sql: { name: string, eventId: string | number, price: number | string, amount: string | number }, callback: (status: number, data: *) => void) :void {
        super.query(`INSERT INTO ${CONSTANTS.TICKET_TABLE} (${CONSTANTS.TICKET_NAME},${CONSTANTS.TICKET_EVENT_ID},${CONSTANTS.TICKET_PRICE},${CONSTANTS.TICKET_AMOUNT}) 
                    VALUES (?,?,?,?) `, [sql.name, sql.eventId, sql.price, sql.amount], callback);
    }

    createPerformance(sql: { artistId: string | number, eventId: string | number, startTime: string, endTime: string, name: string }, callback: (status: number, data: *) => void) :void {
        super.query(`INSERT INTO ${CONSTANTS.PERFORMANCE_TABLE} (${CONSTANTS.PERFORMANCE_ARTIST_ID},${CONSTANTS.PERFORMANCE_EVENT_ID},${CONSTANTS.PERFORMANCE_START_TIME},${CONSTANTS.PERFORMANCE_END_TIME},${CONSTANTS.PERFORMANCE_NAME}) VALUES (?,?,?,?,?) `
        , [sql.artistId, sql.eventId, sql.startTime, sql.endTime, sql.name], callback);
    }

    createRider(sql: { performanceId: string | number, name: string, amount: string | number, confirmed: string | number }, callback: (status: number, data: *) => void) :void {
        super.query(`INSERT INTO ${CONSTANTS.RIDER_TABLE} VALUES (?,?,?) `,
            [sql.performanceId, sql.name, sql.amount, sql.confirmed], callback);
    }

    createCrew(sql: { profession: string, name: string, contactInfo: string | number, eventId: string | number }, callback: (status: number, data: *) => void) :void {
        super.query(`INSERT INTO ${CONSTANTS.CREW_TABLE} (${CONSTANTS.CREW_PROFESSION},${CONSTANTS.CREW_NAME},${CONSTANTS.CREW_CONTACT_INFO},${CONSTANTS.CREW_EVENT_ID}) 
                    VALUES (?,?,?,?) `, [sql.profession, sql.name, sql.contactInfo, sql.eventId], callback);
    }

    /**DELETE*/
    deleteRider(sql: { performanceId: string | number, name: string }, callback: (status: number, data: *) => void) :void {
        super.query(`DELETE FROM ${CONSTANTS.RIDER_TABLE} WHERE ${CONSTANTS.RIDER_PERFORMANCE_ID} = ? AND ${CONSTANTS.RIDER_NAME} = ?`, [sql.performanceId, sql.name], callback);
    }

    deleteEvent(sql: string, callback: (status: number, data: *) => void) :void {
        super.query(`DELETE FROM ${CONSTANTS.EVENT_TABLE} WHERE ${CONSTANTS.EVENT_ID} = ?`, [sql], callback);
    }

    deleteTicket(sql: { name: string, eventId: string | number }, callback: (status: number, data: *) => void) :void {
        super.query(`DELETE FROM ${CONSTANTS.TICKET_TABLE} WHERE ${CONSTANTS.TICKET_NAME} = ? AND ${CONSTANTS.TICKET_EVENT_ID} = ?`, [sql.name, sql.eventId], callback);
    }

    deletePerformance(sql: string, callback: (status: number, data: *) => void) :void {
        super.query(`DELETE FROM ${CONSTANTS.PERFORMANCE_TABLE} WHERE ${CONSTANTS.PERFORMANCE_ARTIST_ID} = ?`, [sql], callback);
    }

    deleteCrew(sql: string, callback: (status: number, data: *) => void) :void {
        super.query(`DELETE FROM ${CONSTANTS.CREW_TABLE} WHERE ${CONSTANTS.CREW_ID} = ?`, [sql], callback);
    }

    /**UPDATE*/
    updateTicket(sql: { price: string | number, amount: string | number, name: string, eventId: string | number, oldName: string }, callback: (status: number, data: *) => void) :void {
        super.query(`UPDATE ${CONSTANTS.TICKET_TABLE} SET ${CONSTANTS.TICKET_PRICE} = ?, ${CONSTANTS.TICKET_AMOUNT} = ?, ${CONSTANTS.TICKET_NAME} = ? WHERE ${CONSTANTS.TICKET_NAME} = ? AND ${CONSTANTS.TICKET_EVENT_ID} = ? `,
            [sql.price, sql.amount, sql.name, sql.oldName, sql.eventId], callback);
    }

    updateRider(sql: { name: string, amount: string | number, performanceId: string | number, oldName: string }, callback: (status: number, data: *) => void) :void {
        super.query(`UPDATE ${CONSTANTS.RIDER_TABLE} SET ${CONSTANTS.RIDER_NAME} = ?, ${CONSTANTS.RIDER_AMOUNT} = ? , ${CONSTANTS.RIDER_CONFIRMED} = 1 WHERE ${CONSTANTS.RIDER_PERFORMANCE_ID} = ? and ${CONSTANTS.RIDER_NAME} = ?`,
            [sql.name, sql.amount, sql.performanceId, sql.oldName], callback);
    }

    updatePerformance(sql: { startTime: string, endTime: string, name: string, performanceId: string | number }, callback: (status: number, data: *) => void) :void {
        super.query(`UPDATE ${CONSTANTS.PERFORMANCE_TABLE} SET ${CONSTANTS.PERFORMANCE_START_TIME} = ?, ${CONSTANTS.PERFORMANCE_END_TIME} = ?, ${CONSTANTS.PERFORMANCE_NAME} = ? WHERE ${CONSTANTS.PERFORMANCE_ID} = ?`,
            [sql.startTime, sql.endTime, sql.name, sql.performanceId], callback);
    }

    updateEvent(sql: { eventName: string, active: string | number, location: string, longitude: string | number, latitude: string | number, description: string, startTime: string | number, endTime: string | number, eventId: string | number }, callback: (status: number, data: *) => void) :void {
        super.query(`UPDATE ${CONSTANTS.EVENT_TABLE} SET ${CONSTANTS.EVENT_NAME} = ?, ${CONSTANTS.EVENT_ACTIVE} = ?, ${CONSTANTS.EVENT_LOCATION} = ?, ${CONSTANTS.EVENT_LONGITUDE} = ?, ${CONSTANTS.EVENT_LATITUDE} = ?,${CONSTANTS.EVENT_DESCRIPTION} = ?, 
            ${CONSTANTS.EVENT_START_TIME} = ?, ${CONSTANTS.EVENT_END_TIME} = ? WHERE ${CONSTANTS.EVENT_ID} = ?`, [sql.eventName, sql.active, sql.location, Number(sql.longitude), Number(sql.latitude), sql.description, sql.startTime, sql.endTime, sql.eventId], callback);
    }

    updateCrew(sql: { profession: string, name: string, contactInfo: string, crewId: string | number }, callback: (status: number, data: *) => void) :void {
        super.query(`UPDATE ${CONSTANTS.CREW_TABLE} SET ${CONSTANTS.CREW_PROFESSION} = ?, ${CONSTANTS.CREW_NAME} = ?, ${CONSTANTS.CREW_CONTACT_INFO} = ? WHERE ${CONSTANTS.CREW_ID} = ?`,
            [sql.profession, sql.name, sql.contactInfo, sql.crewId], callback);
    }


    /**UPLOADS AND DOWNLOADS*/
    uploadContract(performanceId: string | number, contract: any, callback: (status: number, data: *) => void) :void {
        super.query(`UPDATE ${CONSTANTS.PERFORMANCE_TABLE} SET ${CONSTANTS.PERFORMANCE_CONTRACT} = ? WHERE ${CONSTANTS.PERFORMANCE_ID} = ?`,
            [contract, performanceId], callback);
    }

    downloadContract(performanceId: string | number, callback: (status: number, data: *) => void) :void {
        super.query(`SELECT ${CONSTANTS.PERFORMANCE_CONTRACT} FROM ${CONSTANTS.PERFORMANCE_TABLE} WHERE ${CONSTANTS.PERFORMANCE_ID} = ?`, [performanceId], callback);
    }

    uploadPicture(eventId: string | number, picture: any, callback: (status: number, data: *) => void) :void {
        super.query(`UPDATE ${CONSTANTS.EVENT_TABLE} SET ${CONSTANTS.EVENT_PICTURE} = ? WHERE ${CONSTANTS.EVENT_ID} = ?`,
            [picture, eventId], callback);
    }
};
