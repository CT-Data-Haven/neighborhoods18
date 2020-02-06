import * as _ from 'lodash';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'd3-format';
import logo from '../img/logo_sm.jpg';

const margin = { x: 0.65, y: 0.45 };
const defaultStyle = {
  styles: { halign: 'right', lineWidth: 0.01, lineColor: '#b3cccf', fontSize: 9, cellPadding: 0.04 },
  headStyles: { halign: 'left', fillColor: '#d7eaec', textColor: 'black' },
  columnStyles: {
    indicator: { halign: 'left', cellWidth: 2 }
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
  } else if (doc.previousAutoTable.finalY > 8.5) {
    doc.addPage();
    startY = margin.y * 2.5;
  } else {
    startY = doc.previousAutoTable.finalY + margin.y;
  }

  doc.setFontSize(9);
  doc.text(tbl.heading, margin.x, startY);

  doc.autoTable({
    columns: tbl.columns,
    body: tbl.body,
    startY: startY + margin.y * 0.25,
    margin: margin.x,
    pageBreak: 'avoid'
  });

  return doc.previousAutoTable.finalY;
};

const addSrcs = (doc, startY) => {
  // add sources from sources-div element
  let srcs = [...document.getElementById('sources-ul').children]
    .map((s) => `* ${ s.innerText }`);
  srcs.unshift('Source: DataHaven analysis (2019) of');

  _.chain(srcs)
    .map((s) => doc.splitTextToSize(s, 7))
    .flattenDeep()
    .each((d, i) => {
      // const y = startY + 2 * margin.y + 0.2 * i;
      const y = startY + margin.y + 0.2 * i;
      // const y = Math.max(max_y, last_y) + 2 * margin.y + 0.2 * i;
      const txt = (d.charAt(0) !== '*' && i > 0) ? `\t${ d }` : d;
      doc.text(txt, margin.x, y);
    })
    .value();
};

const addGeo = (doc, startY) => {
  let geo = [...document.getElementById('geo-div').children]
    .map((g) => g.innerText);
  _.chain(geo)
    .map((g) => doc.splitTextToSize(g, 7))
    .flattenDeep()
    .each((d, i) => {
      const y = startY + margin.y + 0.2 * i;
      doc.text(d, margin.x, y);
    })
    .value();
};

const addFooter = (doc, pages, width, height) => {
  const today = new Date();
  const img_w = 1.43;
  const img_h = 0.48;

  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Generated ${ today.toDateString() } at https://www.ctdatahaven.org/data-dashboard`, margin.x, height - margin.y - 0.15);
    doc.text(`Page ${ i } of ${ pages }`, margin.x, height - margin.y);

    doc.addImage(logo, 'PNG', width - margin.x - img_w, height - margin.y - img_h, img_w, img_h);
  }
};

const createPdf = (data, meta, nhood, city) => {
  const filtered = filterByNhood(data, meta, nhood);

  let doc = new jsPDF({ unit: 'in', format: 'letter'});
  doc.autoTableSetDefaults(defaultStyle);

  doc.setFontSize(12);
  doc.text(`2020 DataHaven Neighborhood Profiles: ${ nhood }, ${ _.startCase(city) }`, margin.x, margin.y * 2);
  doc.setFontSize(9);

  const tbls = _.keys(filtered)
    .map((topic) => makeTopicTbl(filtered[topic], meta[topic], nhood))
    .map((tbl) => addTbl(doc, tbl));

  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();



  // sources take about 3 inches. If at least 3 inches available after last_y, place 3 in above margin. If not, add new page first
  const src_h = 1.3;
  const geo_h = 2;
  if (height - tbls[tbls.length - 1] - margin.y < (src_h + geo_h)) {
    doc.addPage();
    addSrcs(doc, margin.y * 1.5);
    addGeo(doc, margin.y * 1.5 + src_h);
  } else {
    addSrcs(doc, height - margin.y - src_h - geo_h);
    addGeo(doc, height - margin.y - geo_h);
  }


  addFooter(doc, doc.internal.getNumberOfPages(), width, height);

  const city_abbr = city.replace(/[aeiou_]/g, '');

  doc.save(`${ _.snakeCase(nhood) }_${ city_abbr }_2018_dh.pdf`);
};

export { createPdf };
