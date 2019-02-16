import React, { Component } from 'react';
import countries from 'world-countries';

// Components
import CountryInput from './CountryInput';
import SelectiveMap from './SelectiveMap';

class CountryInserter extends Component {
    constructor(props) {
        super(props);


        const storedCountriesShown = localStorage.getItem('countriesShown');
        this.state = {
            countriesShown: storedCountriesShown ? storedCountriesShown.split(',') : [],
        };

        this.rootClass = 'country-inserter';
        this.correct = false;

        this.independtsLength = 0;
        this.idNameMap = {};
        this.nameIdMap = {};
        for (const country of countries) {
            if (country.independent) {
                this.idNameMap[country.cca2] = country.name.common;
                this.independtsLength++;
                this.nameIdMap[country.name.common.toLowerCase()] = country.cca2;
            }
        }
        //TODO: warn if the map above doesn't make sense with country-id-title-map.json (from SVG)

        this.onCountrySubmit = this.onCountrySubmit.bind(this);
        this.onDblClick = this.onDblClick.bind(this);

        this.all = false;
    }

    componentDidMount() {
        window.addEventListener('dblclick', this.onDblClick)
    }

    componentWillUnmount() {
        window.removeEventListener('dblclick', this.onDblClick)
    }

    onDblClick() {
        if (this.all) {
            this.setState({countriesShown: []});
            localStorage.setItem('countriesShown', '');
            this.all = false;
            console.log('cleared');
        } else {
            this.setState({countriesShown: Object.keys(this.idNameMap)});
            localStorage.setItem('countriesShown', Object.keys(this.idNameMap).join(','));
            this.all = true;
            console.log('haxxor');
        }
    }

    onCountrySubmit(value) {
        value = value.toLowerCase();
        if (this.nameIdMap.hasOwnProperty(value)) {
            const id = this.nameIdMap[value];
            let countriesShown = this.state.countriesShown;
            if (!countriesShown.includes(id)) {
                countriesShown.push(id);
                this.correct = true;
                localStorage.setItem('countriesShown', countriesShown);
                this.setState({countriesShown});
            }
        }
    }

    render() {
        return (
            <div className={this.rootClass}>
                <CountryInput placeholder={'Enter a country name'}
                              onSubmit={this.onCountrySubmit}
                              clear={(() => {
                                  if (this.correct) {
                                      this.correct = false;
                                      return true;
                                  } else {
                                      return false;
                                  }
                              })()}
                />
                <SelectiveMap countriesShown={this.state.countriesShown} />
                <div className={this.rootClass + '__lower'} />
            </div>
        );
    }
}

export default CountryInserter;
