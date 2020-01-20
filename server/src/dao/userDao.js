// @flow

import Dao from "./dao.js";
import Constants from "./databaseConsts.js";

const CONSTANTS = new Constants();

module.exports = class UserDao extends Dao {

    getUser(sql: number, callback: (status: number, data : *) => void) :void {
        super.query(`SELECT ${CONSTANTS.USER_ID}, ${CONSTANTS.USER_USERNAME}, ${CONSTANTS.USER_EMAIL}, ${CONSTANTS.USER_PHONE}, ${CONSTANTS.USER_FIRST_NAME}, ${CONSTANTS.USER_LAST_NAME}, ${CONSTANTS.USER_ARTIST}
                    FROM ${CONSTANTS.USER_TABLE} WHERE ${CONSTANTS.USER_ID} = ?`, [sql], callback);
    }

    getPassword(sql : string, callback: (status: number, data : *) => void) :void {
        super.query(`SELECT u.${CONSTANTS.USER_ID}, HEX(p.${CONSTANTS.PASSWORD_PASSWORD}) as ${CONSTANTS.PASSWORD_PASSWORD}, HEX(u.${CONSTANTS.USER_SALT}) as ${CONSTANTS.USER_SALT}, p.${CONSTANTS.PASSWORD_AUTOGEN} FROM ${CONSTANTS.USER_TABLE} u LEFT JOIN ${CONSTANTS.PASSWORD_TABLE} p ON 
        p.${CONSTANTS.USER_ID} = u.${CONSTANTS.PASSWORD_USER_ID} WHERE ${CONSTANTS.USER_EMAIL} = ? ORDER BY p.${CONSTANTS.PASSWORD_AUTOGEN}`, [sql], callback);
    }

    getAllArtists(callback: (status: number, data : *) => void) :void {
        super.query(`SELECT ${CONSTANTS.USER_ID}, ${CONSTANTS.USER_USERNAME} FROM ${CONSTANTS.USER_TABLE} WHERE ${CONSTANTS.USER_ARTIST} = 1`, [], callback);
    }
    
    checkCred(sql : {username: string, email: string}, callback: (status: number, data: *) => void){
        super.query(`SELECT DISTINCT ${CONSTANTS.USER_USERNAME}, ${CONSTANTS.USER_EMAIL} FROM ${CONSTANTS.USER_TABLE} WHERE ${CONSTANTS.USER_USERNAME} = ? OR ${CONSTANTS.USER_EMAIL} = ?`, [sql.username, sql.email], callback);
    }

    createUser(sql: { username: string, salt: string, email: string, phone: string | number, firstName: string, lastName: string, password: string }, callback: (status: number, data: *) => void) :void {
        super.query(`INSERT INTO ${CONSTANTS.USER_TABLE} (${CONSTANTS.USER_USERNAME}, ${CONSTANTS.USER_SALT},${CONSTANTS.USER_EMAIL},${CONSTANTS.USER_PHONE},${CONSTANTS.USER_FIRST_NAME},${CONSTANTS.USER_LAST_NAME}) 
                    VALUES (?,UNHEX(?),?,?,?,?);
                    INSERT INTO ${CONSTANTS.PASSWORD_TABLE} (${CONSTANTS.PASSWORD_ID}, ${CONSTANTS.PASSWORD_PASSWORD}, ${CONSTANTS.PASSWORD_USER_ID}, ${CONSTANTS.PASSWORD_AUTOGEN})
                    VALUES (DEFAULT, UNHEX(?), LAST_INSERT_ID(), 0)`, [sql.username, sql.salt, sql.email, sql.phone, sql.firstName, sql.lastName, sql.password], callback);
    }

    createPassword(sql: { userId: string | number, password: string, autogen: string | number }, callback: (status: number, data: *) => void) :void {
        super.query(`INSERT INTO ${CONSTANTS.PASSWORD_TABLE} (${CONSTANTS.PASSWORD_ID}, ${CONSTANTS.PASSWORD_PASSWORD}, ${CONSTANTS.PASSWORD_USER_ID}, ${CONSTANTS.PASSWORD_AUTOGEN})
        VALUES(DEFAULT, UNHEX(?), ?,?)`, [sql.password, sql.userId, sql.autogen], callback);
    }

    deleteUser(sql: string | number, callback: (status: number, data : *) => void) :void {
        super.query(`DELETE FROM ${CONSTANTS.USER_TABLE} WHERE ${CONSTANTS.USER_ID} = ?`, [sql], callback);
    }

    updatePassword(sql : {password : string, passId : string | number, autogen: string|number}, callback: (status: number, data : *) => void) :void {
        super.query(`UPDATE ${CONSTANTS.PASSWORD_TABLE} SET ${CONSTANTS.PASSWORD_PASSWORD} = UNHEX(?), ${CONSTANTS.PASSWORD_AUTOGEN} = ?  WHERE ${CONSTANTS.PASSWORD_ID} = ?`, [sql.password, sql.autogen, sql.passId], callback);
    }

    updateUser(sql : {username : string, email : string, phone : string |number, firstName : string, lastName : string, userId : string | number, artist: string}, callback: (status: number, data : *) => void) :void {
        super.query(`UPDATE ${CONSTANTS.USER_TABLE} SET ${CONSTANTS.USER_USERNAME} = ?, ${CONSTANTS.USER_EMAIL} = ?, ${CONSTANTS.USER_PHONE} = ?, ${CONSTANTS.USER_FIRST_NAME} = ?, ${CONSTANTS.USER_LAST_NAME} = ?, ${CONSTANTS.USER_ARTIST} = ? WHERE ${CONSTANTS.USER_ID} = ?`,
            [sql.username, sql.email, sql.phone, sql.firstName, sql.lastName, sql.artist, sql.userId], callback);
    }

    checkCred(sql: { username: string, email: string }, callback: (status: number, data: *) => void) :void {
        super.query(`SELECT DISTINCT ${CONSTANTS.USER_USERNAME}, ${CONSTANTS.USER_EMAIL} FROM ${CONSTANTS.USER_TABLE} WHERE ${CONSTANTS.USER_USERNAME} = ? OR ${CONSTANTS.USER_EMAIL} = ?`, [sql.username, sql.email], callback);
    }

    setPassword(sql: { password: string, userId: string | number }, callback: (status: number, data: *) => void) :void {
        super.query(`DELETE FROM ${CONSTANTS.PASSWORD_TABLE} WHERE ${CONSTANTS.PASSWORD_USER_ID} = ?;
        INSERT INTO ${CONSTANTS.PASSWORD_TABLE} (${CONSTANTS.PASSWORD_PASSWORD}, ${CONSTANTS.PASSWORD_USER_ID}, ${CONSTANTS.PASSWORD_AUTOGEN}) VALUES
        (UNHEX(?),?,0)`, [sql.userId, sql.password, sql.userId], callback);
    }

    /**UPLOADS AND DOWNLOADS*/
    downloadPicture(userId: string | number, callback: (status: number, data: *) => void) :void {
        super.query(`SELECT ${CONSTANTS.USER_PICTURE} FROM ${CONSTANTS.USER_TABLE} WHERE ${CONSTANTS.USER_ID} = ?`,
            [userId], callback);
    }

    uploadPicture(userId: string | number, picture: any, callback: (status: number, data: *) => void) :void {
        super.query(`UPDATE ${CONSTANTS.USER_TABLE} SET ${CONSTANTS.USER_PICTURE} = ? WHERE ${CONSTANTS.USER_ID} = ?`,
            [picture, userId], callback);
    }
};