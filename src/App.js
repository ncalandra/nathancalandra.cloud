import React from 'react';
import './App.css';

// react-bootstrap imports
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

// react-router-dom imports
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

// Local imports
import Home from './pages/home/Home.js';
import About from './pages/about/About.js';
import Goes16serverless from './pages/goes16serverless/Main.js';

function App() {
  return (
    <Router>
      <div>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Navbar.Brand href="/home">nathancalandra.cloud</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="/home">Home</Nav.Link>
              <Nav.Link disabled={true} href="/home">Blogs</Nav.Link>
              <Nav.Link href="/about">About Me</Nav.Link>
              <NavDropdown title="Projects" id="basic-nav-dropdown">
                <NavDropdown.Item href="/goes16-serverless">GOES 16 Serverless</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav>
              <Nav.Link href="https://github.com/ncalandra">GitHub</Nav.Link>
              <Nav.Link href="https://www.linkedin.com/in/nathan-calandra/">LinkedIn</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/goes16-serverless">
            <Goes16serverless />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
