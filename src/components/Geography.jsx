import React from 'react';
import { Alert } from 'react-bootstrap';

const Geography = (props) => (
  <div className='Geography'>
    <Alert.Heading>Geography</Alert.Heading>

    <div id='geo-div'>
      <p>Neighborhood boundaries are created by DataHaven based on consultations with municipal government about current designations.</p>

      { props.geo === undefined ? null : props.geo.map((d, i) => (
        <p key={ `geo-${ i }` }>{ `${ d.region } is defined as ${ d.def }.` }</p>
      )) }
    </div>
  </div>
);

export default Geography;
