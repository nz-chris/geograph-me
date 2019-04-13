import React, {Component} from 'react';
import classNames from 'classnames';
import utils from '../../utils/utils';
import Enumeration from '../../includes/Enumeration';
import b from '../../includes/Bem';

import countryAreaComparisonList from '../../../data/country-area-comparison-list-descending';
import cca2CountryMap from '../../../data/cca2-country-map';

class WhichCountryBigger extends Component {
    constructor(props) {
        super(props);

        this.gameStates = new Enumeration({
            //TODO: initial state. for showing the rules and shieeet.
            GUESSING: {value: 1, class: 'guessing'},
            ADVANCING: {value: 2, class: 'advancing'},
            FAILED: {value: 3, class: 'failed'},
            COMPLETE: {value: 4, class: 'complete'},
        });
        this.state = {
            gameState: this.gameStates.GUESSING,
            comparison: null,
            leftCountry: null,
            rightCountry: null,
            progress: 0,
        };
        
        // Map of cca2s that have been used too recently, so are hidden from selection for a bit.
        // Cca2 as key, cool down as value.
        this.hiddenCountries = {};
        // How many rounds should a hidden country stay hidden.
        this.hiddenCoolDown = 5;

        this.countryAreaComparisonList = [...countryAreaComparisonList];

        this.b = b('which-country-bigger'); //TODO: this stuff is working good. Adopt it EVERYWHERE!
        this.block = 'which-country-bigger'; //TODO: Making this variable redundant!
    }

    componentDidMount() {
        this.progressGame();
    }

    setGameState = (gameState, callback=null) => {
        if (gameState !== this.state.gameState && this.gameStates.has(gameState)) {
            this.setState({gameState: gameState}, () => {
                switch (gameState) {
                    case this.gameStates.GUESSING:
                        this.progressGame();
                        break;
                    case this.gameStates.ADVANCING:
                        this.setState({progress: this.state.progress + 1});
                        break;
                    case this.gameStates.FAILED:
                        break;
                    case this.gameStates.COMPLETE:
                        break;
                    default:
                        break;
                }

                callback && callback();
            });
        }
    };

    getDifficultyIncrease(comparison) {
        if (!this.state.comparison) {
            return 1.001;
        }
        return this.state.comparison.areaDiff / comparison.areaDiff;
    }

    isCountryHidden(country) {
        return this.hiddenCountries[country] > 0;
    }

    getFilteredCountryAreaComparisonList() {
        return this.countryAreaComparisonList.filter((comparison) => {
            // Include the comparison if both countries do not have a cool down.
            return (!this.isCountryHidden(comparison.largerCountry) && !this.isCountryHidden(comparison.smallerCountry));
        });
    }

    decrementHiddenCountryCoolDowns() {
        for (const key of Object.keys(this.hiddenCountries)) {
            const currentCoolDown = this.hiddenCountries[key];
            if (currentCoolDown > 1) {
                this.hiddenCountries[key] = currentCoolDown - 1;
            } else {
                delete this.hiddenCountries[key];
            }
        }
    }

    getRandomTop50Comparison() {
        const filteredCountryAreaComparisonList = this.getFilteredCountryAreaComparisonList();

        const index = Math.floor(Math.random() * Math.min(filteredCountryAreaComparisonList.length, 50));
        const comparison = filteredCountryAreaComparisonList[index];

        // If there is no valid comparison remaining, GAME OVER!
        if (comparison === undefined) {
            this.setGameState(this.gameStates.COMPLETE);
        }

        // Delete the top 50.
        this.countryAreaComparisonList.splice(0, 50);

        return comparison;
    }

    getRandomNextComparisonByCurrentComparison(forcedResult = null) {
        const keptCountry = this.state.comparison.largerCountry;

        let keptCountryWinsAgain;
        if (forcedResult === null) {
            keptCountryWinsAgain = utils.coinToss();
        } else {
            keptCountryWinsAgain = forcedResult;
        }

        // The next ten comparisons involving `keptCountry`.
        // Called next ten but really it's a maximum of ten, can be less (especially late game).
        const nextTen = [];
        for (const comparison of this.countryAreaComparisonList) {
            const difficultyIncrease = this.getDifficultyIncrease(comparison);
            if (difficultyIncrease < 1.8 && difficultyIncrease > 0.8) {
                if (keptCountryWinsAgain) {
                    if (comparison.largerCountry === keptCountry && !this.isCountryHidden(comparison.smallerCountry)) {
                        nextTen.push(comparison);
                    }
                } else {
                    if (comparison.smallerCountry === keptCountry && !this.isCountryHidden(comparison.largerCountry)) {
                        nextTen.push(comparison);
                    }
                }
            }

            if (nextTen.length === 10) {
                break;
            }
        }
        const comparison = nextTen[Math.floor(Math.random() * nextTen.length)];
        // If no suitable next comparison is found.
        if (comparison === undefined) {
            // If the invoker did not force the result of `keptCountryWinsAgain`, try again with the opposite result.
            // Essentially meaning we can only ever try this function twice at most.
            if (forcedResult === null) {
                return this.getRandomNextComparisonByCurrentComparison(!keptCountryWinsAgain)
            } else {
                return false;
            }
        } else {
            return comparison;
        }
    }

    getLeftRightAfterRandomTop50 = comparison => {
        if (utils.coinToss()) {
            return {
                leftCountry: comparison.largerCountry,
                rightCountry: comparison.smallerCountry
            };
        } else {
            return {
                leftCountry: comparison.smallerCountry,
                rightCountry: comparison.largerCountry
            };
        }
    };

    getLeftRightAfterNextByCurrent = comparison => {
        if (this.state.leftCountry === this.state.comparison.largerCountry) {
            return {
                leftCountry:this.state.leftCountry,
                rightCountry: comparison.largerCountry === this.state.leftCountry ? comparison.smallerCountry : comparison.largerCountry
            };
        } else if (this.state.rightCountry === this.state.comparison.largerCountry) {
            return {
                rightCountry: this.state.rightCountry,
                leftCountry: comparison.largerCountry === this.state.rightCountry ? comparison.smallerCountry : comparison.largerCountry
            };
        }
    };

    progressGame = () => {
        let comparison;
        let leftCountry;
        let rightCountry;

        const handleEvenProgress = () => {
            comparison = this.getRandomTop50Comparison();
            ({leftCountry, rightCountry} = this.getLeftRightAfterRandomTop50(comparison));
        };

        if (this.state.progress % 2 === 0) {
            handleEvenProgress();
        } else {
            comparison = this.getRandomNextComparisonByCurrentComparison();
            if (comparison) {
                // Delete the comparison so it can't be used again.
                this.countryAreaComparisonList.splice(this.countryAreaComparisonList.indexOf(comparison), 1);

                ({leftCountry, rightCountry} = this.getLeftRightAfterNextByCurrent(comparison));
            } else {
                handleEvenProgress();
            }
        }

        this.decrementHiddenCountryCoolDowns();

        this.hiddenCountries[comparison.largerCountry] = this.hiddenCoolDown;
        this.hiddenCountries[comparison.smallerCountry] = this.hiddenCoolDown;

        this.setState({
            comparison,
            leftCountry,
            rightCountry
        });
    };

    isCountryCorrect(country) {
        return this.state.comparison.largerCountry === country;
    }

    submitAnswer = (country) => {
        if (this.isCountryCorrect(country)) {
            this.setGameState(this.gameStates.ADVANCING);
        } else {
            this.setGameState(this.gameStates.FAILED);
        }
    };

    renderCentre() {
        const renderProgressCircle = () => {
            return (
                <div className={b(this.block).el('progress-circle')}>
                    <span>{this.state.progress}</span>
                </div>
            );
        };
        switch (this.state.gameState) {
            default:
            case this.gameStates.GUESSING:
                return (
                    <div className={utils.el(this.block, 'separator')}>
                        <div className={utils.el(this.block, 'separator-content')}>
                            {renderProgressCircle()}
                        </div>
                    </div>
                );
            case this.gameStates.ADVANCING:
                return (
                    <div className={utils.el(this.block, 'separator')}>
                        <div className={utils.el(this.block, 'separator-content')}>
                            <div className={utils.el(this.block, 'separator-content-upper')}>
                                <h1>Correct!</h1>
                                <span>{cca2CountryMap[this.state.comparison.largerCountry].name.common} is {this.state.comparison.areaDiff.toLocaleString()} km&#178; larger than {cca2CountryMap[this.state.comparison.smallerCountry].name.common}.</span>
                            </div>
                            <div className={"xyz spin circle spin--cunt"}>Spin Circle</div>
                            {renderProgressCircle()}
                            <div className={utils.el(this.block, 'separator-content-lower')}>
                                <button onClick={() => this.setGameState(this.gameStates.GUESSING)}>Continue</button>
                            </div>
                        </div>
                    </div>
                );
        }
    }

    render() {
        if (!this.state.comparison) {
            return null;
        }

        // fetch(`/api/greeting`)
        //     .then(response => response.json())
        //     .then(state => console.log(state));

        return (
            <div className={classNames(this.block, utils.mod(this.block, this.state.gameState.class))}>
                <div className={classNames(utils.el(this.block, 'side'), utils.elMod(this.block, 'side', 'left'), {[utils.elMod(this.block, 'side', 'correct')] : this.state.gameState === this.gameStates.ADVANCING && this.isCountryCorrect(this.state.leftCountry)})}
                     onMouseDown={() => { this.submitAnswer(this.state.leftCountry) }}
                >
                    {cca2CountryMap[this.state.leftCountry].name.common}
                </div>
                { this.renderCentre() /* Game state sensitive. */ }
                <div className={classNames(utils.el(this.block, 'side'), utils.elMod(this.block, 'side', 'right'), {[utils.elMod(this.block, 'side', 'correct')] : this.state.gameState === this.gameStates.ADVANCING && this.isCountryCorrect(this.state.rightCountry)})}
                     onMouseDown={() => { this.submitAnswer(this.state.rightCountry) }}
                >
                    {cca2CountryMap[this.state.rightCountry].name.common}
                </div>
            </div>
        );
    }
}

export default WhichCountryBigger;
