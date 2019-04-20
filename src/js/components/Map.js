// External
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ReactSVG from 'react-svg'
import svgPanZoom from 'svg-pan-zoom';
import countries from 'world-countries';
// Helpers / Constants
import scssVariables from '../../scss/_variables.scss';
import b from '../includes/Bem';
import utils from '../utils/utils';
// Images
import mapSvg from '../../images/world-map.svg';
// Components
import Loading from './Loading';
import OnlyRenderOnce from './OnlyRenderOnce'
import CountryInfo from './CountryInfo';

class Map extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeCountryInfo: null,
            activeCountryInfoMouseEvent: null,
        };

        this.b = b('map');

        this.cca2CountryInfoMap = {};
        for (const country of countries) {
            this.cca2CountryInfoMap[country.cca2] = country;
        }

        this.parentDiv = React.createRef();

        this.svg = null;
        this.zoomPanSvg = null;
        this.zoomPanViewport = null;
        this.zoomDependentStyle = null;
        this.zoomScale = 1;
        this.zoomComparisonThreshold = 0.001;
    }

    onDoubleClick = () => {
        if (!this.svg || !this.parentDiv.current) return;

        this.zoomPanViewport.style.transform = this.initialZoomPanViewportTransform;
        this.zoomPanViewport.setAttribute('transform', this.initialZoomPanViewportTransform);

        this.zoomPanSvg.resetPan();
        this.zoomPanSvg.resetZoom();
    };

    onZoom = (scale) => {
        if (!this.svg || !this.parentDiv.current) return;

        this.zoomScale = scale;
        const newStrokeWidth = scssVariables.strokeWidth / scale;
        this.zoomDependentStyle.innerHTML = `.landxx, .limitxx { stroke-width: ${newStrokeWidth} !important; }`;
        if (scale > 1 - this.zoomComparisonThreshold && scale < 1 + this.zoomComparisonThreshold) {
            const panResetTime = 300; // ms
            this.zoomPanViewport.style.transition = `transform ${panResetTime}ms ease-in-out`;
            setTimeout(() => {
                this.zoomPanSvg.resetPan();
                setTimeout(() => {
                    this.zoomPanViewport.style.transition = 'none';
                }, panResetTime);
            }, 0);
        }
    };

    beforePan = (oldPan, newPan) => {
        if (!this.svg || !this.parentDiv.current) return;
        const gutterWidth = this.parentDiv.current.getBoundingClientRect().width / 2
            , gutterHeight = this.parentDiv.current.getBoundingClientRect().height / 2
            , sizes = this.zoomPanSvg.getSizes()
            , leftLimit = -((sizes.viewBox.x + sizes.viewBox.width) * sizes.realZoom) + gutterWidth
            , rightLimit = sizes.width - gutterWidth - (sizes.viewBox.x * sizes.realZoom)
            , topLimit = -((sizes.viewBox.y + sizes.viewBox.height) * sizes.realZoom) + gutterHeight
            , bottomLimit = topLimit + sizes.viewBox.height * sizes.realZoom;
        const customPan = {};
        customPan.x = Math.max(leftLimit, Math.min(rightLimit, newPan.x));
        customPan.y = Math.max(topLimit, Math.min(bottomLimit, newPan.y));
        return customPan;
    };

    onPan = () => {
        if (!this.svg) return;

        if (this.zoomScale > 1 - this.zoomComparisonThreshold && this.zoomScale < 1 + this.zoomComparisonThreshold) {
            this.zoomPanSvg.resetPan();
        }
    };

    initSvgPanZoom = () => {
        if (!this.svg || !this.parentDiv.current) return;

        const svgAspectRatio = this.svg.getAttribute('width') / this.svg.getAttribute('height');
        const availableSvgHeight = window.innerHeight - this.svg.getBoundingClientRect().top;
        const availableSvgWidth = window.innerWidth;
        const availableSvgAreaAspectRato = availableSvgWidth / availableSvgHeight;
        // If the available area is more landscape than the svg.
        let autoHeight = false;
        if (availableSvgAreaAspectRato > svgAspectRatio) {
            this.svg.style.height = availableSvgHeight+'px';
            this.svg.style.width = '100%';
        } else {
            this.svg.style.width = availableSvgWidth+'px';
            autoHeight = true;
            this.svg.style.height = 'auto';
        }

        const svgId = `${this.rootClass}__svg-id-${Math.floor(1000 * Math.random())}`;
        this.svg.id = svgId;
        this.zoomPanSvg = svgPanZoom(
            `#${svgId}`,
            {
                dblClickZoomEnabled: false,
                preventMouseEventsDefault: false,
                minZoom: 1,
                zoomScaleSensitivity: 0.3,
                onZoom: this.onZoom,
                beforePan: this.beforePan,
                onPan: this.onPan,
            }
        );

        this.zoomPanViewport = this.svg.querySelector('.svg-pan-zoom_viewport');

        // To ensure we don't append multiple style tags.
        if (!this.zoomDependentStyle) {
            const css = '.landxx, .limitxx { stroke-width: 1 !important; }';
            const head = document.head || document.getElementsByTagName('head')[0];
            const style = document.createElement('style');
            style.id = `style-id-${Math.floor(1000 * Math.random())}`;
            style.type = 'text/css';
            style.appendChild(document.createTextNode(css));
            head.appendChild(style);
            this.zoomDependentStyle = style;
        }

        if (autoHeight) {
            this.svg.style.height = '100%';
        }

        this.initialZoomPanViewportTransform = this.zoomPanViewport.getAttribute('transform');
    };


    initCountries = () => {
        const colors = [
            '#505050',
            '#7c7c7c',
            '#a8a8a8',
            '#d3d3d3'
        ];

        utils.shuffle(colors);

        const subregionColors = {
            'North America': colors[0],
            'Central America': colors[1],
            'Caribbean': colors[2],
            'South America': colors[3],

            'Northern Europe': colors[0],
            'Western Europe': colors[1],
            'Southern Europe': colors[2],
            'Eastern Europe': colors[3],

            'Western Asia': colors[0],
            'Central Asia': colors[1],
            'Southern Asia': colors[3],
            'Eastern Asia': colors[2],
            'South-Eastern Asia': colors[0],
            'Australia and New Zealand': colors[1],

            'Northern Africa': colors[3],
            'Western Africa': colors[2],
            'Middle Africa': colors[0],
            'Eastern Africa': colors[1],
            'Southern Africa': colors[2],

            'Micronesia': colors[0],
            'Melanesia': colors[3],
            'Polynesia': colors[1],
        };

        const initCountryBySelector = (selector) => {
            const nodes = this.svg.querySelectorAll(selector);
            for (const node of nodes) {
                const id = node.id.toUpperCase();
                if (Object.keys(this.cca2CountryInfoMap).includes(id)) {
                    const country = this.cca2CountryInfoMap[id];
                    if (country.subregion) {
                        const subregionColor = subregionColors[country.subregion];
                        if (country.cca2 === 'SK') {
                            node.setAttribute('fill', subregionColors['Eastern Europe']);
                        } else if (country.cca2 === 'XK') {
                            node.setAttribute('fill', subregionColors['Southern Europe']);
                        } else if (subregionColor) {
                            node.setAttribute('fill', subregionColor);
                        }
                    } else {
                        node.setAttribute('fill', 'white');
                    }
                    if (country.independent) {
                        const title = node.getElementsByTagName('title')[0];
                        node.addEventListener('mousemove', (e) => {
                            if (title) title.remove();
                            this.setState({activeCountryInfo: country, activeCountryInfoMouseEvent: e});
                        });
                        node.addEventListener('mouseleave', () => {
                            node.insertBefore(title, node.firstChild);
                            this.setState({activeCountryInfo: null, activeCountryInfoMouseEvent: null});
                        });
                    }
                }
            }
        };

        initCountryBySelector('path');
        initCountryBySelector('g');
    };

    render() {
        const b = this.b;

        return (
            <div
                className={classNames(b.toString(), this.props.extraClassName)}
                ref={this.parentDiv}
            >
                {this.state.activeCountryInfo ?
                    <CountryInfo country={this.state.activeCountryInfo}
                                 mouseEvent={this.state.activeCountryInfoMouseEvent}
                    />
                    : ''
                }
                <OnlyRenderOnce ComponentToRender={ReactSVG}
                                className={b.el('svg-wrapper')}
                                svgClassName={b.el('svg').toString()}
                                src={mapSvg}
                                fallback={() => <span>Oops! Failed to load the map. Sorry.</span>}
                                loading={() => {
                                    return (
                                        <Loading style={{background: `radial-gradient(${scssVariables.colorOcean}, transparent)`}} />
                                    );
                                }}
                                onInjected={(error, svg) => {
                                    if (!this.svg) {
                                        this.svg = svg;
                                        this.initCountries();
                                        this.initSvgPanZoom();
                                        this.props.svgCallback(svg);
                                    }
                                }}
                                onDoubleClick={this.onDoubleClick}
                />
            </div>
        );
    }

}

Map.propTypes = {
    extraClassName: PropTypes.string,
    svgCallback: PropTypes.func,
};

Map.defaultProps = {
    extraClassName: '',
    svgCallback: () => {},
};

export default Map;
