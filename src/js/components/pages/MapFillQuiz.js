import React, { Component } from 'react';
import countries from 'world-countries';

import utils from '../../utils/Utils'
import commonNonIndependents from '../../../data/common-non-independents';

// Components
import CountryInput from '../CountryInput';
import SelectiveMap from '../SelectiveMap';

class MapFillQuiz extends Component {
    constructor(props) {
        super(props);

        const storedCountriesShown = localStorage.getItem('countriesShown');
        this.state = {
            countriesShown: storedCountriesShown ? storedCountriesShown.split(',') : [],
            underInputNotification: null,
        };

        this.rootClass = 'map-fill-quiz';

        this.inputRef = null;

        // Map place names to their cca2 if they are independent countries, false otherwise.
        this.placeNames = {};
        for (const country of countries) {
            const commonNameLower = country.name.common.toLowerCase();
            country.independent ?
                this.placeNames[commonNameLower] = country.cca2
                :
                this.placeNames[commonNameLower] = false;
        }
        for (const place of commonNonIndependents) {
            this.placeNames[place.toLowerCase()] = false;
        }
    }

    onCountrySubmit = (value) => {
        this.setState({underInputNotification: null});
        if (!value) return;

        value = value.toLowerCase();
        if (this.placeNames.hasOwnProperty(value)) {
            if (this.placeNames[value]) {
                // `value` is an independent country name.
                const id = this.placeNames[value];
                let countriesShown = this.state.countriesShown;
                if (!countriesShown.includes(id)) {
                    countriesShown.push(id);
                    this.inputRef.value = '';
                    localStorage.setItem('countriesShown', countriesShown);
                    this.setState({countriesShown});
                }
            } else {
                // `value` is a country name but not independent.
                const properCaseValue = value.replace(/\b(\w)/g, s => s.toUpperCase());
                this.setState({underInputNotification: `${properCaseValue} is a place of sorts, but not an independent country.`});
                // this.inputRef.setAttribute('underNotification', `${properCaseValue} is a place of sorts, but not an independent country.`)
            }
        }
    };

    clearProgress = () => {
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
                        {this.state.countriesShown.length + ' / ' + Object.keys(this.placeNames).length}
                    </div>
                    <span tooltip="the styles on country-input need to be on this span! yikes. best way to achieve this? new component? think.">
                    <CountryInput placeholder={'Enter a country name'}
                                  onSubmit={this.onCountrySubmit}
                                  inputRefCallback={(ref) => this.inputRef = ref}
                    /></span>
                    {
                        /*
                        ideas...
                        <Notifiable message={this.state.underInputNotification}>
                            <CountryInput placeholder={'Enter a country name'}
                                          onSubmit={this.onCountrySubmit}
                                          inputRefCallback={(ref) => this.inputRef = ref}
                            />
                         </Notifiable>
                         OR
                         <CountryInput placeholder={'Enter a country name'}
                                      onSubmit={this.onCountrySubmit}
                                      inputRefCallback={(ref) => this.inputRef = ref}
                                      underNotification={this.state.underInputNotification}     <------ This will behave like the _tooltip.scss, except not on hover. set this state to null after 3s or something?
                         />
                         */
                    }
                    <button onClick={this.clearProgress}>Clear progress</button>
                </div>
                <SelectiveMap countriesShown={this.state.countriesShown} />
            </div>
        );
    }
}

export default MapFillQuiz;
