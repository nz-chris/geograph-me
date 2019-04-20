// External
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// Helpers / Constants
import b from '../includes/Bem';

class QuizInput extends Component {
    constructor(props) {
        super(props);

        this.b = b('quiz-input');

        this.inputRef = null;
    }

    render() {
        const b = this.b;

        return (
            <input className={classNames(b.toString(), this.props.extraClassName)}
                   type={'text'}
                   placeholder={this.props.placeholder}
                   ref={(ref) => {
                       this.inputRef = ref;
                       this.props.inputRefCallback(ref);
                   }}
                   onChange={this.props.onChange}
                   onKeyPress={(e) => e.key === 'Enter' && this.props.onSubmit(this.inputRef.value)}
            />
        );
    }
}

QuizInput.propTypes = {
    extraClassName: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
    inputRefCallback: PropTypes.func,
};

QuizInput.defaultProps = {
    extraClassName: '',
    placeholder: 'Enter your answer',
    onChange: () => {},
    onSubmit: () => {},
    inputRefCallback: () => {},
};

export default QuizInput;