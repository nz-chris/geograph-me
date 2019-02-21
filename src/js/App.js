import React, { Component } from 'react';
import '../scss/Main.scss';

// Components
import CountryInserter from './components/CountryInserter';

class App extends Component {
    render() {
        return (
            <CountryInserter />
        );
    }
}

export default App;

/*
    ============================================================================
                                   To do list
    ============================================================================

    * Consider what to display when the map SVG is loading.
    * Figure out how to tell the browser to cache the map SVG.
    * Why is it so slow on iOS? Compare performance with/without filters
    * Warn if CountryInserter.nameIdMap doesn't make sense with country-id-title-map.json (from SVG)
    * Is Belize independent?
    * Re-consider stroke. Hard to see small nations.
    * Need some sort of cool animation that ripples out from a country just after it is inserted.
    * Tooltip on country hover that gives info about that country.
    * 5 "spelling lives".
    * Optional time limits.
 */