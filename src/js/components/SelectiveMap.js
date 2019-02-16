import React, {Component} from 'react';
import countryIdTitleMap from '../../data/country-id-title-map';

// Components
import Map from './Map';

class SelectiveMap extends Component {
    constructor(props) {
        super(props);

        this.rootClass = 'selective-map';
        this.svg = null;

        this.setClasses = this.setClasses.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        this.setClasses();
        return false;
    }
    
    setClasses() {
        if (!this.svg) {
            return;
        }
        const lowerCaseCountriesShown = this.props.countriesShown.map(function(item) {
            return item.toLowerCase();
        });
        for (const id of Object.keys(countryIdTitleMap)) {
            const node = this.svg.querySelector(`#${id}`);
            node.classList.add(`${this.rootClass}__land`, `${this.rootClass}__land--invisible`);
            if (lowerCaseCountriesShown.includes(id.toLowerCase())) {
                node.classList.remove(`${this.rootClass}__land--invisible`);
            }
        }
    }
    
    render() {
        return (
            <Map extraClassNames={this.rootClass}
                 svgCallback={(svg) => {
                     if (!this.svg) {
                         // Initial setup only.
                         this.svg = svg;
                         this.setClasses();
                     }
                 }}
                 noiseOverlay={true}
            />
        );
    }
}

export default SelectiveMap;
