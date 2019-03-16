import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import classNames from 'classnames';

import utils from '../../utils/Utils'
import {siteInfo, orderedGamePages} from '../../siteConfig';

class HomePage extends Component {
    render() {
        const rootClass = 'home-page';
        return (
            <div className={rootClass}>
                <div className={utils.el(rootClass, 'heading')}>
                    <h1>{siteInfo.NAME}</h1>
                    {siteInfo.TAGLINE}
                </div>
                <div className={utils.el(rootClass, 'body')}>
                    <div className={utils.el(rootClass, 'game-nav')}>
                        {(() => {
                            const links = [];
                            for (let i = 0; i < Object.keys(orderedGamePages).length; i++) {
                                const page = orderedGamePages[i];
                                links.push(
                                    <Link className={utils.el(rootClass, 'game-link')}
                                          to={page.path}
                                          key={i}
                                    >
                                        {page.name}
                                    </Link>
                                );
                            }
                            return links;
                        })()}
                        <div className={classNames(utils.el(rootClass, 'game-link'), utils.elMod(rootClass, 'game-link', 'disabled'))}>
                            Coming soon...
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default HomePage;
