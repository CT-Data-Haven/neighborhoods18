import React from 'react';
import { Map, TileLayer, GeoJSON, LayerGroup } from 'react-leaflet';
import { getBounds, makeGeoLayers, makeTooltip } from './utils.js';

import Legend from './Legend';
import 'leaflet/dist/leaflet.css';

import '../styles/Chart.css';

// events only get bound properly if this is a class component

const cityStyle = {
	fillColor: 'transparent',
	color: '#333',
	weight: 1.5,
	pointerEvents: 'none'
};

export default class Choropleth extends React.Component {

  getStyle = (feature) => {
    const name = feature.properties.name;
    const fillColor = this.props.data[name] ? this.props.colorscale(this.props.data[name].value) : '#ccc';
    return {
      fillColor,
      color: '#555',
      weight: 0.5,
      opacity: 1,
      fillOpacity: 0.75
    };
  };

  handleFeature = (feature, layer) => {
    let name = feature.properties.name;
    layer
      .on('mouseover', this.featureHilite)
      .on('mouseout', this.featureUnhilite);
    layer.bindTooltip(() => (
      makeTooltip(this.props.data, name, this.props.meta)),
      { direction: 'top', offset: [0, -20], className: 'custom-tip' }
    );
  };

  featureHilite = ({ target }) => {
    target.setStyle({
      fillOpacity: 0.95,
      weight: 1
    });

  };
  featureUnhilite = ({ target }) => {
    target.setStyle({
      fillOpacity: 0.75,
      weight: 0.5
    });
  };

	render() {
		const bbox = getBounds(this.props.shape);
	  const layers = makeGeoLayers(this.props.shape);
		return (
	    <div className='Chart Choropleth'>
	      <Map
	        key={ this.props.city }
	        bounds={ bbox }
	        zoomSnap={ 0.5 }
	        zoomDelta={ 0.5 }
	        scrollWheelZoom={ false }
	      >
	        <TileLayer
	          url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}.{ ext }"
	          attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	          subdomains="abcd"
	          minZoom={ 11 }
	          maxZoom={ 20 }
	          ext="png"
	          opacity={ 0.4 }
	        />
	        <LayerGroup key={ this.props.city }>
	          <GeoJSON
	            data={ layers.nhoods }
	            key={ (feature) => feature.properties.name }
	            style={ this.getStyle }
	            onClick={ this.props.onClick }
	            onEachFeature={ this.handleFeature }
	          />
	          <GeoJSON
	            data={ layers.mesh }
	            style={ cityStyle }
	            interactive={ false }
	          />
	          <GeoJSON
	            data={ layers.merge }
	            style={ cityStyle }
	            interactive={ false }
	          />
	        </LayerGroup>
	      </Map>
				<Legend
					colorscale={ this.props.colorscale }
					meta={ this.props.meta }
				/>
	    </div>
	  );
	}
};
