import React from 'react';
import { ResponsiveOrdinalFrame } from 'semiotic';
import { fmt } from './utils.js';

import '../styles/Chart.css';

const Chart = (props) => {
  const colorNhood = (d, nhood, scale, accent) => (
    d[props.oAccess] === nhood ? accent : scale(d.level)
  );
  const format = props.meta && props.meta.format ? fmt(props.meta.format) : (d) => d;

  const labels = props.data.map((d) => ({
    label: format,
    [props.oAccess]: d[props.oAccess],
    [props.rAccess]: d[props.rAccess],
    type: 'bar-label'
  }));

  return (
    <div className='Chart'>
      <ResponsiveOrdinalFrame
        data={ props.data }
        margin={ { top: 10, right: 10, bottom: 10, left: 160 } }
        oAccessor={ props.oAccess }
        rAccessor={ props.rAccess }
        type='bar'
        oPadding={ 4 }
        oLabel={ true }
        projection='horizontal'
        responsiveWidth={ true }
        style={ (d) => ({
          fill: colorNhood(d, props.nhood, props.colorscale, props.accent),
          stroke: 'white',
          strokeWidth: '1px',
          opacity: 0.8
        }) }
        pieceHoverAnnotation={ [{
          type: 'highlight',
          style: (d) => ({
            opacity: 1.0,
            // stroke: '#464e52'
            stroke: '#3b6c8f'
          })
        }] }
        annotations={ labels }
        svgAnnotationRules={ (d) => lblRules(d, props.oAccess, props.rAccess, format) }
        customClickBehavior={ props.onClick }
        baseMarkProps={ {
          transitionDuration: { fill: 200 }
        } }
      />
    </div>
  );
};

////// check width of bar; if under some amount, positive dx and dark label
const lblRules = ({ screenCoordinates, d }, oAccess, rAccess, fmt) => {
  if (d.type === 'bar-label') {
    const missing = isNaN(screenCoordinates[0]);
    const coords = missing ? [0, screenCoordinates[1]] : screenCoordinates;
    const small = coords[0] < 30;
    return (
      <g
        className={ `direct-label ${ small ? 'dark' : 'light' }` }
        key={ `lbl-${ d[oAccess] }` }
        transform={ `translate(${ coords })` }
      >
        <text x={ 0 } y={ 0 } dx={ small ? '1.4em' : '-0.3em' } dy={ 3 }>{ fmt(d[rAccess]) }</text>
      </g>
    )
  } else {
    return null;
  }
};

export default Chart;
