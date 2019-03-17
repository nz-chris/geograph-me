import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class CountryInput extends Component {
    constructor(props) {
        super(props);

        this.rootClass = 'country-input';

        this.inputRef = null;
    }

    render() {
        return (
            <input className={classNames(this.rootClass, this.props.extraClassName)}
                   type={'text'}
                   placeholder={this.props.placeholder}
                   ref={(ref) => {
                       this.inputRef = ref;
                       this.props.inputRefCallback(ref);
                   }}
                   onBlur={() => this.props.onSubmit(this.inputRef.value)}
                   onKeyPress={(e) => e.key === 'Enter' && this.props.onSubmit(this.inputRef.value)}
            />
        );
    }
}

CountryInput.propTypes = {
    extraClassName: PropTypes.string,
    placeholder: PropTypes.string,
    onSubmit: PropTypes.func,
    inputRefCallback: PropTypes.func,
};

CountryInput.defaultProps = {
    extraClassName: '',
    placeholder: '',
    onSubmit: () => {},
    inputRefCallback: () => {},
};

export default CountryInput;