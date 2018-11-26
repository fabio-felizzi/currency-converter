import React, { Component } from 'react';
import CurrencyConverter from './Components/CurrencyConverter'; 
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="app">
        <CurrencyConverter />
      </div>
    );
  }
}

export default App;
