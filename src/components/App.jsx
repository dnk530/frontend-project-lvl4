import React, { createContext, useContext, useEffect, useState } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';

import { Navbar, Nav, Container, Row, Col, Form, Button } from 'react-bootstrap'

import Login from './Login.jsx';
import getData from '../utils/fetcher.js';
import { useDispatch, useSelector } from "react-redux";
import { actions } from '../slices/channelsSlice.js';
export const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const logIn = () => {
    setLoggedIn(true);
  }
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  try {
    const userId = JSON.parse(localStorage.getItem('userId'));
    if (!loggedIn && userId.token) {
      logIn();
    }
  } catch (error) {
    
  }

  return (
    <AuthContext.Provider value={{ loggedIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  )
};



export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Container className='d-flex flex-column h-100'>
          <Navbar bg="white shadow px-4" className="mb-3">
            <Navbar.Brand as={Link} to={"/"}>Chat</Navbar.Brand>
            <Nav className="mr-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
            </Nav>
          </Navbar>
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route exact path="/">
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            </Route>
            <Route path='*'>
              <NotFound />
            </Route>
          </Switch>
        </Container>
        
      </Router>
    </AuthProvider>
  );
}

const PrivateRoute = ({children}) => {
  const useAuth = useContext(AuthContext);
  return (useAuth.loggedIn ? children : <Redirect to="/login"></Redirect>);
};

const Home = () => {
  const useAuth = useContext(AuthContext);
  const dispatch = useDispatch();
  

  useEffect(() => {
    if (!useAuth.loggedIn) {
      return null;
    }
    const data = getData().then((data) => {
      dispatch(actions.add(data.channels))
    });
  }, [])

  const channels = useSelector((state) => state.channels);
  const [activeChannelId, setActiveChannelId] = useState(1);

  return (
    <Container className='h-100 my-4 overflow-hidden rounded shadow'>
      <Row className='h-100'>
        <Col xs={3} className="bg-light pt-5 px-0 border-end">
            <span className='px-3'>Channels:</span>
          <Nav fill variant="pills" className="d-flex flex-column align-items-start px-2">
            {channels.map((channel) => <Nav.Item><Nav.Link active={channel.id === activeChannelId} onClick={() => setActiveChannelId(channel.id)}>{`#${channel.name}`}</Nav.Link></Nav.Item>)}
          </Nav>
        </Col>
        <Col className='p-0'>
          <Container fluid className='h-100 d-flex flex-column'>
            <Row className='mb-3 p-2 bg-light'>
              <span>Chat Header</span>
              <span className='text-muted'># of messages</span>
            </Row>
            <Row className='bg-white'>
              <span>Messages</span>
            </Row>
            <Row className='mt-auto py-5'>
              <Form>
                <Form.Group className='d-flex'>
                  <Form.Label></Form.Label>
                  <Form.Control type="text"></Form.Control>
                  <Button type="Submit" className="mx-2">Send</Button>
                </Form.Group>
              </Form>
            </Row>
          </Container>
        </Col>
      </Row>

    </Container>
)};
const NotFound = () => <h2>404</h2>;