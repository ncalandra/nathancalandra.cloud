import React from 'react';

// react-bootstrap imports
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

function BaseLayersControl(props) {
  return (
    <div className='BaseLayersControl'>
      <Card style={{ width: '7.5rem' }}>
        <Card.Header style={{ textAlign: 'center', padding: '0' }}>Base Layers</Card.Header>
        <Card.Body style={{ padding: '0.75rem' }}>
          <Form>
            {props.baseLayers.map(layer => {
              return (
                <Form.Check
                  custom
                  type='radio'
                  id={layer.name}
                  key={layer.name}
                  label={layer.name}
                  checked={layer.visible}
                  onChange={props.updateBaseLayer}
                />
              );
            })}
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default BaseLayersControl;
