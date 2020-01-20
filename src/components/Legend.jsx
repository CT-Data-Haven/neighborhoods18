import React from 'react';
import { LegendThreshold } from '@vx/legend';
import { fmt } from './utils.js';

import '../styles/Legend.css';

const Legend = (props) => {
  console.log(props.colorscale.domain);
  return (
    <div className='Legend'>
      <LegendThreshold
        scale={ props.colorscale }
        domain={ [...props.colorscale.domain(), null] }
        labelUpper=' or higher'
        labelFormat={ (label) => label ? fmt(props.meta.format)(label) : '' }
      />
    </div>
  )
};

export default Legend;
