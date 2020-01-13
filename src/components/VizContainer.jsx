import React from 'react';
import { Tab, Nav } from 'react-bootstrap';

import '../styles/VizContainer.css';

const VizContainer = (props) => {
  return (
    <div className='VizContainer'>
      <Tab.Container defaultActiveKey='map'>
        <Nav variant='pills'>
          { props.children.map((d, i) => (
            <Nav.Item key={ `${ d.key }-tab-nav` }>
              <Nav.Link eventKey={ d.key }><span className='nav-icon'>{ props.tabs[d.key].icon }</span>  { props.tabs[d.key].title }</Nav.Link>
            </Nav.Item>
          )) }
        </Nav>
        <Tab.Content>
          { props.children.map((d, i) => (
            <Tab.Pane key={ `${ d.key }-tab-pane` } eventKey={ d.key }>
              { d }
            </Tab.Pane>
          )) }
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default VizContainer;
