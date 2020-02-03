import React from 'react';
import { Button } from 'react-bootstrap';
import { cityDisplay } from './utils.js';

const Download = (props) => (
  <div className='Download'>
    <p><a href={ props.dl }>Download </a>{`${ cityDisplay[props.city] }`} neighborhood data (.csv file), filter and analyze data online on <a href={ props.dw }>data.world</a> (requires free sign-up), or download/clone from <a href={ props.gh }>GitHub</a> (advanced users).</p>

    <p>{ `${ props.nhood }` } data also available as a formatted, printable profile (PDF) -- <Button variant='info' onClick={ props.onClick }>download</Button></p>
  </div>
);

export default Download;
