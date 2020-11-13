import React, { useState } from 'react';

// MomentJS
import moment from 'moment';

// react-bootstrap imports
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';

function DownloadModal(props) {

  const [animate, setAnimate] = useState(false);
  const [timesteps, setTimesteps] = useState(1);

  const layers = props.layers.map(layer => layer.name).reverse();
  const layerIndex = layers.length - props.layers.findIndex(layer => layer.visible) - 1;

  return (
    <Modal
      show={props.show}
      onHide={() => {
        setAnimate(false);
        props.onHide();
      }}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Download Data</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Row>
            <Col>
              <Form.Label>Product</Form.Label>
              <Form.Control value={props.selectedProduct} readOnly />
            </Col>
            <Col>
              <Form.Label>Layer</Form.Label>
              <Form.Control value={props.selectedLayer.split('/')[props.selectedLayer.split('/').length - 1]} readOnly />
            </Col>
            <Col>
              <Form.Label>Type</Form.Label>
              <Form.Check
                type="radio"
                label="Single Image"
                checked={!animate}
                onChange={e => setAnimate(false)}
              />
              <Form.Check
                type="radio"
                label="Animation"
                checked={animate}
                value="animation"
                disabled={layerIndex === layers.length - 1 ? true : false}
                onChange={e => setAnimate(true)}
              />
            </Col>
          </Form.Row>
          {
            animate &&
            <>
              <Form.Row>
                <Form.Label>Duration</Form.Label>
                <Form.Control
                  type="range"
                  className="slider"
                  min={1}
                  max={layers.length - layerIndex - 1}
                  value={timesteps}
                  onChange={e => setTimesteps(e.target.value)}
                />
              </Form.Row>
              <Form.Row>
                <Col className="text-center">
                  {
                    moment.utc(
                      layers[layerIndex].split('_')[4].slice(1),
                      'YYYYDDDhhmmss'
                    ).local().format('lll')
                  }
                  {' to '}
                  {
                    moment.utc(
                      layers[layerIndex + parseInt(timesteps)].split('_')[4].slice(1),
                      'YYYYDDDhhmmss'
                    ).local().format('lll')
                  }
                </Col>
              </Form.Row>
            </>
          }
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button
          size="sm"
          variant="primary"
          onClick={() => {
            if (animate) {
              console.log(layerIndex, layerIndex + parseInt(timesteps) + 1);
              props.downloadAnimation(
                layers.slice(layerIndex, layerIndex + parseInt(timesteps) + 1)
              );
            }
            else {
              props.downloadImage();
            }
          }}
        >
          {props.loading &&
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          }
          {props.loading ? ' Downloading' : 'Download'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DownloadModal;
