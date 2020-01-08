const Dao = require("./dao.js");
const Constants = require("./databaseConsts.js");
const CONSTANTS =  new Constants();

module.exports = class UserDao extends Dao {

    getUser(sql, callback) {
        super.query(`SELECT user_id, username, email, phone, first_name, surname, phone 
                            FROM ${CONSTANTS.USER_TABLE} WHERE ${CONSTANTS.USER_EMAIL} = ?`, [sql], callback);
    }

    getPassword(sql, callback) {
        super.query(`SELECT user_id, HEX(password), HEX(salt) FROM ${CONSTANTS.USER_TABLE} WHERE ${CONSTANTS.USER_EMAIL} = ?`)
    }

    getAllUsers(callback) {
        super.query(`SELECT user_id, username FROM ${CONSTANTS.USER_TABLE}`, [], callback);
    }

    createUser(sql, callback) {
        super.query(`INSERT INTO ${CONSTANTS.USER_TABLE} (${CONSTANTS.USER_USERNAME},${CONSTANTS.USER_PASSWORD},${CONSTANTS.USER_SALT},${CONSTANTS.USER_EMAIL},${CONSTANTS.USER_PHONE},${CONSTANTS.USER_FIRST_NAME},${CONSTANTS.USER_LAST_NAME}) 
                    VALUES (?,?,?,?,?,?)`, [sql.username, sql.password, sql.salt, sql.email, sql.phone, sql.firstName, sql.lastName], callback);
    }

    deleteUser(sql, callback) {
        super.query(`DELETE FROM ${CONSTANTS.USER_TABLE} WHERE ${CONSTANTS.USER_ID} = ?`, [sql], callback);
    }

    updatePassword(sql, callback) {
        super.query(`UPDATE ${CONSTANTS.USER_TABLE} SET ${CONSTANTS.USER_PASSWORD} = ? WHERE ${CONSTANTS.USER_ID} = ?`, [sql.password, sql.userId], callback);
    }

    updateUser(sql, callback) {
        let userAtributes = [sql.username, sql.email, sql.phone, sql.firstName, sql.lastName, sql.userId];
        super.query(`UPDATE ${CONSTANTS.USER_TABLE} SET ${CONSTANTS.USER_USERNAME} = ?, ${CONSTANTS.USER_EMAIL} = ?, ${CONSTANTS.USER_PHONE} = ?, ${CONSTANTS.USER_FIRST_NAME}, ${CONSTANTS.USER_LAST_NAME} = ? WHERE ${CONSTANTS.USER_ID} = ?`,
            userAtributes, callback);
    }

};