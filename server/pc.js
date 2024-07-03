'use strict';


function Seat(id, type, seatCode, airplanename,userid) {
    this.id = id;
    this.type = type;
    this.seatCode = seatCode;
    this.airplanename = airplanename;
    this.userid=userid;
}

function Airplane(id, name) {
    this.id = id;
    this.name = name;
    
}
function User(id, email, name) {
    this.id = id
    this.email = email
    this.name = name
    
}


exports.Seat = Seat ;
exports.Airplane = Airplane ;
exports.User=User;