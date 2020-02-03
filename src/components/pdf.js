import * as _ from 'lodash';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'd3-format';
import logo from '../img/logo_sm.jpg';

const margin = { x: 0.65, y: 0.4 };
const defaultStyle = {
  styles: { halign: 'right', lineWidth: 0.01, lineColor: '#b3cccf', fontSize: 9, cellPadding: 0.04 },
  headStyles: { halign: 'left', fillColor: '#d7eaec', textColor: 'black' },
  columnStyles: {
    indicator: { halign: 'left', cellWidth: 1.5 }
  },
  theme: 'grid'
};



const filterByNhood = (data, meta, nhood) => (
  // iterates over topic-data object
  _.chain(data)
    .mapValues((tData) => {
      const nhoodData = _.find(tData, { 'location': nhood });
      if (nhoodData) {
        const i = _.toNumber(nhoodData.level.charAt(0));
        return _.filter(tData, (d) => {
          const j = _.toNumber(d.level.charAt(0));
          return (j < i) || (j === i && d.location === nhood);
        });
      }
    })
    .omitBy(_.isUndefined)
    .value()
);

const makeTopicTbl = (data, meta, nhood) => {
  // data is e.g. filtered.age
  // meta is e.g. meta.age.indicators
  // only want indicators that have data for nhood
  const vars = _.difference(_.keys(data[0]), ['level', 'location']);
  const cols = ['indicator', ..._.map(data, 'location')];

  const rows = vars.map((i) => {
    const m = _.find(meta.indicators, { 'indicator': i});
    const vals = _.map(data, (d) => format(m.format)(d[i]));
    const d = _.zipObject(_.map(data, 'location'), vals);
    const indicator = m.display;
    const row = { 'indicator': indicator, ...d };
    return row;
  });

  const hdrs = cols.map((d) => ({
    title: _.startCase(d),
    dataKey: d
  }));

  return {
    columns: hdrs,
    body: rows,
    heading: meta.display
  };
};

const addTbl = (doc, tbl) => {
  let startY;
  if (doc.previousAutoTable.finalY === undefined) {
    startY = margin.y * 3;
  } else if (doc.previousAutoTable.finalY > 9) {
    doc.addPage();
    startY = margin.y * 2.5;
  } else {
    startY = doc.previousAutoTable.finalY + margin.y;
  }

  doc.setFontSize(10);
  doc.text(tbl.heading, margin.x, startY);

  doc.autoTable({
    columns: tbl.columns,
    body: tbl.body,
    startY: startY + margin.y * 0.25
  });
}

const createPdf = (data, meta, nhood, city) => {
  const filtered = filterByNhood(data, meta, nhood);

  let doc = new jsPDF({ unit: 'in', format: 'letter'});
  doc.autoTableSetDefaults(defaultStyle);

  doc.setFontSize(12);
  doc.text(`2018 DataHaven Neighborhood Profiles: ${ nhood }, ${ _.startCase(city) }`, margin.x, margin.y * 2);
  doc.setFontSize(9);

  const tbls = _.keys(filtered)
    .map((topic) => makeTopicTbl(filtered[topic], meta[topic], nhood))
    .forEach((tbl) => addTbl(doc, tbl));

  const pages = doc.internal.getNumberOfPages();
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();

  for (var i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Page ${ i } of ${ pages } -- Generated at https://www.ctdatahaven.org/data-dashboard`, margin.x, height - margin.y);
    const img_w = 1.43;
    const img_h = 0.48;
    doc.addImage(logo, 'PNG', width - margin.x - img_w, height - margin.y - img_h, img_w, img_h);
  }

  doc.save(`${ _.snakeCase(nhood) }_2018_dh_profile.pdf`);
};

export { createPdf };