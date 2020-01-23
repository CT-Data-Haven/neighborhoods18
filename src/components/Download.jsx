import React from 'react';

const Download = (props) => (
  <div className='Download'>
    Download data <a href={ props.dl }>here</a> (right-click and 'Save as...'), filter and analyze data online on <a href={ props.dw }>data.world</a> (requires free sign-up), or download/clone from <a href={ props.gh }>GitHub</a> (advanced users).
  </div>
);

export default Download;
