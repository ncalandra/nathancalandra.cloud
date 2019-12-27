import React, { useState } from 'react';

// MomentJS
import moment from 'moment';

// react-bootstrap imports
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function OverlaySelector(props) {

  const [selectedLayer, setSelectedLayer] = useState(0);

  if (props.products.length === 0) {
    return (
      <></>
    );
  }

  return (
    <Container fluid={true} style={{paddingTop: '15px'}}>
      <Row>
        <Col
          xl={{ span: 3, offset: 9 }}
          lg={{ span: 4, offset: 8 }}
          md={{ span: 6, offset: 6 }}
          xs={{ span: 12, offset: 0 }}
        >
          <Card bg="dark" text="white">
            <Card.Header style={{ textAlign: 'center', padding: '0' }}>Overlays</Card.Header>
            <Card.Body style={{ padding: '0.75rem' }}>
              <Form>
                <Form.Group as={Row} controlId="formPlaintextEmail">
                  <Form.Label column sm="2" md="4">
                    Product:
                  </Form.Label>
                  <Col sm="10" md="8">
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
                </Form.Group>
                <Form.Row>
                  <Col xl="6" lg="6" md="6" sm="8" xs="12">
                    <input
                      type="range"
                      className="slider"
                      value={selectedLayer}
                      onChange={
                        e => {
                          setSelectedLayer(e.target.value);
                          props.updateOverlay(props.layers[e.target.value].name);
                        }
                      }
                      min={0}
                      max={props.layers.length - 1}
                    />
                  </Col>
                  <Col xl="3" lg="3" md="3" sm="2" xs="6" className="text-center d-flex flex-column">
                    <ButtonGroup size="sm">
                      <Button
                        variant="secondary"
                        onClick={
                          () => {
                            let newLayer = selectedLayer + 10;
                            newLayer = newLayer >= props.layers.length ? props.layers.length - 1 : newLayer;
                            setSelectedLayer(newLayer);
                            props.updateOverlay(props.layers[newLayer].name);
                          }
                        }
                      >
                        <i className="fas fa-angle-double-left"></i>
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={
                          () => {
                            let newLayer = selectedLayer + 1;
                            newLayer = newLayer >= props.layers.length ? props.layers.length - 1 : newLayer;
                            setSelectedLayer(newLayer);
                            props.updateOverlay(props.layers[newLayer].name);
                          }
                        }
                      >
                        <i className="fas fa-angle-left"></i>
                      </Button>
                    </ButtonGroup>
                  </Col>
                  <Col xl="3" lg="3" md="3" sm="2" xs="6" className="text-center d-flex flex-column">
                    <ButtonGroup size="sm">
                      <Button
                        variant="secondary"
                        onClick={
                          () => {
                            let newLayer = selectedLayer - 1;
                            newLayer = newLayer < 0 ? 0 : newLayer;
                            setSelectedLayer(newLayer);
                            props.updateOverlay(props.layers[newLayer].name);
                          }
                        }
                      >
                        <i className="fas fa-angle-right"></i>
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={
                          () => {
                            let newLayer = selectedLayer - 10;
                            newLayer = newLayer < 0 ? 0 : newLayer;
                            setSelectedLayer(newLayer);
                            props.updateOverlay(props.layers[newLayer].name);
                          }
                        }
                      >
                        <i className="fas fa-angle-double-right"></i>
                      </Button>
                    </ButtonGroup>
                  </Col>
                </Form.Row>
                <Form.Row>
                  <Col className="text-center">
                    {
                      moment.utc(
                        props.layers[selectedLayer].name.split('_')[4].slice(1),
                        'YYYYDDDhhmmss'
                      ).local().format('lll')
                    }
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
