import Dao from './dao.js';

const arr_id = "arr_id";
const bruker_id = "bruker_id"

module.exports = class ServerDao extends Dao {

    getContract(sql, callback){
        super.query(`SELECT * FROM Kontrakt WHERE ${arr_id} = ? AND ${bruker_id} = ?`, [sql.arr, sql.artist], callback);
    }

    getArrContracts(sql, callback){
        super.query(`SELECT * FROM Kontrakt WHERE ${arr_id} = ?`, [sql], callback);
    }

    getUser(sql, callback){
        super.query(`SELECT * FROM Bruker WHERE email = ?`, [sql], callback);
    }

    getUsers(sql, callback){
        super.query(`SELECT * FROM Bruker`, [], callback);
    }

    getTickets(sql, callback){
        super.query(`SELECT * FROM Bilett WHERE ${arr_id} = ?`, [sql], callback);
    }

    getRiders(sql, callback){
        super.query(`SELECT * FROM Rider WHERE ${arr_id} = ? AND ${bruker_id} = ?`, [sql.arr, sql.artist], callback);
    }

    getEvent(sql, callback){
        super.query(`SELECT * FROM Arrangement WHERE ${arr_id} = ?`, [sql], callback);
    }

    getActiveEvents(sql, callback){
        super.query(`SELECT * FROM Arrangement WHERE ${arr_id} = ? AND active = true`, [sql], callback);
    }

    getAllEvents(callback){
        super.query(`SELECT * FROM Arrangement`, [], callback);
    }

    getUsersEvents(sql, callback){
        super.query(`SELECT * FROM Arrangement LEFT JOIN `)
    }

    getEventWithArtist(sql, callback){

    }




}