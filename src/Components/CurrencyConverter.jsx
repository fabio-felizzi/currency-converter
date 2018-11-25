import React, { Component } from 'react';
import axios from "axios";
import { parseString } from 'xml2js'; 

class CurrencyConverter extends Component {
  state = {
    fromCurrency: "USD",
    toCurrency: "GBP",
    fromRate: "",
    toRate: "",
    currencies: [],
    amount: 1,
    result: null,
  };

  componentDidMount() {
    axios
        .get("https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml")
        .then(response => {
            const xml = response.data;
            const currencies = [];
            parseString(xml, (err, result) => {
              const currencyArr = result['gesmes:Envelope'].Cube[0].Cube[0].Cube;
              currencyArr.map((country) => {
                currencies.push(country.$);
              });
            });
            this.setState({ currencies });
        })
        .catch(err => {
            console.log("Something went wrong!", err.message);
        });
  }

  selectHandler = (event) => {
    if (event.target.name === "from") {
        this.setState({ fromCurrency: event.target.value })
    }
    if (event.target.name === "to") {
        this.setState({ toCurrency: event.target.value })
    }
}

  
  render() {
    const { amount, fromCurrency, toCurrency, result, currencies } = this.state;
    console.log(currencies)
    return (
    <div className="converter">
        <div className="Form">
            <input
                name="amount"
                type="text"
                value={amount}
                onChange={event =>
                    this.setState({ amount: event.target.value })
                }
            />
            <select
                name="from"
                onChange={(event) => this.selectHandler(event)}
                value={fromCurrency}
            >
                {currencies.map(cur => (
                    <option key={cur.currency}>{cur.currency}</option>
                ))}
            </select>
            <select
                name="to"
                onChange={(event) => this.selectHandler(event)}
                value={toCurrency}
            >
                {currencies.map(cur => (
                    <option key={cur.currency}>{cur.currency}</option>
                ))}
            </select>
            <button>Convert</button>
        </div>
        {result && 
            <h3>{result}</h3>
        }
    </div>
    );
  }
}

export default CurrencyConverter;
