// External
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// Helpers / Constants
import b from '../includes/Bem';

class Notifiable extends Component {
    constructor(props) {
        super(props);

        this.b = b('notifiable');
    }

    render() {
        const b = this.b;

        return (
            <span className={classNames(b.toString(), this.props.extraClassName)}
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
