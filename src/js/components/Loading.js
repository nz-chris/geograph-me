import React, {Component} from 'react';
import PropTypes from 'prop-types';

import utils from '../utils/Utils'

class Loading extends Component {
    constructor(props) {
        super(props);

        this.rootClass = 'loading';

        this.ref = React.createRef();
    }

    componentDidMount() {
        this.ref.current.style.transition = `opacity ${this.props.fadeInTime}ms ease-in-out`;
        setTimeout((ref) => {
            ref.style.opacity = 1;
        }, this.props.showAfterTime, this.ref.current);
        setTimeout((ref) => {
            ref.style.transition = 'none';
        }, this.props.fadeInTime, this.ref.current);
    }

    render() {
        return (
            <div className={this.rootClass}
                 style={this.props.style}
                 ref={this.ref}
            >
                <div className={utils.el(this.rootClass, 'ring')}>
                    <div />
                    <div />
                    <div />
                    <div />
                </div>
            </div>
        );
    }
}

Loading.propTypes = {
    showAfterTime: PropTypes.number,
    fadeInTime: PropTypes.number,
    style: PropTypes.object,
};

Loading.defaultProps = {
    showAfterTime: 200,
    fadeInTime: 1000,
    style: {},
};

export default Loading;
