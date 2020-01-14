import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';

import '../styles/Profile.css';

const Profile = (props) => {
  // const data = React.useContext(DataContext);
  const data = props.data;

  const opticAdj = (row, rowIndex) => {
    if (row.value.indexOf('%') !== -1) {
      return 'percent';
    }
  };

  const cols = [{
    dataField: 'indicator',
    text: 'Indicator',
    classes: 'table-header-col'
  }, {
    dataField: 'value',
    text: 'Value',
    align: 'right',
    classes: 'text-right'
  }];


  return (
    <div className='Profile DataTable' id='profile'>
      <BootstrapTable
        bootstrap4
        classes='table'
        headerClasses='thead-light'
        bordered={ false }
        keyField={ 'indicator' }
        data={ data }
        columns={ cols }
        rowClasses={ opticAdj }
        wrapperClasses='table-responsive'
      />
    </div>
  )
};

export default Profile;
