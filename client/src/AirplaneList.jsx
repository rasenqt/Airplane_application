import { useEffect, useState, useContext } from "react";
import UserContext from './UserContext';
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button} from 'react-bootstrap';
import {  ArrowRight,} from 'react-bootstrap-icons';
import { listAirplanes} from './API';
import Intercontinental from './images/intercontinental.jpg'
import International from './images/international.jpg'
import  Local from './images/local.jpg'


import {CenteredSpinner} from "./CenteredSpinner"


function AirplaneList(props) {
    const user = useContext(UserContext) ;
    
    const [planes, setplanes] = useState();

    useEffect(() => {
      
            listAirplanes().then((planes) => setplanes(planes));
     
    }, []);



    
    
  
    

    if(!planes)
        return <CenteredSpinner/>;
    
    
    return (
        <>
        <Container>
            <PlanesGrid planes={planes} user={user} />
        </Container>

       
        </>
    );
}





function PlanesGrid(props){
    const navigate = useNavigate() ;

    const handleOpen= (p) => {
        navigate(`/planes/${p.name}`)
        
    };


    let sortedplanes = [...props.planes];


    
    return <Row  className="d-flex justify-content-between mt-3">
     
        {sortedplanes.map((p) => {
     
             
            return <Col className="d-flex justify-content-between mt-3" key={p.id} md={4}>
                <Card className="d-flex justify-content-between mt-3"  style={{ backgroundColor: "#CAC1CB" , width: '22vw' , height: '25vw' }} border="success">
               {p.name==='Local' && 
                       <Card.Img    variant="top" src={Local} style={{ width: '22vw', height: '22vw   ' }} /> }
                {p.name==="International" && 
                <Card.Img    variant="top" src={International} style={{ width: '22vw', height: '22vw' }}/> }

                {p.name==="Intercontinental" && 
                <Card.Img   variant="top" src={Intercontinental} style={{ width: '22vw', height: '22vw' }}/> }
                    <Card.Body>
                
                    {p.name==="Intercontinental" &&    <Card.Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'black' }}>    Intercontinental</Card.Text> }
                    {p.name==="International" &&    <Card.Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'black' }}>   International</Card.Text> }
                    {p.name==="Local" &&    <Card.Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'black' }}> Local   </Card.Text> }
                    </Card.Body>
                    <Card.Footer className="d-flex justify-content-between mt-3"  >
                        
                            <Col className="text-end"><Button style={{color :"#3788ae",opacity: '0.7'}} onClick={() => handleOpen(p)}><ArrowRight style={{color:"#ffFFFf"}}/></Button></Col>
                     
                    </Card.Footer>
                </Card>
            </Col>;
        })}
    </Row>;

}

export { AirplaneList };
