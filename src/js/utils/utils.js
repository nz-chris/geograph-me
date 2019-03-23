/* eslint-disable no-console */

import _ from 'lodash';

import countries from 'world-countries';
import cca2CountryMap from '../../data/cca2-country-map';
import countryAreaComparisonList from '../../data/country-area-comparison-list-descending';

const smallestAllowedIslandNation = 9000;

export default {
    /**
     * Shuffle array in place.
     * @param {Array} a items An array containing the items.
     */
    shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    },
    coinToss() {
        return !!Math.floor(Math.random() * 2);
    },

    // BEM convention convenience functions.
    el(block, element) {
        return block + '__' + element;
    },
    mod(block, modifier) {
        return block + '--' + modifier;
    },
    elMod(block, element, modifier) {
        return this.mod(this.el(block, element), modifier)
    },

    // json generation. Run these functions to update certain json filed in the /src/data directory.
    // For example, if `world-countries` package is updated.
    // json is logged to console.
    // Below each generation function is a (sometimes more complex) check function, for sanity.
    /**
     * Generate cca2-country-map.json.
     */
    generateJsonMapCca2ToCountry() {
        const json = {};
        for (const country of countries) {
            json[country.cca2] = country;
        }
        console.log(JSON.stringify(json, null, 2));
    },
    /**
     * Check cca2-country-map.json.
     */
    checkJsonMapCca2ToCountry() {
        let isGood = true;

        // Backwards
        for (const country1 of Object.values(cca2CountryMap)) {
            for (const country2 of countries) {
                isGood = false;
                if (_.isEqual(country1, country2)) {
                    isGood = true;
                    break;
                }
            }
            if (!isGood) {
                console.log(1);
                break;
            }
        }
        if (!isGood) {
            console.log(isGood);
            return;
        }

        // Forwards
        for (const country of countries) {
            const cca2_1 = country.cca2;
            for (const cca2_2 of Object.keys(cca2CountryMap)) {
                isGood = false;
                if (cca2_1 === cca2_2) {
                    if (_.isEqual(country, cca2CountryMap[cca2_2])) {
                        isGood = true;
                        break;
                    }
                }
            }
            if (!isGood) {
                console.log(2);
                break;
            }
        }
        console.log(isGood);
    },
    /**
     * Generate country-area-comparison-list-descending.json.
     */
    generateJsonListCountryAreaComparisonDescending() {
        const json = [];

        // We will limit the pairings to avoid extremities.
        // Easiness such as Russia vs. Vatican City is avoided later.
        // Extreme difficulty such as Tuvalu vs. Nauru is avoided in the below map construction,
        // which will ignore island nations roughly smaller than 9,000 sq km
        // (Cyprus is the smallest island nation included).

        // First, map `cca2_1,cca2_2` string keys to the difference in their areas.
        // `cca2_1` from the key always references the larger country.
        const differenceMap = {};
        for (const country1 of countries) {
            for (const country2 of countries) {
                if (
                    (!country1.borders.length && country1.area < smallestAllowedIslandNation)||
                    (!country2.borders.length && country2.area < smallestAllowedIslandNation)
                ) {
                    continue;
                }
                const cca2_1 = country1.cca2;
                const cca2_2 = country2.cca2;
                if (cca2_1 !== cca2_2 && country1.independent && country2.independent) {
                    const largerCca2 = country1.area >= country2.area ? cca2_1 : cca2_2;
                    const smallerCca2 = largerCca2 === cca2_1 ? cca2_2 : cca2_1;
                    const key = `${largerCca2},${smallerCca2}`;
                    differenceMap[key] = Math.abs(country1.area - country2.area);
                }
            }
        }

        // Then, sort the keys of the difference map by value, descending.
        const sortedDifferenceMapKeys = Object.keys(differenceMap).sort((a, b) => {
            return -(differenceMap[a] - differenceMap[b])
        });

        // Now, avoid easy pairings such as Russia vs. Vatican City.
        // Find the upper limit (lowest index of `sortedDifferenceMapKeys` to use, highest area difference).
        // This will be done by finding the index that compares the largest country with the second largest.
        let largestCca2 = sortedDifferenceMapKeys[0].split(',')[0];
        let secondLargestCca2 = null;
        for (const differenceMapKey of sortedDifferenceMapKeys) {
            const largerCca2 = differenceMapKey.split(',')[0];
            if (largerCca2 !== largestCca2) {
                secondLargestCca2 = largerCca2;
                break;
            }
        }
        if (!secondLargestCca2) {
            console.error('secondLargestCca2 was not found.');
            return;
        }
        const upperLimit = sortedDifferenceMapKeys.indexOf(`${largestCca2},${secondLargestCca2}`);
        if (upperLimit < 0) {
            console.error('upperLimit was not found.');
            return;
        }

        // Finally, build the json.
        for (const differenceMapKey of sortedDifferenceMapKeys.slice(upperLimit)) {
            const largerCca2 = differenceMapKey.split(',')[0];
            const smallerCca2 = differenceMapKey.split(',')[1];
            const areaDiff = differenceMap[differenceMapKey];
            const pairing = {
                'largerCountry': largerCca2,
                'smallerCountry': smallerCca2,
                'areaDiff': areaDiff
            };
            json.push(pairing)
        }

        // Fuck me, that was a lot of work
        console.log(JSON.stringify(json, null, 2));
    },
    /**
     * Check country-area-comparison-list-descending.json.
     */
    checkJsonListCountryAreaComparisonDescending() {
        let isGood = true;
        let prevAreaDiff = false;
        for (const comparison of countryAreaComparisonList) {
            isGood = false;
            const largerCca2 = comparison.largerCountry;
            const smallerCca2 = comparison.smallerCountry;
            if (largerCca2 === smallerCca2) {
                console.log(1);
                break;
            }
            const largerCountry = cca2CountryMap[largerCca2];
            const smallerCountry = cca2CountryMap[smallerCca2];
            if (smallerCountry.area > largerCountry.area) {
                console.log(2);
                break;
            }
            if (!largerCountry.independent || !smallerCountry.independent) {
                console.log(3);
                break;
            }
            if (largerCountry.area - smallerCountry.area !== comparison.areaDiff) {
                console.log(4);
                break;
            }
            if (
                (!largerCountry.borders.length && largerCountry.area < smallestAllowedIslandNation) ||
                (!smallerCountry.borders.length && smallerCountry.area < smallestAllowedIslandNation)
            ) {
                console.log(5);
                break;
            }
            if (prevAreaDiff) {
                if (prevAreaDiff < comparison.areaDiff) {
                    console.log(6);
                    break;
                }
            }
            prevAreaDiff = comparison.areaDiff;
            isGood = true;
        }
        console.log(isGood);
    }
};
