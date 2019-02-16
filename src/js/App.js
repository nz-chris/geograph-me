import React, { Component } from 'react';
import '../scss/Main.scss';

// Components
import CountryInserter from './components/CountryInserter';

class App extends Component {
    render() {
        return (
            <React.Fragment>
                <div style={{position: 'fixed', top: '30%', fontSize: '100px', color: 'red', zIndex: '99999'}}>
                TWO FILTERS ON THE MAP! WAHEY!
                </div>
            <CountryInserter />
            </React.Fragment>
        );
    }
}

export default App;
