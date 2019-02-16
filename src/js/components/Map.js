import React, {Component} from 'react';
import classNames from 'classnames';
import ReactSVG from 'react-svg'

// Images
import mapSvg from '../../images/world-map.svg';
import noiseSvg from '../../images/world-map-noise-overlay.svg';

class Map extends Component {
    render() {
        //TODO: consider what to display when the map svg is loading.
        const rootClass = 'map';

        return (
            <div className={classNames(rootClass, this.props.extraClassNames)}>
                <svg style={{visibility: 'hidden', position: 'fixed', transform: 'translate(100vw, 100vh)'}}
                     width={'0'}
                     height={'0'}
                >
                    <defs>
                        <linearGradient id={'landGradient'}
                                        x1={'0'} y1={'0'}
                                        x2={'0'} y2={'0'}
                                        gradientUnits={'userSpaceOnUse'}
                        >
                            <stop offset={'10%'} className={`${rootClass}__land-gradient-stop--snow`}/>
                            <stop offset={'20%'} className={`${rootClass}__land-gradient-stop--land`}/>
                            <stop offset={'40%'} className={`${rootClass}__land-gradient-stop--desert`}/>
                            <stop offset={'60%'} className={`${rootClass}__land-gradient-stop--land`}/>
                            <stop offset={'100%'} className={`${rootClass}__land-gradient-stop--snow`}/>
                        </linearGradient>
                        <linearGradient id={'oceanGradient'}
                                        x1={'0'} y1={'0'}
                                        x2={'0'} y2={'0'}
                                        gradientUnits={'userSpaceOnUse'}
                        >
                            <stop offset={'0%'} className={`${rootClass}__ocean-gradient-stop--ocean-cold`}/>
                            <stop offset={'25%'} className={`${rootClass}__ocean-gradient-stop--ocean`}/>
                            <stop offset={'50%'} className={`${rootClass}__ocean-gradient-stop--ocean-warm`}/>
                            <stop offset={'80%'} className={`${rootClass}__ocean-gradient-stop--ocean`}/>
                            <stop offset={'100%'} className={`${rootClass}__ocean-gradient-stop--ocean-cold`}/>
                        </linearGradient>
                        <radialGradient id={'auGradient'}>
                            <stop offset={'20%'} className={`${rootClass}__land-gradient-stop--desert`}/>
                            <stop offset={'100%'} className={`${rootClass}__land-gradient-stop--land`}/>
                        </radialGradient>
                        <filter id="noise">
                            <feTurbulence type="fractalNoise" baseFrequency="30" result="noisy" />
                            <feColorMatrix type="saturate" values="0"/>
                            <feBlend in="SourceGraphic" in2="noisy" mode="multiply" />
                        </filter>
                    </defs>
                </svg>
                <ReactSVG svgClassName={`${rootClass}__svg`}
                          src={mapSvg}
                          onInjected={(error, svg) => {
                              console.log(svg.viewBox);
                              const svgY1 = svg.viewBox.baseVal.y.toString();
                              const svgY2 = svg.viewBox.baseVal.height.toString();
                              const landGradient = document.getElementById('landGradient');
                              landGradient.setAttribute('y1', svgY1);
                              landGradient.setAttribute('y2', svgY2);
                              const oceanGradient = document.getElementById('oceanGradient');
                              oceanGradient.setAttribute('y1', svgY1);
                              oceanGradient.setAttribute('y2', svgY2);
                          }}
                />
                {
                    this.props.noiseOverlay ?
                        <ReactSVG svgClassName={`${rootClass}__noise-overlay`}
                                  src={noiseSvg}
                        />
                        :
                        ''
                }
            </div>
        );
    }
}

export default Map;
