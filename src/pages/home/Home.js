import React from 'react';
import './Home.css';

// react-bootstrap imports
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';

function Home() {
  return (
    <div className="Home">

      <Jumbotron fluid>
        <Container>
          <h1>Welcome to my website</h1>
          <p>
            I could put some text here
          </p>
        </Container>
      </Jumbotron>
    </div>
  );
}

export default Home;
