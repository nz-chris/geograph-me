import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class CountryInput extends Component {
    constructor(props) {
        super(props);

        this.rootClass = 'country-input';

        this.inputRef = React.createRef();
    }

    componentDidUpdate() {
        if (this.props.clear) {
            this.inputRef.current.value = '';
        }
    }

    render() {
        return (
            <input className={classNames(this.rootClass, this.props.extraClassName)}
                   type={'text'}
                   placeholder={this.props.placeholder}
                   ref={this.inputRef}
                   onBlur={() => this.props.onSubmit(this.inputRef.current.value)}
                   onKeyPress={(e) => e.key === 'Enter' && this.props.onSubmit(this.inputRef.current.value)}
            />
        );
    }
}

CountryInput.propTypes = {
    clear: PropTypes.bool,
    extraClassName: PropTypes.string,
    placeholder: PropTypes.string,
    onSubmit: PropTypes.func,
};

CountryInput.defaultProps = {
    clear: false,
    extraClassName: '',
    placeholder: '',
    onSubmit: () => {},
};

export default CountryInput;