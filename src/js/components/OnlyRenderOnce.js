import React, {Component} from 'react';

class OnlyRenderOnce extends Component {
    shouldComponentUpdate() {
        return false;
    }

    render() {
        const {ComponentToRender, ...actualProps } = this.props;

        return <ComponentToRender {...actualProps} />
    }
}

export default OnlyRenderOnce;
