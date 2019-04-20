// External
import React, {Component} from 'react'
import {BrowserRouter as Router, Route, withRouter} from 'react-router-dom'
// Helpers / Constants
import {pages} from './siteConfig';
// Components
import TopNavigation from './components/TopNavigation';
// Link the styles!
import '../scss/Main.scss';

let TopNavigationWithRouter = withRouter(TopNavigation);

class App extends Component {
    render() {
        return (
            <Router>
                <React.Fragment>
                    <TopNavigationWithRouter {...this.props} />
                    {
                        Object.values(pages).map((page, index) => {
                            const Component = page.component;
                            return (
                                <Route exact path={page.path}
                                       render={(routerProps => {
                                           return <Component {...routerProps} />
                                       })}
                                       key={index}
                                />
                            )
                        })
                    }
                </React.Fragment>
            </Router>
        );
    }
}

export default App;
