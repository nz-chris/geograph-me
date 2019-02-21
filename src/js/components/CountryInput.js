import React, { Component } from 'react';
import classNames from 'classnames';

class CountryInput extends Component {
    constructor(props) {
        super(props);

        this.rootClass = 'country-input';
        this.inputRef = React.createRef();

        this.onBlur = this.onBlur.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.clear) {
            this.inputRef.current.value = '';
        }
    }


    onBlur() {
        this.props.onSubmit(this.inputRef.current.value);
    }

    render() {
        const inputClassName = classNames(this.rootClass, this.props.extraClassNames);

        return (
            <input className={inputClassName}
                   type={'text'}
                   placeholder={this.props.placeholder}
                   ref={this.inputRef}
                   onBlur={this.onBlur}
                   onKeyPress={(e) => {e.key === 'Enter' && this.props.onSubmit(this.inputRef.current.value)}}
            />
        );
    }
}

export default CountryInput;