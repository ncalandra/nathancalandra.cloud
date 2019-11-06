import React from 'react';
import './App.css';

// react-bootstrap imports
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function App() {
  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="#home">nathancalandra.cloud</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#about">About Me</Nav.Link>
            <NavDropdown title="Demos" id="basic-nav-dropdown">
              <NavDropdown.Item href="#goes16-serverless">GOES16 Serverless</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
        <Nav className="mr-auto">
          <Nav.Link href="#home">GitHub</Nav.Link>
          <Nav.Link href="#about">LinkedIn</Nav.Link>
        </Nav>
      </Navbar>
      <Row>
        <Col>1 of 3</Col>
        <Col>2 of 3</Col>
        <Col>3 of 3</Col>
      </Row>
      <Navbar bg="light" expand="lg" fixed='bottom'>
      </Navbar>
    </div>
  );
}

export default App;
