import React from 'react';
import { Image, Alert } from 'react-bootstrap';
import Download from './Download';
import Sources from './Sources';
import Geography from './Geography';
import { makeDownloads } from './utils.js';

import '../styles/Footer.css';

import src from '../img/logo.png';



const Footer = (props) =>  (
  <div className='Footer'>
    <Alert variant='light'>
      <Alert.Heading as='h2'>About</Alert.Heading>

      <Download
        city={ props.city }
        nhood={ props.nhood }
        onClick={ props.createPdf }
        { ...makeDownloads(props.dwId, props.city, 2018) }
      />

      <hr />

      <Geography geo={ props.geo } />

      <hr />

      <Sources
        sources={ props.sources }
      />

      <a href='http://www.ctdatahaven.org'><Image src={ src } id='logo' alt='DataHaven logo' /></a>
    </Alert>
  </div>
);


export default Footer;
