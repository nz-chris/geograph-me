// External
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
// Helpers / Constants
import {orderedTopNavigationPages} from '../siteConfig';
import b from '../includes/Bem';

class TopNavigation extends Component {
    constructor(props) {
        super(props);

        this.b = b('top-navigation');
    }

    render() {
        const b = this.b;
        return (
            <header className={b}
                    onClick={() => {
                        //LOAD GEO JSON!
                        fetch(`/api/data`)
                            .then(response => {
                                console.log(response);
                                return response.json();
                            })
                            .then(state => console.log(state));
                    }}>
                {(() => {
                    const links = [];
                    // bru wtf why doesnt this use map.
                    for (let i = 0; i < Object.keys(orderedTopNavigationPages).length; i++) {
                        const page = orderedTopNavigationPages[i];
                        links.push(
                            <Link to={page.path}
                                  className={b.el('link').modIf('active', this.props.location.pathname === page.path)}
                                  key={i}
                            >
                                {page.name}
                            </Link>
                        );
                    }
                    return links;
                })()}
            </header>
        );
    }
}

TopNavigation.propTypes = {
    location: PropTypes.object,
};

export default TopNavigation;
