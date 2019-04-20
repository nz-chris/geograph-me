// External
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
// Internal helpers.
import b from '../../includes/Bem';

import {orderedGamePages, siteInfo} from '../../siteConfig';

class HomePage extends Component {
    constructor(props) {
        super(props);

        this.b = b('home-page');
    }

    render() {
        const b = this.b;

        return (
            <div className={b}>
                <div className={b.el('heading')}>
                    <h1>{siteInfo.NAME}</h1>
                    {siteInfo.TAGLINE}
                </div>
                <div className={b.el('body')}>
                    <div className={b.el('game-nav')}>
                        {(() => {
                            const links = [];
                            for (let i = 0; i < Object.keys(orderedGamePages).length; i++) {
                                const page = orderedGamePages[i];
                                links.push(
                                    <Link className={b.el('game-link')}
                                          to={page.path}
                                          key={i}
                                    >
                                        {page.name}
                                    </Link>
                                );
                            }
                            return links;
                        })()}
                        <div className={b.el('game-link').mod('disabled')}>
                            Coming soon...
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default HomePage;
