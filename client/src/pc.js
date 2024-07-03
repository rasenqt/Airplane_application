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

export {Seat, Airplane};