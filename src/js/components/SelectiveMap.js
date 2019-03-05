import React, {Component} from 'react';
import countryIdTitleMap from '../../data/country-id-title-map';

import scssVariables from '../../scss/_variables.scss';

// Components
import Map from './Map';

class SelectiveMap extends Component {
    constructor(props) {
        super(props);

        this.rootClass = 'selective-map';
        this.invisibleClass = `${this.rootClass}__land--invisible`;
        this.svg = null;
        this.lastCountriesShown = this.props.countriesShown.slice();
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        const newCountriesShown = nextProps.countriesShown.filter(x => !this.lastCountriesShown.includes(x));
        const newCountriesHidden = this.lastCountriesShown.filter(x => !nextProps.countriesShown.includes(x));
        for (let newCountry of newCountriesShown) {
            newCountry = newCountry.toLowerCase();
            const node = this.svg.querySelector(`#${newCountry}`);
            if (node) {
                node.classList.remove(this.invisibleClass);
            }
        }
        for (let newCountryHidden of newCountriesHidden) {
            newCountryHidden = newCountryHidden.toLowerCase();
            const node = this.svg.querySelector(`#${newCountryHidden}`);
            if (node) {
                node.classList.add(this.invisibleClass);
            }
        }
        this.lastCountriesShown = nextProps.countriesShown.slice();
        return false;
    }

    initClasses = () => {
        if (!this.svg) return;

        const lowerCaseCountriesShown = this.props.countriesShown.map((item) => {
            return item.toLowerCase();
        });
        const landNodes = [];
        for (const id of Object.keys(countryIdTitleMap)) {
            const node = this.svg.querySelector(`#${id}`);
            if (node) {
                node.classList.add(`${this.rootClass}__land`, `${this.rootClass}__land--invisible`);
                landNodes.push(node);
                if (lowerCaseCountriesShown.includes(id.toLowerCase())) {
                    node.classList.remove(this.invisibleClass);
                }
            }
        }

        // This transition cannot be in the stylesheet, else when the page loads,
        // the user will briefly see countries fading out as this function runs.
        setTimeout(() => {
            for (const node of landNodes) {
                node.style.transition = scssVariables.transition;
            }
        }, 1000);
    };

    render() {
        return (
            <Map extraClassNames={this.rootClass}
                 svgCallback={(svg) => {
                     if (!this.svg) {
                         this.svg = svg;
                         this.initClasses();
                     }
                 }}
            />
        );
    }
}

export default SelectiveMap;
