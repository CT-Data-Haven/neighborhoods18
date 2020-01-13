import React from 'react';

const { Provider, Consumer } = React.createContext();

class IndicatorDataProvider extends React.Component {
  render() {
    return (
      <Provider value={ this.props.value }>{ this.props.children }</Provider>
    );
  }
}

export { IndicatorDataProvider, Consumer as IndicatorDataConsumer };
