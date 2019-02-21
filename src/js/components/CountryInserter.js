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

        this.nameIdMap = {};
        for (const country of countries) {
            if (country.independent) {
                this.nameIdMap[country.name.common.toLowerCase()] = country.cca2;
            }
        }


        this.onCountrySubmit = this.onCountrySubmit.bind(this);
        this.clearProgress = this.clearProgress.bind(this);
    }

    onCountrySubmit(value) {
        if (!value) return;

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

    clearProgress() {
        this.setState({countriesShown: []});
        localStorage.setItem('countriesShown', '');
        this.forceUpdate(this.forceUpdate);
    }

    render() {
        return (
            <div className={this.rootClass}>
                <div className={this.rootClass + '__upper'}>
                    <div className={this.rootClass + '__progress'}
                         tooltip="Independent countries on the map"
                    >
                        {this.state.countriesShown.length + ' / ' + Object.keys(this.nameIdMap).length}
                    </div>
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
                    <button onClick={this.clearProgress}>Clear progress</button>
                </div>
                <SelectiveMap countriesShown={this.state.countriesShown} />
                <div className={this.rootClass + '__lower'} />
            </div>
        );
    }
}

export default CountryInserter;
