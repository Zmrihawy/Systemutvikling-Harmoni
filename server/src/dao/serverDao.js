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
    deleteUser(sql , callback){
        super.query(`DELETE FROM ${USER_TABLE} WHERE ${USER_EMAIL} = ?`, [sql], callback);
    }

    deleteRider(sql, callback){
        super.query(`DELETE FROM ${RIDER_TABLE} WHERE ${RIDER_PERFORMANCE_ID} = ? AND ${RIDER_NAME}`, [sql], callback);
    }

    deleteEvent(sql, callback){
        super.query(`DELETE FROM ${EVENT_TABLE} WHERE ${EVENT_ID}`, [sql], callback);
    }

    deleteTicket(sql, callback){
        super.query(`DELETE FROM ${TICKET_TABLE} WHERE ${TICKET_NAME} = ? AND ${TICKET_EVENT_ID} = ?`, [sql.name, sql.eventId], callback);
    }

    deletePerformance(sql, callback){
        super.query(`DELETE FROM ${PERFORMANCE_TABLE} WHERE ${PERFORMANCE_ARTIST_ID} = ?`, [sql], callback);
    }

    /**UPDATE*/
    updateUsername(sql, callback) {
        super.query(`UPDATE ${USER_TABLE} SET ${USER_USERNAME} = ? WHERE ${USER_ID} = ?`, [sql.username, sql.userId], callback);
    }

    updatePassword(sql, callback){
        super.query(`UPDATE ${USER_TABLE} SET ${USER_PASSWORD} = ? WHERE ${USER_ID} = ?`, [sql.password, sql.userId], callback);
    }

    updateName(sql, callback){
        super.query(`UPDATE ${USER_TABLE} SET ${USER_FIRST_NAME} = ?, ${USER_LAST_NAME} = ? WHERE ${USER_ID} = ?`, [sql.firstName, sql.lastName, sql.userId], callback);
    }

    updateEmail(sql, callback){
        super.query(`UPDATE ${USER_TABLE} SET ${USER_EMAIL} = ? WHERE ${USER_ID}  = ?`, [sql.email, sql.userId], callback);
    }

    updatePhone(sql, callback){
        super.query(`UPDATE ${USER_TABLE} SET ${USER_PHONE} = ? WHERE ${USER_ID} = ?`, [sql.phone, sql.userId], callback);
    }

    updateUser(sql, callback){
        let userAtributes = [sql.username, sql.salt,sql.email,sql.phone,sql.firstName,sql.lastName, sql.userId];
        super.query(`UPDATE ${USER_TABLE} SET ${USER_USERNAME} = ?, ${USER_EMAIL} = ?, ${USER_PHONE} = ?, ${USER_FIRST_NAME}, ${USER_LAST_NAME} = ? WHERE ${USER_ID} = ?`,
        userAtributes, callback);
    }

    updateTicket(sql, callback){
        super.query(`UPDATE ${TICKET_TABLE} SET ${TICKET_PRICE} = ?, ${TICKET_AMOUNT} = ?, ${TICKET_DESCRIPTION} = ?  WHERE ${TICKET_NAME} = ? AND ${TICKET_EVENT_ID} = ? `
        [sql.ticketPrice, sql.ticketDescription, sql.ticketName, sql.ticketEventId], callback);
    }

    updateRider(sql, callback){
        super.query(`UPDATE ${RIDER_TABLE} SET ${RIDER_NAME} = ?, ${RIDER_AMOUNT} = ? WHERE ${RIDER_PERFORMANCE_ID} and ${RIDER_NAME} = ?`, 
        [sql.name, sql.ammount, sql.performanceId, sql.oldName], callback);
    }

    updatePerformance(sql, callback){
        super.query(`UPDATE ${PERFORMANCE_TABLE} SET ${PERFORMANCE_START_TIME} = ?, ${PERFORMANCE_END_TIME} = ?, ${PERFORMANCE_CONTRACT} = ? WHERE ${PERFORMANCE_ID} = ?`,
        [sql.startTime, sql.endTime, sql.contract, sql.performanceId], callback);
    }

    updateEvent(sql, callback){
        super.query(`UPDATE ${EVENT_TABLE} SET ${EVENT_NAME} = ?, ${EVENT_HOST_ID} = ?, ${EVENT_ACTIVE} = ?, ${EVENT_LOCATION} = ?, ${EVENT_START_TIME} = ?, ${EVENT_END_TIME} = ? WHERE ${EVENT_ID} = ?`,
        [sql.eventHostId, sql.eventActive, sql.eventLocation, sql.eventStartTime, sql.endTime, sql.eventId], callback);
    }

};
