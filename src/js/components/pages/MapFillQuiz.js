import React, { Component } from 'react';
import countries from 'world-countries';

import b from '../../includes/Bem'
import commonNonIndependents from '../../../data/common-non-independents';

// Components
import QuizInput from '../QuizInput';
import SelectiveMap from '../SelectiveMap';
import Notifiable from '../Notifiable'

class MapFillQuiz extends Component {
    constructor(props) {
        super(props);

        const storedCountriesShown = localStorage.getItem('countriesShown');
        this.state = {
            countriesShown: storedCountriesShown ? storedCountriesShown.split(',') : [],
            underInputNotification: null,
        };

        this.b = b('map-fill-quiz');

        this.inputRef = null;
        this.clearUnderInputNotificationTimeout = null;
        this.underInputNotificationDisplayTime = 3500; // ms.

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
        if (!value) return;

        value = value.toLowerCase();
        const properCaseValue = value.replace(/\b(\w)/g, s => s.toUpperCase());
        if (this.placeNames.hasOwnProperty(value)) {
            if (this.placeNames[value]) {
                // `value` is an independent country name.
                this.setUnderInputNotification(null);
                const id = this.placeNames[value];
                let countriesShown = this.state.countriesShown;
                if (!countriesShown.includes(id)) {
                    countriesShown.push(id);
                    this.inputRef.value = '';
                    localStorage.setItem('countriesShown', countriesShown);
                    this.setState({countriesShown});
                } else {
                    this.setUnderInputNotification(`You've already got ${properCaseValue} on the map!`)
                }
            } else {
                // `value` is a country name but not independent.
                this.setUnderInputNotification(`${properCaseValue} is a place of sorts, but not an independent country.`);
            }
        }
    };

    clearProgress = () => {
        this.setState({countriesShown: []});
        localStorage.setItem('countriesShown', '');
    };

    setUnderInputNotification = (message) => {
        if (!message) {
            this.setState({underInputNotification: null});
        } else if (message !== this.state.underInputNotification) {
            this.setState({underInputNotification: message});
            clearTimeout(this.clearUnderInputNotificationTimeout);
            this.clearUnderInputNotificationTimeout = setTimeout(() => {
                this.setState({underInputNotification: null});
            }, this.underInputNotificationDisplayTime);
        }
    };

    render() {
        const b = this.b;
        return (
            <div className={b}>
                <div className={b.el('upper')}>
                    <div className={b.el('progress')}
                         tooltip='Independent countries on the map'
                    >
                        {
                            this.state.countriesShown.length + ' / ' +
                            Object.values(this.placeNames).filter(value => !!value).length
                        }
                    </div>
                    <Notifiable extraClassName={b.el('country-input')}
                                message={this.state.underInputNotification}
                    >
                        <QuizInput placeholder={'Enter a country name'}
                                   onChange={() => this.setUnderInputNotification(null)}
                                   onSubmit={this.onCountrySubmit}
                                   inputRefCallback={(ref) => this.inputRef = ref}
                        />
                    </Notifiable>
                    <button className={'button--negative'} onClick={this.clearProgress}>Clear progress</button>
                </div>
                <SelectiveMap countriesShown={this.state.countriesShown} />
            </div>
        );
    }
}

export default MapFillQuiz;
