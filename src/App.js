import React from 'react';
import './App.css';

// react-bootstrap imports
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

// react-router-dom imports
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

// Local imports
import Home from './pages/home/Home.js';
import Posts from './pages/posts/Posts.js';
import Goes16serverless from './pages/goes16serverless/Main.js';

function App() {
  return (
    <Router>
      <div>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand href="/home">nathancalandra.cloud</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="/home">Home</Nav.Link>
                <NavDropdown title="Projects" id="basic-nav-dropdown">
                  <NavDropdown.Item href="/goes16-serverless">GOES 16 Serverless</NavDropdown.Item>
                </NavDropdown>
              </Nav>
              <Nav>
                <Nav.Link href="https://github.com/ncalandra">GitHub</Nav.Link>
                <Nav.Link href="https://www.linkedin.com/in/nathan-calandra/">LinkedIn</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Routes>
          <Route path="/posts" element={<Posts />} />
          <Route path="/goes16-serverless" element={<Goes16serverless />} />
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
