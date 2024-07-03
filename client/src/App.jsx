import { Container, Navbar, Modal, Form, Button, Alert } from 'react-bootstrap';
import {AirplaneEngines } from 'react-bootstrap-icons';
import { useEffect, useState, useContext } from "react";
import UserContext from './UserContext';
import { BrowserRouter, Link, Outlet, Route, Routes } from 'react-router-dom';
import { login, logout} from './API';


import 'bootstrap/dist/css/bootstrap.min.css';


import { AirplaneList } from "./AirplaneList";
import { AirplaneSeats } from "./AirplaneSeats";
import {AirplaneNotFound} from "./AirplaneNotFound"
import Airplanenavbar from './images/indexplane.jpg'



function App() {
  const [user, setUser] = useState() ;
  const handleUser = (u) => setUser(u);
  return (
    <UserContext.Provider value={user}>
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout handleUser={handleUser}/>}>
          <Route index element={<AirplaneList/>} />
          <Route path='/planes/:airplanename' element={<AirplaneSeats/>}/>
          <Route path='*' element={<AirplaneNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </UserContext.Provider>
  )
}







function MainLayout(props) {
  const user = useContext(UserContext) ;
  


  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleShowLoginModal = () => setShowLoginModal(true);
  const handleCloseLoginModal = () => setShowLoginModal(false);


   
  const handleLogout = async () => {
   
    await logout() ;
    props.handleUser();
    
  
   
    
  };




  return <>
    <header>
      <Navbar sticky="top" variant='dark' bg="custom-color" expand="lg" className='mb-3' 
      style={{    position: 'fixed',
                top: '2%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                height: '5%',
                 backgroundColor: "rebeccapurple" }}>
        <Container>
          <Navbar.Brand>
            <Link to='/' style={{ color: 'white', textDecoration: 'none' }}> <AirplaneEngines>  </AirplaneEngines> AirplaneSeats <AirplaneEngines>  </AirplaneEngines> </Link>
        
          </Navbar.Brand>
          <Navbar.Text>
            {user && <span>{user.name} - <Link onClick={handleLogout} style={{ color: 'white' }}>Logout</Link></span>}
            {!user && <span>Guest - <Link onClick={handleShowLoginModal} style={{ color: 'white' }}>Login</Link></span>}
          </Navbar.Text>
        </Container>
        <div style={{ position: 'absolute', right: '0', left: '0', top: '0', bottom: '0', zIndex: '-1' }}>
    <img src={Airplanenavbar } alt="Transparent Image" style={{ opacity: '0.5', width: '100%', height: '100%' , objectFit: 'fill' }} />
  </div>

      </Navbar>
    </header>
    <main>
      <Container>
        <Outlet />
      </Container>
      { <Navbar fixed="bottom" bg="light" variant="light">
        <Container>
          <Navbar.Text style={{ fontWeight: "bold", color: "black" }}>
            Caretto Michelangelo s310178
          </Navbar.Text>
        </Container>
      </Navbar> }


      <LoginModal show={showLoginModal} handleClose={handleCloseLoginModal} handleUser={props.handleUser}/>
     
        
    </main>
  </>
}








function LoginModal(props){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(()=>{
    setEmail('');
    setPassword('');
  }, [props.show])

  const [errorMsg, setErrorMsg] = useState('') ;
  useEffect(()=>{
      if(errorMsg) {
          setTimeout(()=>{setErrorMsg('')}, 2000);
      }
  }, [errorMsg]);

  const handleLogin = async () => {
    if(!email)
      setErrorMsg('Empty email field');
    else if(!password)
      setErrorMsg('Empty password field');
    else{
      try{
        const user = await(login(email, password));
        props.handleUser(user);
        props.handleClose();
      }
      catch(error){
        setErrorMsg('Wrong email or password');
      }
    }      
  };

  return <Modal show={props.show} onHide={props.handleClose}>
          <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form>
              <Form.Group className="mb-3" controlId="username">
              <Form.Label>Email</Form.Label>
              <Form.Control value={email} type="email" placeholder="Email" autoFocus
                  onChange={(ev => {setEmail(ev.target.value)})}/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control value={password} type="password" placeholder="Password" autoFocus
                  onChange={(ev => {setPassword(ev.target.value)})}/>
              </Form.Group>
          </Form>
          {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
          </Modal.Body>
          <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
              Cancel
          </Button>
          <Button variant="success" onClick={handleLogin}>
              Login
          </Button>
          </Modal.Footer>
        </Modal>
}










export default App
