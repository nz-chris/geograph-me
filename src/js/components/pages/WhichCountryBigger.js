import React, {Component} from 'react';
import utils from '../../utils/utils';

import countryAreaComparisonList from '../../../data/country-area-comparison-list-descending';
import cca2CountryMap from '../../../data/cca2-country-map';

class WhichCountryBigger extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentComparison: null
        };

        this.rootClass = 'which-country-bigger';

        this.level = 0;

        // Map of cca2s that have been used too recently, so are hidden from selection for a bit.
        // Cca2 as key, cool down as value.
        this.hiddenCountries = {};
        // How many rounds of choosing the next comparison from the top 100 should a hidden country stay hidden.
        this.hiddenCoolDown = 5;

        this.countryAreaComparisonList = [...countryAreaComparisonList];
    }

    componentDidMount() {
        this.setState({currentComparison: this.getNextComparison()});
    }

    decrementHiddenCountryCoolDowns() {
        for (const key of Object.keys(this.hiddenCountries)) {
            const currentCooldown = this.hiddenCountries[key];
            if (currentCooldown > 1) {
                this.hiddenCountries[key] = this.hiddenCountries[key] - 1;
            } else {
                delete this.hiddenCountries[key];
            }
        }
    }

    getRandomTop100Comparison() {
        const filteredCountryAreaComparisonList = this.countryAreaComparisonList.filter((comparison) => {
            // Include the comparison if both countries do not have a cool down.
            return (
                !this.hiddenCountries[comparison.largerCountry] > 0 &&
                !this.hiddenCountries[comparison.smallerCountry] > 0
            );
        });

        this.decrementHiddenCountryCoolDowns();

        const index = Math.floor(Math.random() * Math.min(filteredCountryAreaComparisonList.length, 100));
        const comparison = filteredCountryAreaComparisonList[index];

        // If there is no valid comparison remaining, GAME OVER!
        if (comparison === undefined) {
            return null;
        }

        // Delete the comparison so it can't be used again.
        this.countryAreaComparisonList.splice(index, 1);

        this.hiddenCountries[comparison.largerCountry] = this.hiddenCoolDown;
        this.hiddenCountries[comparison.smallerCountry] = this.hiddenCoolDown;
        return comparison;
    }

    getRandomNextComparisonByCurrentComparison(currentComparison) {
        // Fallback in case some idiot uses this function incorrectly.
        if (!currentComparison) {
            return this.getRandomTop100Comparison();
        }

        const keptCountry = currentComparison.largerCountry;

        const keptCountryWinsAgain = utils.coinToss();

        // The next ten comparisons involving `keptCountry`.
        // Called next ten but really it's a maximum of ten, can be less (especially late game).
        const nextTen = [];
        for (const comparison of this.countryAreaComparisonList) {
            if (comparison.areaDiff < currentComparison.areaDiff) {
                if (keptCountryWinsAgain) {
                    if (comparison.largerCountry === keptCountry) {
                        nextTen.push(comparison);
                    }
                } else {
                    if (comparison.smallerCountry === keptCountry) {
                        nextTen.push(comparison);
                    }
                }
            }
            if (nextTen.length  === 10) {
                break;
            }
        }
        const comparison = nextTen[Math.floor(Math.random() * Math.min(nextTen.length, 10))];
        if (comparison === undefined) {
            return this.getRandomTop100Comparison();
        } else {
            return comparison;
        }
    }

    getNextComparison = () => {
        let comparison;
        if (this.level % 2 === 0) {
            comparison = this.getRandomTop100Comparison();
        } else {
            comparison = this.getRandomNextComparisonByCurrentComparison(this.state.currentComparison);
        }
        this.level++;
        this.setState({currentComparison: comparison});
        return comparison;
    };

    submitAnswer = (country) => {
        if (this.state.currentComparison.largerCountry === country) {
            this.getNextComparison();
        }
    };

    render() {
        if (!this.state.currentComparison) {
            return null;
        }

        let leftCountry;
        let rightCountry;
        if (utils.coinToss()) {
            leftCountry = this.state.currentComparison.largerCountry;
            rightCountry = this.state.currentComparison.smallerCountry;
        } else {
            leftCountry = this.state.currentComparison.smallerCountry;
            rightCountry = this.state.currentComparison.largerCountry;
        }

        return (
            <div className={this.rootClass}>
                <div className={utils.el(this.rootClass, 'left')}
                     onClick={() => { this.submitAnswer(leftCountry)}}
                >
                    {cca2CountryMap[leftCountry].name.common}
                </div>
                <div className={utils.el(this.rootClass, 'right')}
                     onClick={() => { this.submitAnswer(rightCountry)}}
                >
                    {cca2CountryMap[rightCountry].name.common}
                </div>
            </div>
        );
    }
}

export default WhichCountryBigger;
