import React from 'react';

// MomentJS
import moment from 'moment';

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
        <Col md={{ span: 3, offset: 9 }} xs={{ span: 12, offset: 0 }}>
          <Card bg="dark" text="white">
            <Card.Header style={{ textAlign: 'center', padding: '0' }}>Overlays</Card.Header>
            <Card.Body style={{ padding: '0.75rem' }}>
              <Form>
                <Form.Row>
                  <Col>
                    <Form.Control
                      as="select"
                      onChange={props.updateProduct}
                    >
                      {props.products.map(product => {
                        return (
                          <option key={product} value={product}>
                            {product}
                          </option>
                        );
                      })}
                    </Form.Control>
                  </Col>
                  <Col>
                    <Form.Control
                      as="select"
                      onChange={props.updateOverlay}
                    >
                      {props.layers.map(layer => {

                        const time = moment.utc(
                          layer.name.split('_')[4].slice(1),
                          'YYYYDDDhhmmss'
                        ).local().format('lll');

                        return (
                          <option key={layer.name} value={layer.name}>
                            {time}
                          </option>
                        );
                      })}
                    </Form.Control>
                  </Col>
                </Form.Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default OverlaySelector;
