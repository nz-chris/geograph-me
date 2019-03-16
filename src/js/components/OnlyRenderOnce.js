import React, {Component} from 'react';
import PropTypes from 'prop-types';

class OnlyRenderOnce extends Component {
    shouldComponentUpdate() {
        return false;
    }

    render() {
        const {ComponentToRender, ...actualProps } = this.props;

        return <ComponentToRender {...actualProps} />
    }
}

OnlyRenderOnce.propTypes = {
    ComponentToRender: PropTypes.func
};

export default OnlyRenderOnce;
