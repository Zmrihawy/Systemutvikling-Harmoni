import Dao from './dao.js';

module.exports = class UserDao extends Dao {

    getUser(sql, callback) {
        super.query(`SELECT * FROM ${USER_TABLE} WHERE ${USER_EMAIL} = ?`, [sql], callback);
    }

    getPassword(sql, callback) {
        super.query(`SELECT HEX(password), HEX(salt) FROM ${USER_TABLE} WHERE ${USER_EMAIL} = ?`)
    }

    getUsers(sql, callback) {
        super.query(`SELECT * FROM ${USER_TABLE}`, [], callback);
    }

    createUser(sql, callback) {
        super.query(`INSERT INTO ${USER_TABLE} (${USER_USERNAME},${USER_PASSWORD},${USER_SALT},${USER_EMAIL},${USER_PHONE},${USER_FIRST_NAME},${USER_LAST_NAME}) 
                    VALUES (?,?,?,?,?,?)`, [sql.username, sql.password, sql.salt, sql.email, sql.phone, sql.firstName, sql.lastName], callback);
    }

    deleteUser(sql, callback) {
        super.query(`DELETE FROM ${USER_TABLE} WHERE ${USER_EMAIL} = ?`, [sql], callback);
    }

    updateUsername(sql, callback) {
        super.query(`UPDATE ${USER_TABLE} SET ${USER_USERNAME} = ? WHERE ${USER_ID} = ?`, [sql.username, sql.userId], callback);
    }

    updatePassword(sql, callback) {
        super.query(`UPDATE ${USER_TABLE} SET ${USER_PASSWORD} = ? WHERE ${USER_ID} = ?`, [sql.password, sql.userId], callback);
    }

    updateName(sql, callback) {
        super.query(`UPDATE ${USER_TABLE} SET ${USER_FIRST_NAME} = ?, ${USER_LAST_NAME} = ? WHERE ${USER_ID} = ?`, [sql.firstName, sql.lastName, sql.userId], callback);
    }

    updateEmail(sql, callback) {
        super.query(`UPDATE ${USER_TABLE} SET ${USER_EMAIL} = ? WHERE ${USER_ID}  = ?`, [sql.email, sql.userId], callback);
    }

    updatePhone(sql, callback) {
        super.query(`UPDATE ${USER_TABLE} SET ${USER_PHONE} = ? WHERE ${USER_ID} = ?`, [sql.phone, sql.userId], callback);
    }

    updateUser(sql, callback) {
        let userAtributes = [sql.username, sql.salt, sql.email, sql.phone, sql.firstName, sql.lastName, sql.userId];
        super.query(`UPDATE ${USER_TABLE} SET ${USER_USERNAME} = ?, ${USER_EMAIL} = ?, ${USER_PHONE} = ?, ${USER_FIRST_NAME}, ${USER_LAST_NAME} = ? WHERE ${USER_ID} = ?`,
            userAtributes, callback);
    }

};