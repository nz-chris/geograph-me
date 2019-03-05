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
