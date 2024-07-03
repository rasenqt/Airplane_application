const APIURL = 'http://localhost:3000/api'


import { Airplane, Seat } from "./pc";


async function login(username, password) {
    try {
        const response = await fetch(APIURL + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            }),
            credentials: 'include'
        });
        if (response.ok) {
            return await response.json();
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error });
    }
}


async function logout() {
    try {
        const response = await fetch(APIURL + '/logout', {
            method: 'POST',
            credentials: 'include'
        });
        if (response.ok) {
            return true ;
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error });
    }
}






async function listAirplanes() {
    try {
        const response = await fetch(APIURL + '/airplanes',{
            credentials: 'include'
        });
        if (response.ok) {
            const airplanes = await response.json();
          
            return airplanes.map((p) => new Airplane(p.id, p.name));
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error })
    }
}

async function getAirplane(airplanename) {
    try {
        const response = await fetch(APIURL + `/airplanes/${airplanename}`,{
            credentials: 'include'
        });
        if (response.ok) {
            const airplane = await response.json();
            return new Airplane(airplane.id, airplane.name);

        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error })
    }
}



async function listSeats(airplanename) {
    try {
        const response = await fetch(APIURL + `/planes/${airplanename}/seats`,{
            credentials: 'include'
        });
        if (response.ok) {
            const seats = await response.json();
            return seats.map(c => new Seat(c.id, c.type, c.seatCode,airplanename,c.userid));
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error });
    }
}

async function listSeatsOccupiedUser(airplanename,user)
 {
    try {
        const response = await fetch(APIURL + `/planes/${airplanename}/${user}/seats`,{
            credentials: 'include'
        });
        if (response.ok) {
            const seats = await response.json();
            return seats.map(c => new Seat(c.id, c.type, c.seatCode,airplanename,user));
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error });
    }
}



async function editSeat(selectedSeats, type,airplanename,userid) {
    
       const response=  await fetch(APIURL + `/seats/edit`, {
            method: 'PUT',
            headers: {
            'Content-Type': "application/json"
            },
            body: JSON.stringify({
                selectedSeats : selectedSeats,
                type : type,
                airplanename: airplanename,
                userid: userid
               
            }),
         credentials: 'include'
        });
        if (response.status === 200) {
            return true;
          } else if (response.status === 422) {
             let text= await response.text()
            throw new Error(text);
    }
}




export { login, logout,    listAirplanes, getAirplane,  listSeats, listSeatsOccupiedUser,editSeat};