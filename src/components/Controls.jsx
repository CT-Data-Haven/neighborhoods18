import React from 'react';
import { Form, Col, Row } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { cityDisplay } from './utils.js';

import '../styles/Controls.css';

const Controls = (props) => {
  const { register } = useFormContext();

  return (
    <div className='Controls'>
      <Form>
        <Row>
          <Col lg={ 4 } md={ 6 }>
            <Form.Group controlId='cSelect'>
              <Form.Label>Select a city</Form.Label>
              <Form.Control as='select' name='cSelect' className='custom-select' ref={ register } onChange={ props.onChange }>
                { props.cities.map((d, i) => (
                  <option key={ `city-${ d }` } value={ d }>{ cityDisplay[d] }</option>
                )) }
              </Form.Control>
            </Form.Group>
          </Col>

          { /* spacer */ }
          <Col lg={ 4 } md={ 6 } className='d-lg-none'></Col>

          <Col lg={ 4 } md={ 6 }>
            <Form.Group controlId='tSelect'>
              <Form.Label>Select a topic</Form.Label>
              <Form.Control as='select' name='tSelect' className='custom-select' ref={ register } onChange={ props.onChange }>
                { props.topics.map((d, i) => (
                  <option key={ `topic-${ d }` } value={ d }>{ props.meta[d].display }</option>
                )) }
              </Form.Control>
            </Form.Group>
          </Col>

          <Col lg={ 4 } md={ 6 }>
            <Form.Group controlId='iSelect'>
              <Form.Label>Select an indicator</Form.Label>
              <Form.Control as='select' name='iSelect' className='custom-select' ref={ register } onChange={ props.onChange }>
                { props.indicators.map((d, i) => (
                  <option key={ `indicator-${ d.indicator }` } value={ d.indicator }>{ d.display }</option>
                )) }
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Form>
    </div>
  )
};

export default Controls;
