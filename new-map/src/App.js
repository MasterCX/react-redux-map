import React, { Component } from 'react';
import { connect } from 'react-redux';
import './stylesheets/App.css'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MapContainer from './containers/MapContainer';
import MenuContainer from './containers/MenuContainer';

class App extends Component {
 
  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <MapContainer/>
          <MenuContainer/>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default connect((store) => (store))(App);
