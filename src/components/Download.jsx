import React from 'react';

const Download = (props) => (
  <div className='Download'>
    View, filter, and download data on <a href={ props.dw }>data.world</a> (all users), or download from <a href={ props.gh }>GitHub</a> (advanced users).
  </div>
);

export default Download;
