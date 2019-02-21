import React, {Component} from 'react';
import classNames from 'classnames';
import ReactSVG from 'react-svg'

// Images
import mapSvg from '../../images/world-map.svg';

class Map extends Component {
    constructor(props) {
        super(props);

        this.svg = null;

        this.scaleTexture = this.scaleTexture.bind(this);
    }

    componentDidMount() {
        window.addEventListener('resize', this.scaleTexture)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.scaleTexture)
    }

    scaleTexture() {
        if (!this.svg) return;

        const textureFilter = this.svg.getElementById('texture-0');
        const textureFilterDiffLight = textureFilter.getElementsByTagName('feDiffuseLighting')[0];
        const diffLightSurfaceScale = (window.innerWidth / 3000).toString();
        textureFilterDiffLight.setAttribute('surfaceScale', diffLightSurfaceScale );
    }

    render() {
        const rootClass = 'map';
        return (
            <div className={classNames(rootClass, this.props.extraClassNames)}>
                <svg style={{visibility: 'hidden', position: 'fixed', transform: 'translate(100vw, 100vh)'}}
                     width={'0'}
                     height={'0'}
                >
                    <defs>
                        <filter id="noise">
                            <feTurbulence type="fractalNoise" baseFrequency="1" result="noisy" />
                            <feColorMatrix in="noisy" type="saturate" values="0.5" result="dest-noisy" />
                            <feGaussianBlur in="dest-noisy" stdDeviation="0.25" result="blurred-noisy"/>
                            <feComposite in="blurred-noisy" operator="in" in2="SourceGraphic" result="comp"/>
                            <feBlend in="SourceGraphic" in2="comp"  mode="multiply" />
                        </filter>
                        <filter id="texture">
                            <feTurbulence type="turbulence" baseFrequency="0.01" numOctaves="5" result="noisy" />
                            <feGaussianBlur in="noisy" stdDeviation="0.5" result="blurred-noisy"/>
                            <feDiffuseLighting in="blurred-noisy" lightingColor="white" surfaceScale="1.5" result="diff-light">
                                <feDistantLight azimuth="45" elevation="45"/>
                            </feDiffuseLighting>
                            <feComposite operator="in" in="diff-light" in2="SourceGraphic" result="comp"/>
                            <feBlend in="SourceGraphic" in2="comp"  mode="multiply" />
                        </filter>
                        <linearGradient id={'landGradient'}
                                        x1={'0'} y1={'0'}
                                        x2={'0'} y2={'0'}
                                        gradientUnits={'userSpaceOnUse'}
                                        filter={'url(#texture)'}
                        >
                            <stop offset={'8%'} className={`${rootClass}__land-gradient-stop--snow`}/>
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
                            <stop offset={'75%'} className={`${rootClass}__ocean-gradient-stop--ocean`}/>
                            <stop offset={'100%'} className={`${rootClass}__ocean-gradient-stop--ocean-cold`}/>
                        </linearGradient>
                        <radialGradient id={'auGradient'}>
                            <stop offset={'0%'} className={`${rootClass}__land-gradient-stop--desert`}/>
                            <stop offset={'100%'} className={`${rootClass}__land-gradient-stop--land`}/>
                        </radialGradient>
                    </defs>
                </svg>
                    <ReactSVG svgClassName={`${rootClass}__svg`}
                              src={mapSvg}
                              onInjected={(error, svg) => {
                                  const svgBox = svg.viewBox.baseVal;

                                  const svgY1 = svgBox.y;
                                  const svgY2 = svgBox.height + svgY1;
                                  const landGradient = document.getElementById('landGradient');
                                  landGradient.setAttribute('y1', svgY1.toString());
                                  landGradient.setAttribute('y2', svgY2.toString());
                                  const oceanGradient = document.getElementById('oceanGradient');
                                  oceanGradient.setAttribute('y1', svgY1.toString());
                                  oceanGradient.setAttribute('y2', svgY2.toString());

                                  const svgCX = svgBox.width / 2 + svgBox.x;
                                  const svgCY = svgBox.height / 2 + svgY1;
                                  const oceanClipPath = svg.getElementById('ocean-clip-path');
                                  oceanClipPath.setAttribute('transform',`translate(${svgCX}, ${svgCY}) scale(0.995) translate(-${svgCX}, -${svgCY})`);

                                  this.props.svgCallback(svg);
                                  this.svg = svg;
                                  this.scaleTexture();
                              }}
                    />
                </div>
                );
                }
                }

                export default Map;
