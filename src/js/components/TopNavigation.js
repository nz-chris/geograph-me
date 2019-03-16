import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import classNames from 'classnames';

import utils from '../utils/Utils'
import {orderedTopNavigationPages} from '../siteConfig';

class TopNavigation extends Component {
    render() {
        const rootClass = 'top-navigation';
        return (
            <header className={rootClass}>
                {(() => {
                    const links = [];
                    for (let i = 0; i < Object.keys(orderedTopNavigationPages).length; i++) {
                        const page = orderedTopNavigationPages[i];
                        links.push(
                            <Link to={page.path}
                                  className={classNames(utils.el(rootClass, 'link'), {[utils.elMod(rootClass, 'link', 'active')]: this.props.location.pathname === page.path})}
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
