import React, { Component } from 'react';
import axios from "axios";
import { parseString } from 'xml2js';

import './CurrencyConverter.css';

class CurrencyConverter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fromCurrency: "USD",
            toCurrency: "GBP",
            fromRate: "",
            toRate: "",
            currencies: [],
            toAmount: 1,
            fromAmount: 1,
            fromResult: null,
            toResult: null,
        };

        this.submitHandler.bind(this);
    }

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

                this.setState({
                    currencies,
                    fromCurrency: currencies[0].currency,
                    toCurrency: currencies[1].currency,
                });
            })
            .catch(err => {
                console.log("Something went wrong!", err.message);
            });
    }

    selectHandler = (event) => {
        if (event.target.name === "from") {
            this.setState({
                fromCurrency: event.target.value,
                fromRate: this.state.currencies.filter(currency =>
                    currency.currency === this.state.fromCurrency),
            })
        }
        if (event.target.name === "to") {
            this.setState({
                toCurrency: event.target.value,
                toRate: this.state.currencies.filter(currency =>
                    currency.currency === this.state.toCurrency),
            })
        }
    }

    submitHandler() {
        this.setState({
            fromResult: this.state.fromRate[0].rate * this.state.fromAmount || this.state.fromRate[0].rate * this.state.toAmount,
            toResult: this.state.toRate[0].rate * this.state.toAmount || this.state.toRate[0].rate * this.state.fromAmount,
        });
    }

    render() {
        const { fromAmount, toAmount, fromCurrency, toCurrency, fromRate, toRate, fromResult,
            toResult, currencies } = this.state;

        return (
            <div className="converter">
                <h1>Currency Converter</h1>
                <div className="Form">
                    <div className="valueWrapper">
                        <p>{fromRate ? `1 ${fromCurrency} = ${fromRate[0].rate}` : null}</p>
                        <select
                            name="from"
                            className="dropdown"
                            onChange={(event) => this.selectHandler(event)}
                            value={fromCurrency}
                        >
                            {currencies.map(cur => (
                                <option key={cur.currency} rate={cur.rate}>{cur.currency}</option>
                            ))}
                        </select>
                        <input
                            name="amount"
                            className="amount"
                            type="text"
                            value={fromAmount}
                            onChange={event => {
                                this.setState({ fromAmount: event.target.value })
                                this.submitHandler()
                            }}
                        />
                        <div className="result">
                            {fromResult &&
                                <h3 className="toResult">{`${fromCurrency} ${toResult}`}</h3>
                            }
                        </div>
                    </div>
                    <div className="valueWrapper">
                        <p>{toRate ? `1 ${toCurrency} = ${toRate[0].rate}` : null}</p>
                        <select
                            name="to"
                            className="dropdown"
                            onChange={(event) => this.selectHandler(event)}
                            value={toCurrency}
                        >
                            {currencies.map(cur => (
                                <option key={cur.currency} rate={cur.rate}>{cur.currency}</option>
                            ))}
                        </select>
                        <input
                            name="amount"
                            className="amount"
                            type="text"
                            value={toAmount}
                            onChange={event => {
                                this.setState({ toAmount: event.target.value })
                                this.submitHandler()
                            }}
                        />
                        <div className="result">
                            {toResult &&
                                <h3 className="fromResult">{`${toCurrency} ${fromResult}`}</h3>
                            }
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default CurrencyConverter;