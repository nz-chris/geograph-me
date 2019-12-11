import React, {Component} from "react";
import PropTypes from "prop-types";
import uuidv1 from "uuid/v1";

import bem from "../../includes/Bem";

const b = bem("gm-button");
class Button extends Component {
    constructor(props) {
        super(props);

        this.state = {
            transformStyle: null,

            entered: false,
        };

        this.maskUuid = uuidv1();
        this.gradientUuid = uuidv1();
        this.horizontalGradientId = `${this.gradientUuid}-h`;
        this.verticalGradientId = `${this.gradientUuid}-v`;
    }

    setStyleFromMouseEvent = e => {
        const rect = e.currentTarget.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        const x = Math.min(Math.max(e.clientX - Math.round(rect.left), 0), w);
        const y = Math.min(Math.max( e.clientY - Math.round(rect.top), 0), h);
        const xr = x / w * 2 - 1;
        const yr = y / h * 2 - 1;

        //todo move xr and xy into state and apply this style in the render instead
        this.setState({
            transformStyle: {
                transform: `
                    perspective(1em)
                    ${e.buttons === 1 ? "translateZ(-0.02em)" : ""}
                    rotateY(${0.6*xr}deg)
                    rotateX(${-0.6*yr}deg)
                `,
                transition: "none",
            },
            other: {
                xr,
                yr,
            }
        });
    };

    onMouseLeave = () => {
        this.setState({
            transformStyle: {
            },
            other: {
                xr: this.state.other.xr,
                yr: this.state.other.yr,
                dontDoIt: true,
            }
        });
    };

    onKeyPress = e => {
        if (e.key === "Enter") {
            this.setState({entered: true}, () => setTimeout(() => this.setState({entered: false}), 100));
        }
    };


    render() {
        const {
            label,
            onClick,
        } = this.props;

        const {
            transformStyle,
            entered,
            other,
        } = this.state;


        let x1 = 0, y1 = 0, x2 = 0, y2 = 0;

        if (other) {
            if (other.xr < 0) {
                x1 = 100;
            }
            if (other.xr > 0) {
                x2 = 100;
            }
            if (other.yr < 0) {
                y1 = 100;
            }
            if (other.yr > 0) {
                y2 = 100;
            }
        }

        return (
            <button
                className={b.modIf("active", entered)}
                onClick={onClick}
                onMouseMove={this.setStyleFromMouseEvent}
                onMouseLeave={this.onMouseLeave}
                onMouseDown={this.setStyleFromMouseEvent}
                onMouseUp={this.setStyleFromMouseEvent}
                onKeyPress={this.onKeyPress}
            >
                <div className={b.el("wrapper")} style={transformStyle}>
                    <svg className={b.el("svg")} width={"100%"} height={"100%"}>
                        <defs>
                            <linearGradient id={this.horizontalGradientId} x1={`${x1}%`} y1={0} x2={`${x2}%`} y2={0}>
                                <stop stopOpacity={"0"} />
                                <stop className={b.el("gradient-h-stop")} offset={"100%"} />
                            </linearGradient>
                            <linearGradient id={this.verticalGradientId} x1={0} y1={`${y1}%`} x2={0} y2={`${y2}%`}>
                                <stop stopOpacity={"0"} />
                                <stop className={b.el("gradient-v-stop")} offset={"100%"} />
                            </linearGradient>
                            <mask id={this.maskUuid}>
                                <rect width={"100%"} height={"100%"} fill={"#fff"} x={"0"} y={"0"} />
                                <text
                                    x={"50%"}
                                    y={"50%"}
                                    textAnchor={"middle"}
                                    dominantBaseline={"middle"}
                                    fill={"#000"}
                                >
                                    {label}
                                </text>
                            </mask>
                        </defs>
                        <rect
                            width={"100%"}
                            height={"100%"}
                            x={"0"}
                            y={"0"}
                            mask={`url(#${this.maskUuid})`}
                        />
                        {[this.horizontalGradientId, this.verticalGradientId].map(gradientId => (
                            <rect
                                key={gradientId}
                                className={b.el("gradient-rect")}
                                width={"100%"}
                                height={"100%"}
                                x={"0"}
                                y={"0"}
                                mask={`url(#${this.maskUuid})`}
                                fill={`url(#${gradientId})`}
                                style={
                                    other && !other.dontDoIt ?
                                        {opacity: 0.3 * Math.abs(other.xr), transition: "none"} :
                                        {}
                                }
                            />
                        ))}
                    </svg>
                    <span className={b.el("label-selection-dummy")}>{label}</span>
                </div>
            </button>
        );
    }
}

Button.propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func,
};

Button.defaultProps = {
    onClick: () => {},
};


export default Button;
