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
            <header className={b}>
                {(() => {
                    const links = [];
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
