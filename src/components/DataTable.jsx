import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import { tblColumns } from './utils.js';

import '../styles/DataTable.css';

const DataTable = (props) => {
  // const data = React.useContext(DataContext);
  const data = props.data;
  // get names of last element in data, since first few (e.g. Connecticut, Hartford) won't have town but neighborhood data points will
  const cols = tblColumns(props.meta.indicators, Object.keys(data[data.length - 1]), ['level'], true);
  // const nonselectable = getNonSelect(data);
  const selectRow = {
    mode: 'radio',
    clickToSelect: true,
    onSelect: props.onSelect,
    // nonSelectable: nonselectable,
    selected: [props.nhood],
    hideSelectColumn: true,
    // nonSelectableClasses: 'row-no-hover',
    classes: 'table-info'
  };

  return (
    <div className='DataTable' id='datatable'>
      <BootstrapTable
        bootstrap4
        classes='row-hover'
        hover
        condensed
        headerClasses='thead-light'
        wrapperClasses='table-responsive-xl'
        bordered={ true }
        keyField={ 'location' }
        data={ data }
        columns={ cols }
        selectRow={ selectRow }
      />
    </div>
  );

};

export default DataTable;
