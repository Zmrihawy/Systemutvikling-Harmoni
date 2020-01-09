// @flow

import Dao from "./dao.js";
import Constants from "./databaseConsts.js";
const CONSTANTS = new Constants();

module.exports = class UserDao extends Dao {

    getUser(sql: string |number, callback: Function) {
        super.query(`SELECT ${CONSTANTS.USER_ID}, ${CONSTANTS.USER_USERNAME}, ${CONSTANTS.USER_EMAIL}, ${CONSTANTS.USER_PHONE}, ${CONSTANTS.USER_FIRST_NAME}, ${CONSTANTS.USER_LAST_NAME} 
                    FROM ${CONSTANTS.USER_TABLE} WHERE ${CONSTANTS.USER_ID} = ?`, [sql], callback);
    }

    getPassword(sql : string, callback: Function) {
        super.query(`SELECT ${CONSTANTS.USER_ID}, HEX(${CONSTANTS.USER_PASSWORD}) as ${CONSTANTS.USER_PASSWORD} , HEX(${CONSTANTS.USER_SALT}) as ${CONSTANTS.USER_SALT} FROM ${CONSTANTS.USER_TABLE} WHERE ${CONSTANTS.USER_EMAIL} = ?`, [sql], callback);
    }

    getAllUsers(callback: Function) {
        super.query(`SELECT ${CONSTANTS.USER_ID}, ${CONSTANTS.USER_USERNAME} FROM ${CONSTANTS.USER_TABLE}`, [], callback);
    }

    createUser(sql : {username : string, password : string, salt : string, email : string, phone : string | number, firstName : string, lastName : string}, callback: Function) {
        super.query(`INSERT INTO ${CONSTANTS.USER_TABLE} (${CONSTANTS.USER_USERNAME}, ${CONSTANTS.USER_PASSWORD}, ${CONSTANTS.USER_SALT},${CONSTANTS.USER_EMAIL},${CONSTANTS.USER_PHONE},${CONSTANTS.USER_FIRST_NAME},${CONSTANTS.USER_LAST_NAME}) 
                    VALUES (?,UNHEX(?),UNHEX(?),?,?,?,?)`, [sql.username, sql.password, sql.salt, sql.email, sql.phone, sql.firstName, sql.lastName], callback);
    }

    deleteUser(sql: string | number, callback : Function) {
        super.query(`DELETE FROM ${CONSTANTS.USER_TABLE} WHERE ${CONSTANTS.USER_ID} = ?`, [sql], callback);
    }

    updatePassword(sql : {password : string, userId : string | number}, callback: Function) {
        super.query(`UPDATE ${CONSTANTS.USER_TABLE} SET ${CONSTANTS.USER_PASSWORD} = UNHEX(?) WHERE ${CONSTANTS.USER_ID} = ?`, [sql.password, sql.userId], callback);
    }

    updateUser(sql : {username : string, email : string, phone : string |number, firstName : string, lastName : string, userId : string | number}, callback: Function) {
        super.query(`UPDATE ${CONSTANTS.USER_TABLE} SET ${CONSTANTS.USER_USERNAME} = ?, ${CONSTANTS.USER_EMAIL} = ?, ${CONSTANTS.USER_PHONE} = ?, ${CONSTANTS.USER_FIRST_NAME} = ?, ${CONSTANTS.USER_LAST_NAME} = ? WHERE ${CONSTANTS.USER_ID} = ?`,
            [sql.username, sql.email, sql.phone, sql.firstName, sql.lastName, sql.userId], callback);
    }

};