'use strict';

const sqlite = require('sqlite3');
const db = require('./db') ;


let sql = 'INSERT INTO users(email, name,  salt, password) VALUES(?,?,?,?)';
db.run(sql, ["miki@gmail.com", "miki","c4bb5f51b84844a9", "6fec27b94a96acedcb31b84f80753865153721529e0262344595577826671f63"], (err) => {
    if (err)
        console.log(err.message)
});

 sql = 'INSERT INTO users(email, name,  salt, password) VALUES(?,?,?,?)';
db.run(sql, ["miki1@gmail.com", "miki1",  "c4bb5f51b84844a9", "6fec27b94a96acedcb31b84f80753865153721529e0262344595577826671f63"], (err) => {
    if (err)
        console.log(err.message)
});

sql = 'INSERT INTO users(email, name,  salt, password) VALUES(?,?,?,?)';
db.run(sql, ["miki2@gmail.com", "miki2",  "c4bb5f51b84844a9", "6fec27b94a96acedcb31b84f80753865153721529e0262344595577826671f63"], (err) => {
    if (err)
        console.log(err.message)
});

sql = 'INSERT INTO users(email, name,  salt, password) VALUES(?,?,?,?)';
db.run(sql, ["miki3@gmail.com", "miki3",  "c4bb5f51b84844a9", "6fec27b94a96acedcb31b84f80753865153721529e0262344595577826671f63"], (err) => {
    if (err)
        console.log(err.message)
});





 


sql = 'INSERT INTO airplanes(name) VALUES(?)';
        db.run(sql, ["Local"], function(err) {
            if (err)
            console.log(err.message)
           
           
        });

sql = 'INSERT INTO airplanes(name) VALUES(?)';
        db.run(sql, ["International"], function(err) {
            if (err)
            console.log(err.message)
          
           
        });


sql = 'INSERT INTO airplanes(name) VALUES(?)';
        db.run(sql, ["Intercontinental"], function(err) {
            if (err)
            console.log(err.message)
          
        });        

//creo le sedie :)

// Funzione per l'inserimento dei contenuti
const insertContentaereo3 = (type, seatCode, airplanename) => {
    const sql = 'INSERT INTO seats(type, seatCode, airplanename) VALUES(?, ?,?)';
    db.run(sql, [type, seatCode,airplanename], (err) => {
      if (err) {
        console.log(err.message);
      }
    });
  };
  
  // Genera 20 record con type=text, pageId=1 e value da "sedia 1" a "sedia 20"
  for (let i = 1; i <= 150; i++) {
    const type = 'Available';
   
    
    const airplanename = "Intercontinental";
    const rowNumber = Math.ceil(i / 6); 
   const seatPosition = String.fromCharCode(65 + ((i - 1) % 6)); 
    const seatCode = `${rowNumber}${seatPosition}`; 
    
    insertContentaereo3(type, seatCode, airplanename);
  }

  const insertContentaereo2 = (type, seatCode, airplanename) => {
    const sql = 'INSERT INTO seats(type, seatCode, airplanename) VALUES(?, ?,?)';
    db.run(sql, [type, seatCode,airplanename], (err) => {
      if (err) {
        console.log(err.message);
      }
    });
  };
  
  // Genera 20 record con type=text, pageId=1 e value da "sedia 1" a "sedia 20"
  for (let i = 1; i <= 100; i++) {
    const type = 'Available';
   
    
    const airplanename = "International";
    const rowNumber = Math.ceil(i / 5); 
   const seatPosition = String.fromCharCode(65 + ((i - 1) % 5)); 
    const seatCode = `${rowNumber}${seatPosition}`; 
    
    insertContentaereo2(type, seatCode, airplanename);
  }

  const insertContentaereo1 = (type, seatCode, airplanename) => {
    const sql = 'INSERT INTO seats(type, seatCode, airplanename) VALUES(?, ?,?)';
    db.run(sql, [type, seatCode,airplanename], (err) => {
      if (err) {
        console.log(err.message);
      }
    });
  };
  
  // Genera 20 record con type=text, pageId=1 e value da "sedia 1" a "sedia 20"
  for (let i = 1; i <= 60; i++) {
    const type = 'Available';
   
    
    const airplanename = "Local";
    const rowNumber = Math.ceil(i / 4); 
   const seatPosition = String.fromCharCode(65 + ((i - 1) % 4)); 
    const seatCode = `${rowNumber}${seatPosition}`; 
    
    insertContentaereo1(type, seatCode, airplanename);
  }

