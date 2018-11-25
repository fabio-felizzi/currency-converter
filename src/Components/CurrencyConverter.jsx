import React, { Component } from 'react';
import axios from "axios";
import { parseString } from 'xml2js'; 

class CurrencyConverter extends Component {
  state = {
    fromCurrency: "USD",
    toCurrency: "GBP",
    currencies: [],
    rates: [],
  };

  componentDidMount() {
    axios
        .get("https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml")
        .then(response => {
            const xml = response.data;
            const currencies = [];
            const rates = [];

            parseString(xml, (err, result) => {
              const currencyArr = result['gesmes:Envelope'].Cube[0].Cube[0].Cube;
              currencyArr.map((country) => {
                currencies.push(country.$.currency);
                rates.push(country.$.rate);
              });
            });
            this.setState({ currencies, rates });
        })
        .catch(err => {
            console.log("Something went wrong!", err.message);
        });
  }

  
  render() {
    return (
      <div className="converter">
        
      </div>
    );
  }
}

export default CurrencyConverter;
