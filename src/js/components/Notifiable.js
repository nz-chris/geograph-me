import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Notifiable extends Component {
    render() {
        const rootClass = 'notifiable';
        return (
            <span className={classNames(rootClass, this.props.extraClassName)}
                  message={this.props.message}
            >
                {this.props.children}
            </span>
        );
    }
}

Notifiable.propTypes = {
    children: PropTypes.element,
    extraClassName: PropTypes.string,
    message: PropTypes.string,
};

export default Notifiable;
