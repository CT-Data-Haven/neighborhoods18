import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useForm, FormContext } from 'react-hook-form';
import { schemeGnBu as palette, schemeGreys as grays } from 'd3-scale-chromatic';
import { FaChartBar, FaGlobeAmericas } from 'react-icons/fa';

import Controls from './components/Controls';
import { ChartStage, TableStage } from './components/Stage';
import DataTable from './components/DataTable';
import Profile from './components/Profile';
import Intro from './components/Intro';
import VizContainer from './components/VizContainer';
import Choropleth from './components/Choropleth';
import Chart from './components/Chart';
import Footer from './components/Footer';
import { getMappable, makeTitle, displayIndicator, getNhoods, getProfile, makeMapData, makeBarData, makeChoroScale, makeBarScale, filterByKey } from './components/utils.js';

import './App.css';

import meta from './data/nhood_meta_2018.json';
import data from './data/nhood_wide_2018.json';
import sources from './data/sources.json';
// import shapes from './shapes/cities_topo_layers.json';
const shapes = {
  new_haven: require('./shapes/new_haven_topo.json'),
  bridgeport: require('./shapes/bridgeport_topo.json'),
  hartford: require('./shapes/hartford_topo.json'),
  stamford: require('./shapes/stamford_topo.json')
};

const App = () => {
  const formMethods = useForm({
    mode: 'onChange'
  });
  const topics = Object.keys(meta);
  const cities = Object.keys(data);

  const initValues = {
    topic: topics[0],
    city: cities[0],
    // indicator: getMappable(meta, topics[0])[0].indicator
    indicator: getMappable(meta[topics[0]])[0].indicator
  };

  // state
  const [topic, setTopic] = useState(initValues.topic);
  const [city, setCity] = useState(initValues.city);
  const [indicator, setIndicator] = useState(initValues.indicator);
  const [nhood, setNhood] = useState(getNhoods(data[city][topic])[0]);

  // event handling
  const onChange = (formData, e) => {
    const { cSelect, tSelect, iSelect } = formMethods.getValues();

    if (e.target.name === 'tSelect') {
      setIndicator(getMappable(meta[tSelect])[0].indicator);
    } else {
      setIndicator(iSelect);
    }

    setTopic(tSelect);
    setCity((prevCity) => cSelect);

    if (e.target.name === 'cSelect') {
      setNhood(getNhoods(data[cSelect][topic])[0]);
    }
  };

  const onNhood = (row, isSelect, rowIndex) => {
    setNhood(row.location);
  };

  const featureClick = ({ layer }) => {
    setNhood(layer.feature.properties.name);
  };

  const barClick = (d) => (
    setNhood(d.location)
  );


  const mapData = makeMapData(data[city][topic], indicator);
  const barData = makeBarData(data[city][topic], indicator);
  const topicMeta = meta[topic];

  return (
    <div className='App'>

      <Container>
        <header className='app-header'>
          <h1>Connecticut Neighborhood Profiles</h1>
        </header>

        { /* INTRO ROW */ }
        <Row>
          <Col>
            <Intro />
          </Col>
        </Row>

        <Row>
          <Col>
            <FormContext { ...formMethods }>
              <Controls
                onChange={ formMethods.handleSubmit(onChange) }
                topics={ topics }
                indicators={ getMappable(topicMeta) }
                cities={ cities }
                meta={ meta }
              />
            </FormContext>
          </Col>
        </Row>

        <hr />


        { /* VIZ */ }
        <Row>
          <Col md={ 7 }>
            <ChartStage
              location={ makeTitle(city, false) }
              lbl={ displayIndicator(topicMeta['indicators'], indicator) }
              type='short'
            >
              <VizContainer
                tabs={{
                  map: { title: 'Show map', icon: <FaGlobeAmericas /> },
                  chart: { title: 'Show chart', icon: <FaChartBar /> }
                }}
              >
                <Chart
                  key='chart'
                  data={ barData }
                  oAccess={ 'location' }
                  rAccess={ indicator }
                  colorscale={ makeBarScale(barData, grays) }
                  onClick={ barClick }
                  meta={ filterByKey(topicMeta['indicators'], 'indicator', indicator) }
                  accent={ palette[6][5] }
                  nhood={ nhood }
                />
                <Choropleth
                  key='map'
                  data={ mapData }
                  shape={ shapes[city] }
                city={ city }
                colorscale={ makeChoroScale(mapData, palette, 6) }
                onClick={ featureClick }
                meta={ filterByKey(topicMeta['indicators'], 'indicator', indicator) }
              />

            </VizContainer>
          </ChartStage>

          </Col>

          { /* PROFILE */ }
          <Col md={ 5 }>
            <TableStage
              location={ nhood }
              lbl={ topicMeta.display }
              type='short'
            >
              <Profile
                data={ getProfile(data[city][topic], nhood, topicMeta.indicators) }
              />
            </TableStage>
          </Col>
        </Row>

        <hr />

        { /* TABLE ROW */ }
        <Row>
          <Col>
            <TableStage
              location={ makeTitle(city, false) }
              lbl={ topicMeta.display }
              type='long'
            >
              <DataTable
                data={ data[city][topic] }
                meta={ topicMeta }
                onSelect={ onNhood }
                nhood={ nhood }
                sort={ true }
              />
            </TableStage>
          </Col>
        </Row>

        <hr />

        { /* FOOTER ROW */ }
        <Row>
          <Col>
            <Footer sources={ sources } city={ city } />
          </Col>
        </Row>
      </Container>
    </div>
  )
};

export default App;
