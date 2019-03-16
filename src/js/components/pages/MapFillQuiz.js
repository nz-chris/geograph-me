import React, { Component } from 'react';
import countries from 'world-countries';

import utils from '../../utils/Utils'

// Components
import CountryInput from '../CountryInput';
import SelectiveMap from '../SelectiveMap';

class MapFillQuiz extends Component {
    constructor(props) {
        super(props);

        const storedCountriesShown = localStorage.getItem('countriesShown');
        this.state = {
            countriesShown: storedCountriesShown ? storedCountriesShown.split(',') : [],
        };

        this.rootClass = 'map-fill-quiz';

        this.correct = false;

        this.nameIdMap = {};
        for (const country of countries) {
            if (country.independent) {
                this.nameIdMap[country.name.common.toLowerCase()] = country.cca2;
            }
        }
    }

    onCountrySubmit = (value) => {
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
    };

    clearProgress= () => {
        this.setState({countriesShown: []});
        localStorage.setItem('countriesShown', '');
    };

    render() {
        return (
            <div className={this.rootClass}>
                <div className={utils.el(this.rootClass, 'upper')}>
                    <div className={utils.el(this.rootClass, 'progress')}
                         tooltip='Independent countries on the map'
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
            </div>
        );
    }
}

export default MapFillQuiz;
