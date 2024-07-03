'use strict';

const PORT = 3000;

const express = require('express');

const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const { check  } = require('express-validator');


const usersdao = require('./users-dao');
const dao = require('./pc-dao');
const {  Seat } = require('./pc');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};

app.use(cors(corsOptions));



const passport = require('passport');
const LocalStrategy = require('passport-local');

passport.use(new LocalStrategy((username, password, callback) => {
    usersdao.getUser(username, password).then((user) => {
        return callback(null, { id: user.id, email: user.email, name: user.name});
    }).catch((err) => {
        return callback(null, false, err);
    });
}));

passport.serializeUser((user, callback) => {
    callback(null, { id: user.id, email: user.email, name: user.name});
});
passport.deserializeUser((user, callback) => {
    return callback(null, user);
});



app.use(session({
    secret: 'secretsession',
    resave: false,
    saveUninitialized: true
}));


app.use(passport.authenticate('session'));


const isLogged = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.status(500).send("Not authenticated");
    }
}


app.post('/api/login', passport.authenticate('local'), (req, res) => {
    res.json(req.user);
});

app.post('/api/logout', (req, res) => {
    req.logout(()=>{res.end()});
})



app.get('/api/airplanes', (req, res) => {
    dao.listAirplanes().then((result) => {
        res.json(result);
    }).catch((error) => {
        res.status(500).send(error.message);
    });
});


app.get('/api/airplanes/:airplanename',
[
    check('airplanename').exists().withMessage('Missing airplane in the params')
  ],
 (req, res) => {
    const airplanename = req.params.airplanename;
    dao.getAirplane(airplanename).then((result) => {
        res.json(result);
    }).catch((error) => {
        res.status(500).send(error.message);
    });
});


app.get('/api/planes/:airplanename/seats',
[
    check('airplanename').exists().withMessage('Missing airplane in the params')
  ],

async (req, res) => {
    const airplanename = req.params.airplanename;
   let exists=  await dao.getAirplane(airplanename)
   //Airplane not found
   if (exists.error)
   return res.status(404).send("AirplaneNameNotFound")

    dao.listSeats(airplanename).then((result) => {
        res.json(result);
    }).catch ((error) => {
        res.status(500).send(error.message);
    })
});













app.use(isLogged);

app.put('/api/seats/edit', async (req, res) => {
    try{
       
       let exists=  await dao.getAirplane(req.body.airplanename)
      
       // Airplane Not found
        if (exists.error)
          return res.status(404).send("AirplaneNameNotFound")
         if(req.body.userid!=-1){
          const user_exists = await usersdao.getUserById(req.body.userid)
      if (user_exists.error)
        return res.status(404).send("User_Not Found")
         }
         //check if all seats exist and belongs to that airplane
         for (let x of  req.body.selectedSeats ){
              let exist_seat =await dao.getSeatbyid(x.id,req.body.airplanename);
              if (exist_seat.error)
              return res.status(404).send("SeatNotFound")
         }
       
            let flag=1;
           
            let list=[]
            if( req.body.type==="Occupied") {
                 const check = await dao.listSeats(req.body.airplanename);
                 
            req.body.selectedSeats.forEach((a)=> {
         
             let tmp= check.filter((x) => x.id===a.id)
          
              if(tmp.length>0 && tmp[0].type==="Occupied" )
              {
                 list.push(tmp[0].seatCode)
                  flag=0;
                
              }
          
    
            })
          }
         
            
          if(flag &&  req.body.type==="Occupied"   || ( req.body.type==="Available")){
           for (let x of  req.body.selectedSeats ){
          
              const seat = new Seat(x.id, req.body.type, x.seatCode, x.airplanename,req.body.userid);
          await dao.editSeat(seat.id,seat);
    
           }
          }
         if(!flag && req.body.type==="Occupied")
         {
            return res.status(422).json('Some seats are not available: ['+ list+"]-Retry" )
          
         }
         else{res.end()}
    
        }
        catch(error){
            res.status(500).send(error.message);
        }});

app.get('/api/planes/:airplanename/:user/seats', 
[
    check('user').exists().withMessage('Missing user ID in the params'),
    check('airplanename').exists().withMessage('Missing plane ID in the params')
  ],
async (req, res) => {
    const airplanename = req.params.airplanename;
    let user=req.params.user
   
    if(user!=req.user.id)
    res.status(401).send("not authorized")

    let exists=  await dao.getAirplane(airplanename)
    //Airplane Not found
    if (exists.error)
      return res.status(404).send("AirplaneNameNotFound")
 
      const user_exists = await usersdao.getUserById(user)
      if (user_exists.error)
        return res.status(404).send("User_Not Found")

   
    

    dao.listSeatsOccupiedUser(airplanename,user).then((result) => {
        res.json(result);
    }).catch ((error) => {
        res.status(500).send(error.message);
    })
});








app.listen(PORT, () => { console.log(`Server started on http://localhost:${PORT}/`) });