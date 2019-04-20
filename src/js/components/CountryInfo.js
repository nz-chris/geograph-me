// External
import React, {Component} from 'react';
import FlagIcon from './FlagIcon'
import currencies from 'currency-codes'
import PropTypes from 'prop-types';
import getSymbolFromCurrency from 'currency-symbol-map';
// Helpers / Constants
import b from '../includes/Bem';

class CountryInfo extends Component {
    constructor(props) {
        super(props);

        this.b = b('country-info');
    }

    render() {
        const b = this.b;
        const country = this.props.country;
        return (
            <div className={b}
                 style={(() => {
                     const style = {};
                     const bodyWidth = document.body.clientWidth;
                     const bodyHeight = document.body.clientHeight;
                     if (this.props.mouseEvent.offsetX > bodyWidth / 2) {
                         style['right'] = bodyWidth - this.props.mouseEvent.offsetX;
                     } else {
                         style['left'] = this.props.mouseEvent.offsetX;
                     }
                     if (this.props.mouseEvent.offsetY > bodyHeight / 2) {
                         style['bottom'] = bodyHeight - this.props.mouseEvent.pageY;
                     } else {
                         style['top'] = this.props.mouseEvent.offsetY;
                     }
                     return style;
                 })()}
            >
                <span><strong>{country.name.common}</strong>&emsp;;<FlagIcon code={country.cca2.toLowerCase()} size={'lg'} /></span><br /><br />
                <span><strong>Official name:</strong> {country.name.official}</span><br />
                <span><strong>Capital:</strong> {country.capital}</span><br />
                {(() => {
                    const languageList = Object.values(country.languages).join(', ');
                    if (Object.keys(country.languages).length > 1) {
                        return <span><strong>Languages:</strong> {languageList}</span>;
                    } else if (Object.keys(country.languages).length === 1) {
                        return <span><strong>Language:</strong> {languageList}</span>;
                    } else {
                        return '';
                    }
                })()}<br />
                <span><strong>Demonym:</strong> {country.demonym}</span><br />
                {(() => {
                    let currenciesList = country.currency.map((currencyCode) => {
                        const currency = currencies.code(currencyCode);
                        const currencySymbol = getSymbolFromCurrency(currencyCode);
                        if (currency) {
                            let currencyInfo = `${currency.currency}`;
                            if (currencySymbol) {
                                currencyInfo += ` ${currencySymbol}`;
                            }
                            if (currencyCode !== currencySymbol) {
                                currencyInfo += ` ${currencyCode}`;
                            }
                            return currencyInfo;
                        } else {
                            return false;
                        }
                    });
                    currenciesList = currenciesList.filter(currencyInfo => currencyInfo);
                    if (currenciesList.length > 1) {
                        return <span><strong>Currencies:</strong> {currenciesList.join(', ')}</span>;
                    } else if (currenciesList.length === 1) {
                        return <span><strong>Currency:</strong> {currenciesList}</span>;
                    } else {
                        return '';
                    }
                })()}<br />
                <span><strong>Area:</strong> {country.area.toLocaleString()} km&#178;</span>
            </div>
        );
    }
}

CountryInfo.defaultProps = {
    mouseEvent: {offsetX: 0, offsetY: 0},
};

CountryInfo.propTypes = {
    country: PropTypes.object,
    mouseEvent: PropTypes.object,
};

export default CountryInfo;
