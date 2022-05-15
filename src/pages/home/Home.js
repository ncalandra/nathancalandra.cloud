import React from 'react';
import './Home.css';

// react-bootstrap imports
import Container from 'react-bootstrap/Container';
import CardGroup from 'react-bootstrap/CardGroup';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Navbar from 'react-bootstrap/Navbar';

// Images
import goes16 from './pictures/goes16.png';
import blank from './pictures/blank.png';

function Home() {
  return (
    <div className="Home">
      <div style={{padding: '2rem 1rem', marginBottom: '2rem', backgroundColor: '#e9ecef', borderRadius: '.3rem'}}>
        <Container>
          <h1>Welcome!</h1>
          <p>
            I use this website to host my projects.
          </p>
        </Container>
      </div>
      <Container>
        <CardGroup>
          <Card bg="light">
            <Card.Img variant="top" src={goes16} />
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
            <Card.Img variant="top" src={blank} />
            <Card.Header>This Website</Card.Header>
            <Card.Body>
              <Card.Text>
                A react app hosted on AWS.  Powered by AWS S3, Route53, and CloudFront.  Based on a project by Ethan Fahy.
              </Card.Text>
            </Card.Body>
            <Card.Footer className="text-center">
              <ButtonGroup aria-label="Links">
                <Button href="https://ethanfahy.cloud/2019/09/24/jekyll-aws.html" variant="outline-secondary">Check it out</Button>
                <Button href="https://github.com/ethanfahy/jekyll-aws" variant="outline-secondary">Github</Button>
              </ButtonGroup>
            </Card.Footer>
          </Card>
        </CardGroup>
      </Container>
      <Navbar fixed="bottom" bg="dark" variant="dark" />
    </div>
  );
}

export default Home;
