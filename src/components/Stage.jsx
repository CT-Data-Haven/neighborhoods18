import React from 'react';
import { Card } from 'react-bootstrap';
import { compileHeader } from './utils.js';

import '../styles/Stage.css';

const Stage = (props) => {
  const hdr = compileHeader(props.type)({ ...props });

  return (
    <Card>
      <Card.Header as='h3'>
        { hdr }
      </Card.Header>
      <Card.Body>
        { props.children }
      </Card.Body>
    </Card>
  )
};

const ChartStage = (props) => (
  <div className='Stage ChartStage'>
    <Stage
      // lbls={ props.lbls.map((d) => d || makeTitle(d)) }
      type={ props.type || 'long' }
      { ...props }
    />
  </div>
);


const TableStage = (props) => (
  <div className={ props.style ? 'Stage TableStage ' + props.style : 'Stage TableStage' }>
    <Stage
      type={ props.type || 'long' }
      dataBy={ props.dataBy || 'neighborhood' }
      { ...props }
    />
  </div>
);


export { ChartStage, TableStage };
