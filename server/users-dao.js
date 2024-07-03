'use strict';

const crypto = require('crypto');
const db = require('./db') ;

const { User} = require('./pc');
function getUser(username, password) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE email=?';
        db.get(sql, [username], (err, row) => {
            if (err) {
                reject(err);
            } else {
                if (!row) {
                    reject('Invalid username or password');
                } else {
                    crypto.scrypt(password, row.salt, 32, (err, computed_hash) => {
                        if (err) {
                            reject(err);
                        } else {
                            const equal = crypto.timingSafeEqual(computed_hash, Buffer.from(row.password, 'hex'));
                            if (equal) {
                                resolve(row);
                            } else {
                                reject('Invalid username or password');
                            }
                        }
                    });
                }
            }
        });
    });
}



function getUserById (id) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE id=?';
      db.get(sql, [id], (err, row) => {
        if (err)
          reject(err);
        else if (row === undefined)
          resolve({ error: 'User not found.' });
        else {
        
          const user = new User(row.id,  row.email, row.name);
         
          resolve(user);
        }
      });
    });
  };
exports.getUser = getUser;
exports.getUserById= getUserById;
