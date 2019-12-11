import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from "classnames";

import bem from "../../includes/Bem";

const b = bem("gm-h1");
class H1 extends Component {
    render() {
        const {
            children,
            className,
        } = this.props;

        return (
            <h1 className={classNames(b, className)}>
                {children.slice(0, -1)}<span style={{letterSpacing: 0}}>{children.slice(-1)}</span>
            </h1>
        );
    }
}

H1.propTypes = {
    children: PropTypes.string,
    className: PropTypes.string,
};

H1.defaultProps = {
    children: "",
    className: "",
};

export default H1;
