import React from 'react';
import './Home.css';

// react-bootstrap imports
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import CardDeck from 'react-bootstrap/CardDeck';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Navbar from 'react-bootstrap/Navbar';

function Home() {
  return (
    <div className="Home">
      <Jumbotron fluid>
        <Container>
          <h1>Welcome!</h1>
          <p>
            I use this website to host my projects.
          </p>
        </Container>
      </Jumbotron>
      <Container>
        <CardDeck>
          <Card bg="light">
            <Card.Img variant="top" src={require('./pictures/goes16.png')} />
            <Card.Header>GOES 16 Serverless</Card.Header>
            <Card.Body>
              <Card.Text>
                A serverless implementation of WMS using GOES 16 data provided by NASA.  Powered by AWS Lambda, API Gateway, and S3.
              </Card.Text>
            </Card.Body>
            <Card.Footer className="text-center">
              <ButtonGroup aria-label="Links">
                <Button href="/goes16-serverless" variant="outline-secondary">Check it out</Button>
                <Button href="/posts#goes16-serverless" variant="outline-secondary">Post</Button>
                <Button href="https://github.com/ncalandra/wms-serverless" variant="outline-secondary">Github</Button>
              </ButtonGroup>
            </Card.Footer>
          </Card>
          <Card bg="light">
            <Card.Img variant="top" src={require('./pictures/blank.png')} />
            <Card.Header>This Website</Card.Header>
            <Card.Body>
              <Card.Text>
                A react app hosted on AWS.  Powered by AWS S3, Route53, and CloudFront.  Based on a project by Ethan Fahy.
              </Card.Text>
            </Card.Body>
            <Card.Footer  className="text-center">
              <ButtonGroup aria-label="Links">
                <Button href="https://ethanfahy.cloud/2019/09/24/jekyll-aws.html" variant="outline-secondary">Check it out</Button>
                <Button href="https://github.com/ethanfahy/jekyll-aws" variant="outline-secondary">Github</Button>
              </ButtonGroup>
            </Card.Footer>
          </Card>
        </CardDeck>
      </Container>
      <Navbar fixed="bottom" bg="dark" variant="dark" />
    </div>
  );
}

export default Home;
