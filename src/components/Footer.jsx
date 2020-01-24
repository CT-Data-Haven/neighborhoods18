import React from 'react';
import { Image, Alert } from 'react-bootstrap';
import Download from './Download';
import { makeDownloads } from './utils.js';

import '../styles/Footer.css';

import src from '../img/logo.png';

const text = 'Source: DataHaven analysis (2019) of';

const Footer = (props) => (
  <div className='Footer'>
    <Alert variant='light'>
      <Alert.Heading>Download this data</Alert.Heading>

      <Download city={ props.city } { ...makeDownloads(props.dwId, props.city, 2018) } />
      {/* </Alert> */}
      <hr />
      {/* <Alert variant='light'> */}
      <Alert.Heading>{ text }</Alert.Heading>
      <ul>
        { props.sources.map((d, i) => (
          <li key={ `source-${ i }` }>
            <span className='source'>{ d.source }</span> (<span>{ d.year }</span>). <a href={ d.url }>{ d.project }</a>
          </li>
        )) }
      </ul>

      <a href='http://www.ctdatahaven.org'><Image src={ src } id='logo' alt='DataHaven logo' /></a>
    </Alert>
  </div>
);

export default Footer;
