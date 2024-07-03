'use strict';

const { Airplane, Seat } = require('./pc');

const dayjs = require('dayjs');
const sqlite = require('sqlite3');
const db = require('./db') ;





function listAirplanes() {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM airplanes';
        db.all(sql, (err, rows) => {
            if (err)
                reject(err)
            else {
                const pages = rows.map((p) => new Airplane(p.id, p.name));
                resolve(pages);
            }
        });
    });
}

function getAirplane(airplanename) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM airplanes WHERE name=?';
        db.get(sql, [airplanename], (err, row) => {
            if (err)
                reject(err)
            else if (row === undefined)
                resolve({ error: 'Planes not found.' });
            else {
                if(row){
                    const airplane = new Airplane(row.id, row.name);
                    resolve(airplane);
                }
                else
                    resolve({});
            }
        });
    });
}


function listSeats(airplanename) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM seats WHERE airplanename = ?';
        db.all(sql, [airplanename],(err, rows) => {
           
            if (err)
                reject(err)
            else {
                const contents = rows.map((c) => new Seat(c.id, c.type, c.seatCode,c.airplanename,-1));
                resolve(contents);
            }
        });
    });
}

function getSeatbyid(id,airplanename){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM seats WHERE id = ? AND airplanename= ?';
        db.all(sql, [id,airplanename],(err, rows) => {
           
            if (err)
                reject(err)
         else if (rows.length==0)
                resolve({ error: 'Seat not found.' });
            else {
             resolve(1);
            }
        });
    });
}





function listSeatsOccupiedUser(airplanename,user)  {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM seats WHERE airplanename = ? AND userid = ?';
        db.all(sql, [airplanename,user],(err, rows) => {
            if (err)
                reject(err)
            else {
                const contents = rows.map((c) => new Seat(c.id, c.type, c.seatCode,c.airplanename,c.userid));
                resolve(contents);
            }
        });
    });
}


function editSeat(seatId, seat) {
 
    return new Promise((resolve, reject) => {
        const sql = `UPDATE seats
        SET type=? , userid=?   
        WHERE id=?` ;
        
       

        db.run(sql, [seat.type,seat.userid,seatId], (err)=>{
            if(err) {
                reject(err) ;
            } else {
                resolve(true) ;
            }
        }) ;
    })
}





exports.listAirplanes = listAirplanes;
exports.getAirplane = getAirplane;
exports.listSeats = listSeats;
exports.editSeat = editSeat;
exports.listSeatsOccupiedUser=listSeatsOccupiedUser;
exports.getSeatbyid=getSeatbyid