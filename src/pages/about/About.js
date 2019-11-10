import React from 'react';
import './About.css';

// react-bootstrap imports
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';

function About() {
  return (
    <div className="About">

      <Jumbotron fluid>
        <Container>
          <h1>My Name is Nathan Calandra</h1>
          <p>
            I am a Software Engineer and Cloud Architect at Atmospheric and Environmental Research.
          </p>
        </Container>
      </Jumbotron>
    </div>
  );
}

export default About;
