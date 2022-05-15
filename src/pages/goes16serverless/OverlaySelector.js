import React, { useState, useRef } from 'react';

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
  const [hidden, setHidden] = useState(false);

  const overlaySelector = useRef({current: {clientWidth: 0}});
  const hideButton = useRef(null);

  if (props.products.length === 0) {
    return (
      <></>
    );
  }

  // Calculate hide offset
  let hideOffset;
  if (hidden) {
    console.log(overlaySelector);
    hideOffset = -(
      overlaySelector.current.clientWidth -
      hideButton.current.clientWidth -
      parseInt(window.getComputedStyle(overlaySelector.current).getPropertyValue('padding-left'))
    );
  } else {
    hideOffset = 0;
  }

  return (
    <Container fluid={true} style={{paddingTop: '15px'}}>
      <Row>
        <Col
          ref={overlaySelector}
          style={{
            right: hideOffset
          }}
          xl={{ span: 4, offset: 8 }}
          lg={{ span: 4, offset: 8 }}
          md={{ span: 6, offset: 6 }}
          xs={{ span: 12, offset: 0 }}
        >
          <Card bg="dark" text="white">
            <Row className="mx-0 flex-nowrap">
              <Col xs="1" sm="1" md="1" className="px-0 text-center d-flex flex-column">
                <Button
                  ref={hideButton}
                  className="h-100"
                  variant="dark"
                  disabled
                  onClick={
                    () => {setHidden(!hidden);}
                  }
                >
                  <i className={hidden ? 'fas fa-caret-left' : 'fas fa-caret-right'}></i>
                </Button>
              </Col>
              <Col md="11" className="px-0">
                <Card.Body style={{ padding: '0.75rem' }}>
                  <Form>
                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                      <Form.Label column sm="2" md="3">
                        Data Layer:
                      </Form.Label>
                      <Col sm="8" md="7">
                        <Form.Control
                          as="select"
                          onChange={props.updateProduct}
                          custom
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
                      <Col sm="2" md="2" className="text-center d-flex flex-column">
                        <Button
                          variant="secondary"
                          onClick={
                            () => {props.download ? props.openDownloadModal() : props.drawCoverage();}
                          }
                        >
                          <i className={props.download ? 'fas fa-download' : 'fas fa-draw-polygon'}></i>
                        </Button>
                      </Col>
                    </Form.Group>
                    <Row className="mb-3">
                      <Col xl="6" lg="6" md="6" sm="8" xs="12">
                        <input
                          type="range"
                          className="slider rtl"
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
                    </Row>
                    <Row className="mb-3">
                      <Col className="text-center">
                        {
                          moment.utc(
                            props.layers[selectedLayer].name.split('_')[4].slice(1),
                            'YYYYDDDhhmmss'
                          ).local().format('lll')
                        }
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default OverlaySelector;
