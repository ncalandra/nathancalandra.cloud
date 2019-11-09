import React from 'react';

// react-bootstrap imports
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function OverlaySelector(props) {
  return (
    <Container fluid={true} style={{paddingTop: '15px'}}>
      <Row>
        <Col md={{ span: 4, offset: 8 }} xs={{ span: 12, offset: 0 }}>
          <Card bg="dark" text="white">
            <Card.Header style={{ textAlign: 'center', padding: '0' }}>Overlays</Card.Header>
            <Card.Body style={{ padding: '0.75rem' }}>
              <Form>
                <Form.Control
                  as="select"
                  onChange={props.updateOverlay}
                >
                  {props.layers.map(layer => {
                    return (
                      <option key={layer.name} value={layer.name}>
                        {layer.name.split('/').slice(-1)[0]}
                      </option>
                    );
                  })}
                </Form.Control>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default OverlaySelector;
