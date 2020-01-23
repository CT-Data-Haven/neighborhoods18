import * as _ from 'lodash';
import { scaleOrdinal, scaleThreshold } from 'd3-scale';
import { ckmeans } from 'simple-statistics';
// import wordwrap from 'wordwrapjs';
import { format } from 'd3-format';
import * as topojson from 'topojson-client';

const cityDisplay = {
  bridgeport: 'Bridgeport',
  new_haven: 'New Haven',
  hartford: 'Hartford / West Hartford',
  stamford: 'Stamford'
};

const getMappable = (meta) => (
  filterByKey(meta.indicators, 'type', 'm', false)
);

const makeTitle = (lbl, first = true) => {
  const wrds = _.replace(lbl, /_/g, ' ');
  return first ? _.upperFirst(wrds) : _.startCase(wrds);
};

const fmt = (fmtStr) => (
  (d) => (d === null || d === undefined ? 'N/A' : format(fmtStr)(d))
);

const tblColumns = (meta, names, omit = null, sort = false) => {
  const colNames = _.difference(names, omit);

  const cols = colNames.map((name) => {
    const col = filterByKey(meta, 'indicator', name);
    const isNumber = col !== undefined;

    return {
      dataField: (isNumber ? col.indicator : name),
      text: (isNumber ? col.display : _.upperFirst(name)),
      formatter: (isNumber ? fmt(col.format) : null),
      type: (isNumber ? 'number' : 'string'),
      align: (isNumber ? 'right' : 'left'),
      classes: (isNumber ? '' : 'table-header-col'),
      sort
    };
  });
  return cols;
};

const compileHeader = (type) => {
  const headers = {
    long: '<%= lbl %> by <%= dataBy %>, <%= location %>',
    short: '<%= lbl %>, <%= location %>',
    profile: '<%= lbl %> at a glance, <%= location %>'
  };
  return _.template(headers[type]);
};

const filterByKey = (data, key, value, first = true) => (
  first ? _.find(data, { [key]: value }) : _.filter(data, { [key]: value })
);

const displayIndicator = (indicators, indicator) => {
  const meta = filterByKey(indicators, 'indicator', indicator);
  return _.values(meta).length ? meta.display : '';
};

const getNhoods = (data) => (
  _.chain(data)
    .filter((d) => _.endsWith(d.level, 'neighborhood'))
    .map('location')
    .value()
);

const getNonSelect = (data) => (
  _.chain(data)
    .filter((d) => !_.endsWith(d.level, 'neighborhood'))
    .map('location')
    .value()
);

const getProfile = (data, name, meta) => {
  const locData = filterByKey(data, 'location', name);
  return locData ? meta.map((d) => ({
    indicator: d.display,
    value: fmt(d.format)(locData[d.indicator])
  })) : [];
};

const shpLayer = (shps, idx) => (
  topojson.feature(shps, shps.objects[idx])
);

const getBounds = (geo) => {
  const b = topojson.bbox(geo);
  return [[b[1], b[0]], [b[3], b[2]]];
};

const makeGeoJson = (shp) => (
  topojson.feature(shp, shp.objects.city)
);

const makeGeoLayers = (shp) => {
  const nhoods = topojson.feature(shp, shp.objects.city);
  const mesh = topojson.mesh(shp, shp.objects.city, (a, b) => a.properties.town !== b.properties.town);
  const merge = topojson.merge(shp, shp.objects.city.geometries);

  return { nhoods, mesh, merge };
};

const makeMapData = (topicData, indicator) => (
  _.chain(topicData)
    .filter((d) => _.endsWith(d.level, 'neighborhood'))
    .map((d) => ({
      name: d.location,
      value: d[indicator]
    }))
    .keyBy('name')
    .value()
);

const makeBarData = (topicData, indicator) => (
  _.sortBy(topicData, (d) => -d[indicator])
);

const makeChoroScale = (data, scheme, nBrks) => {
  const vals = _.chain(data)
    .mapValues('value')
    .values()
    .sort()
    .value();
  if (!vals.length) {
    return scaleThreshold().domain([0, 1]).range(['#ccc']);
  } else {
    const brks = ckmeans(vals, nBrks).map((d) => d[0]).slice(1);
    return scaleThreshold()
      .domain(brks)
      .range(scheme[nBrks]);
  }
};

const makeBarScale = (data, scheme) => {
  const lvls = _.chain(data)
    .map('level')
    .uniq()
    .sort()
    .reverse()
    .value();
  const grays = _.takeRight(scheme[lvls.length + 3], lvls.length);
  return scaleOrdinal()
    .domain(lvls)
    .range(grays);
};

const makeTooltip = (data, name, meta) => {
  const val = data[name] ? data[name].value : null;
  return `${ name }: ${ fmt(meta.format)(val) }`;
};

const makeDownloads = (city, year = 2018) => ({
  gh: `https://github.com/CT-Data-Haven/2018acs/blob/master/to_distro/${ city }_acs_basic_neighborhood_${ year }.csv`,
  dw: `https://data.world/camille86/neighborhoods18/workspace/file?filename=${ city }_acs_basic_neighborhood_${ year }.csv`,
  dl: `https://raw.githubusercontent.com/CT-Data-Haven/2018acs/master/to_distro/${ city }_acs_basic_neighborhood_${ year }.csv`
});



export {
  getMappable,
  makeTitle,
  tblColumns,
  compileHeader,
  displayIndicator,
  getNhoods,
  filterByKey,
  getProfile,
  getNonSelect,
  cityDisplay,
  shpLayer,
  getBounds,
  makeGeoJson,
  makeGeoLayers,
  makeMapData,
  makeBarData,
  makeChoroScale,
  makeBarScale,
  makeTooltip,
  fmt,
  makeDownloads
};
