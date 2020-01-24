import React from 'react';
import { cityDisplay } from './utils.js';

const Download = (props) => (
  <div className='Download'>
    {`Download ${ cityDisplay[props.city] } neighborhood data`} <a href={ props.dl }>here</a>, filter and analyze data online on <a href={ props.dw }>data.world</a> (requires free sign-up), or download/clone from <a href={ props.gh }>GitHub</a> (advanced users).
  </div>
);

export default Download;
