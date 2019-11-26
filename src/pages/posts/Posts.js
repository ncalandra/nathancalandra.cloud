import React from 'react';
import './Posts.css';

// react-bootstrap imports
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

// Local imports
import GOES16Serverless from './content/GOES16Serverless.js';

function Posts() {

  console.log(window.location.hash.split('#')[1]);

  const hash = window.location.hash.split('#')[1];
  let content = (
    <Container>
      <h1 className='mt-5'>Post Not Found</h1>
    </Container>
  );
  if (hash === 'goes16-serverless') {
    content = (
      <GOES16Serverless />
    );
  }

  return (
    <div className="Posts">
      {content}
      <Navbar fixed="bottom" bg="dark" variant="dark" />
    </div>
  );
}

export default Posts;
