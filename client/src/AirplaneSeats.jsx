import { useEffect, useState, useContext } from "react";
import UserContext from './UserContext';
import { useParams, useNavigate} from "react-router-dom";
import {  Row, Col, ButtonGroup, Button,Card, Form,  Alert} from 'react-bootstrap';
import { X,Lightbulb, CheckCircle,SquareFill } from 'react-bootstrap-icons';
import {  getAirplane, listSeats, editSeat,  listSeatsOccupiedUser } from "./API";
import ListGroup from 'react-bootstrap/ListGroup';



import {CenteredSpinner} from "./CenteredSpinner"


function AirplaneSeats(props) {
    const navigate = useNavigate() ;
    const user = useContext(UserContext) ;
  
    const { airplanename } = useParams();

    const [plane, setplane] = useState();
    const [seats, setSeats] = useState();
    const [occupied,setOccupied] = useState([]);
    
    useEffect(() => {
      getAirplane(airplanename).then((plane) => {
            if(plane.name == airplanename){
                setplane(plane);
                listSeats(airplanename).then((seatss) => {
                 
                    
                    setSeats(seatss);
                    setWaiting(false);
                   
                 
                });
                     if(user)
                       listSeatsOccupiedUser(airplanename,user.id).then((occ) => {
                    
                    
                  setOccupied((!occ)? []: occ);
                  setWaiting(false);
                 
               
              });

                
            }
            else
            navigate('/error');
        });        
    }, [airplanename,user]);   
    

    const [waiting, setWaiting] = useState(true);


    const [errorMsg, setErrorMsg] = useState('') ;
    useEffect(()=>{
      
        if(errorMsg) {
          const seatPattern = /\[(.*?)\]/; 
          const matches = errorMsg.match(seatPattern); 
          if (matches && matches.length > 0) {
            let highlight= [...seats]
            setWaiting(true)
            const seatNumbers = matches[1].split(','); 
            seatNumbers.forEach((x)=>{
             highlight.forEach((b)=> {if(x===b.seatCode ){ b.type="Highlight"} if(b.type==="Requested") b.type="Available"  })});
              setSeats(highlight)
              setWaiting(false)
          }
          
         
            setTimeout(()=>{ 
              if (matches && matches.length > 0) {
                setWaiting(true)
                listSeats(airplanename).then((seatss) => {
                    
                  setSeats(seatss);
                  setWaiting(false);})}
              setErrorMsg('')}
              
              , 5000);
          }}
    , [errorMsg]);
    


    const NSeatsChooseAlgorithm = (n) =>   {
      setWaiting(true);
      let newconts= [...seats]
      let seat_left=seats.filter((a)=>  a.type==="Available").length;
      let already_requested=newconts.filter((a)=>  a.type==="Requested").length;
      
      if(n<=already_requested && n>0 ){
        
        setErrorMsg("You already requested "+already_requested+ " seats")
        
      }
      else if(n>seat_left+already_requested){
        
        setErrorMsg("This airplane has only "+seat_left+ " seats left")
      
      }
      else if (n>0 && typeof n != 'number'){
        let count=0;
        let n_tofind=n-already_requested
       
        newconts.forEach((a)=>
         {if ((a.type==="Available") && (count!= n_tofind)) {
                 a.type="Requested";
                 count++;
         }  });
        
         setSeats(newconts);
        
  
      }
      setWaiting(false);
  
  
     
  
    }
  
    
    

        
     const handleSeatClick = async (conts,id,type) => 
     { setWaiting(true);
      const newcont = conts.map(x => {
        if (x.id === id) {
          return { ...x, type: type }; // Use parentheses instead of curly braces
        }
        return x;
      });
       setSeats(newcont);
       setWaiting(false);
      }   
        
    

   
 

    
    const handleSeats = async (c,state) => {
        setWaiting(true);
       try{
       await editSeat(c,state,airplanename,state==="Available"?-1:user.id)
       const seatss = await listSeats(airplanename);
      
        setSeats(seatss);
        listSeatsOccupiedUser(airplanename,user.id).then((occ) => {
                    
                    
          setOccupied((!occ)? []: occ);});
          setWaiting(false);
      
       }catch (e) { setErrorMsg(e.message) 
      
      }finally{
      
          
         }
        
    }
    

    if(!plane || !seats)
        return <CenteredSpinner/>;


    const logged = user ;
  
    return (
        <>
          <hr/> <hr/>
 <SeatsList seats={seats}  occupied={occupied}  handleSeatClick={handleSeatClick} airplanename={airplanename} logged={logged} waiting={waiting}/>
   
 <Legend  seats={seats}  airplanename={airplanename} logged={logged}/>
          
        {logged && <Reservation   waiting={waiting} seats={seats} NSeatsChooseAlgorithm={NSeatsChooseAlgorithm} occupied={occupied} handleSeats={handleSeats}/>}

        { errorMsg && <CenteredAlert errorMsg={errorMsg}/>}
          
        
        </>
    );
}






function SeatsList(props){

    
    if (!props.logged)
    {
    const buttons=props.seats
    .map((c) => {
        let cont;
        
          cont = c.seatCode;
      
      
       
         if (c.type==="Occupied"){
          return <Col  key={c.seatCode}   xl={1}   className="mb-3">
          <Button style= {{backgroundColor:'red'}}  className= 'col-7 text-center'    > {cont}</Button> </Col>}
        if (c.type==="Available") {
          return <Col  key={c.seatCode}   xl={1}   className="mb-3">
          <Button style= {{backgroundColor:'green'}}  className= 'col-7 text-center'  
          > {cont}</Button> </Col>}



      if (c.type==="Requested"){
        return <Col  key={c.seatCode}   xl={1}   className="mb-3">
           <Button style= {{backgroundColor:'blue'}}  className= 'col-7 text-center' > {cont}</Button> </Col>}
         
         
        
      }
        );
     
    const alphabet = 'ABCDEF'; // Stringa che rappresenta le lettere delle colonne
const rows = [];
if (props.airplanename==="Intercontinental")   
{
for (let i = 1; i <= 25; i++) {
  const row = alphabet.split('').map((column) => {
    const seatCode = `${i}${column}`;
    const col = buttons.find((button) => button.key === seatCode);
    return col;
  });

  rows.push(
    <Row key={i} className="justify-content-center">
      {row}
    </Row>
  );
}

return <div  className="container">{rows}</div>;
}   
if (props.airplanename==="International")   
{
    for (let i = 1; i <= 20; i++) {
        const row = alphabet.split('').map((column) => {
          const seatCode = `${i}${column}`;
          const col = buttons.find((button) => button.key === seatCode);
          return col;
        });
      
        rows.push(
          <Row key={i} className="justify-content-center">
            {row}
          </Row>
        );
      }
      
      return <div className="container">{rows}</div>;


}

if (props.airplanename==="Local")   
{
    for (let i = 1; i <= 15; i++) {
        const row = alphabet.split('').map((column) => {
          const seatCode = `${i}${column}`;
          const col = buttons.find((button) => button.key === seatCode);
          return col;
        });
      
        rows.push(
          <Row key={i} className="justify-content-center">
            {row}
          </Row>
        );
      }
      
      return <div className="container">{rows}</div>;


}
   
      
}else  {     

    const buttons=props.seats
    .map((c) => {
        let cont;
        
          cont = c.seatCode;
       
   
      
      
          if (c.type==="Occupied"){
            return <Col  key={c.seatCode}   xl={1}   className="mb-3">
            <Button style= {{backgroundColor:'red'}}  className= 'col-7 text-center'    > {cont}</Button> </Col>}
           if (c.type==="Highlight"){
         
              return <Col  key={c.seatCode}   xl={1}   className="mb-3">
              <Button style= {{backgroundColor:'orange'}}  className= 'col-7 text-center'    > {cont}</Button> </Col>}
          if (c.type==="Available") {
            return <Col  key={c.seatCode}   xl={1}   className="mb-3">
            <Button style= {{backgroundColor:'green'}}   className= 'col-7 text-center'  
            onClick={()=> { if (props.occupied.length === 0) { props.handleSeatClick(props.seats,c.id,"Requested") }}} > {cont}</Button> </Col>}
           if (c.type==="Requested"){
                 return <Col  key={c.seatCode}   xl={1}   className="mb-3">
             <Button  style= {{backgroundColor:'blue'}}  className= 'col-7 text-center' 
             onClick={()=> { props.handleSeatClick(props.seats,c.id,"Available") }}> {cont}</Button> </Col>}
         
         
           }
        );
     
      const alphabet = 'ABCDEF'; // Stringa che rappresenta le lettere delle colonne
const rows = [];
if (props.airplanename==="Intercontinental")   
{
for (let i = 1; i <= 25; i++) {
  const row = alphabet.split('').map((column) => {
    const seatCode = `${i}${column}`;
    const col = buttons.find((button) => button.key === seatCode);
    return col;
  });

  rows.push(
    <Row key={i} className="justify-content-center">
      {row}
    </Row>
  );
}

return <div className="container">{rows}</div>;
}   
if (props.airplanename==="International")   
{
    for (let i = 1; i <= 20; i++) {
        const row = alphabet.split('').map((column) => {
          const seatCode = `${i}${column}`;
          const col = buttons.find((button) => button.key === seatCode);
          return col;
        });
      
        rows.push(
          <Row key={i} className="justify-content-center">
            {row}
          </Row>
        );
      }
      
      return <div className="container">{rows}</div>;


}

if (props.airplanename==="Local")   
{
    for (let i = 1; i <= 15; i++) {
        const row = alphabet.split('').map((column) => {
          const seatCode = `${i}${column}`;
          const col = buttons.find((button) => button.key === seatCode);
          return col;
        });
      
        rows.push(
          <Row key={i} className="justify-content-center">
            {row}
          </Row>
        );
      }
      
      return <div className="container">{rows}</div>;


}
               
 } };



function CenteredAlert(props){
    return <div style={{
                     height: '20%',
                     width: '20%',
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}>
                <Alert variant="danger">{props.errorMsg}</Alert>
            </div>;
}

function Legend(props){ 
   
   let count_requested=0;
   let count_occupied=0;
   let count_avalaible=0;

   props.seats.forEach((a)=> {
      if(a.type==="Occupied" || a.type==="Highlight")  count_occupied++;
      if(a.type==="Requested") count_requested++;
      if(a.type==="Available") count_avalaible++;

   })
   
    return (<>
        
        <div  style={{
        color: 'Black',
        position: 'fixed',
        top: '24%',
        left: '69%',
        transform: 'translate(-50%, -50%)',
        width: '5%',
        height: '3%',
        minHeight: '1rem'
    }}><h1>{props.airplanename}</h1></div>

{props.logged && (
  <>
    <SquareFill  style={{
        color: 'blue',
        position: 'fixed',
        top: '30%',
        left: '69%',
        transform: 'translate(-50%, -50%)',
        width: '5%',
        height: '3%',
        minHeight: '1rem'
    }}> </SquareFill>

    
    <span
    style={{
      position: 'fixed',
      top: '30%',
      left: '74%',
      transform: 'translate(-50%, -50%)',
      fontSize: '1rem'
    }}
  >
    
    {count_requested} Requested Seats  </span>
    </>
)}

    <SquareFill  style={{
        color: 'red',
        position: 'fixed',
        top: '35%',
        left: '69%',
        transform: 'translate(-50%, -50%)',
        width: '5%',
        height: '3%',
        minHeight: '1rem'
    }}> </SquareFill>
      <span
    style={{
      position: 'fixed',
      top: '35%',
      left: '74%',
      transform: 'translate(-50%, -50%)',
      fontSize: '1rem'
    }}
  >
    
    {count_occupied} Occupied Seats   </span>

    <SquareFill  style={{
        color: 'green',
        position: 'fixed',
        top: '40%',
        left: '69%',
        transform: 'translate(-50%, -50%)',
        width: '5%',
        height: '3%',
        minHeight: '1rem'
    }}> </SquareFill>
    
    <span
    style={{
      position: 'fixed',
      top: '40%',
      left: '74%',
      transform: 'translate(-50%, -50%)',
      fontSize: '1rem'
    }}
  > {count_avalaible} Available Seats  </span>
    
    
    
    </>
    );
        

}

function Reservation(props){
  const [value, setValue] = useState('');




if(props.occupied.length===0 ) {  //You dont have a Reservation
const requested = props.seats.filter((a)=> { return a.type==="Requested"});
  
  return   <Card  className="d-flex justify-content-between mt-3"   border="primary"
                 style={{
                  
                  borderWidth: '0',
                  color: 'black',
                  position: 'fixed',
                  top: '15%',
                  left: '20%',
                  transform: 'translate(-50%, -50%)',
                  width: '20%',
                  height: '3%'
                   }}      >
                    <Card.Header>Requested Seat</Card.Header>
                       <Card.Body>
                      
                    <ListGroup  variant="flush"style={{ height: '6em', overflowY: 'scroll' }}>
                          
                         {requested.map((item) => (
                            <ListGroup.Item key={item.id}>{item.seatCode}</ListGroup.Item>
                                                   ))}
                                          
                                                         
                                                          </ListGroup>

                                  </Card.Body>
                                  <Row>
               <Card.Footer className="text-end">
               
               <Row>
  <Col xs={6}>
    <Form.Group className="lm-3">
      
      <Form.Control 
        style={{ width: '300px', height: '10px', resize: 'none', overflow: 'hidden' }}
        value={value}
        as="textarea"
        placeholder="N Seats Choose"
        autoFocus
        onChange={(ev) => {
          setValue(ev.target.value);
        }}
      />
    </Form.Group>
  </Col>
  <Col xs={6}>
  <Button  disabled={props.waiting || !value } variant="warning" onClick={() => props.NSeatsChooseAlgorithm(value)}>
  <Lightbulb/>
    </Button>
    
    <Button  disabled={props.waiting }variant="success" onClick={() => props.handleSeats(requested, "Occupied")}>
      <CheckCircle />
    </Button>
    <Button  disabled={props.waiting} variant="danger" onClick={() => props.handleSeats(requested, "Available")}>
    <X/>
    </Button>
    
  </Col>
</Row>

                  
              </Card.Footer>
              </Row>
          </Card>

                         } 

else{ //you already have a reservation

  
  
  return    <Card   border="primary"
                 style={{
                  borderWidth: '0',
                  color: 'black',
                  position: 'fixed',
                  top: '15%',
                  left: '20%',
                  transform: 'translate(-50%, -50%)',
                  width: '20%',
                  height: '3%'
                   }}      >
                    <Card.Header>My Reservation</Card.Header>
                       <Card.Body >
                      
                    <ListGroup  variant="flush"style={{ height: '6em', overflowY: 'scroll' }} >
                          
                         {props.occupied.map((item) => (
                            <ListGroup.Item key={item.id}>{item.seatCode}</ListGroup.Item>
                                                   ))}
                                          
                                                         
                                                          </ListGroup>

                                  </Card.Body>
               <Card.Footer className="text-end">
                   <ButtonGroup>
                 
                    <Button  disabled={props.waiting} variant="danger"   onClick={()=>props.handleSeats(props.occupied,"Available")} ><X/></Button>
                      
                     
                  </ButtonGroup>
              </Card.Footer>
          </Card>



                         }
}
export { AirplaneSeats };