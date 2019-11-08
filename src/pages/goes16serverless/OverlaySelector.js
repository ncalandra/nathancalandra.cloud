import React from 'react';

// react-bootstrap imports
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

function OverlaySelector(props) {
  return (
    <div className='LayerSelector'>
      <Card style={{ width: '50rem' }}>
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
    </div>
  );
}

export default OverlaySelector;
