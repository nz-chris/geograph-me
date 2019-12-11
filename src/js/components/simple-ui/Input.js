import React, { Component } from 'react';
import PropTypes from 'prop-types';
import bem from '../../includes/Bem';

const b = bem('gm-input');
class Input extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: "",
        };
    }

    clear = () => this.state.value && this.setState({ value: "" });

    onChange = e => this.setState({ value: e.target.value });

    render() {
        const {
            label,
            type,
            clearButton,
        } = this.props;

        const {
            value,
        } = this.state;

        return (
            <div className={b}>
                { clearButton && (
                    <div className={b.el("clear")} onClick={this.clear} />
                )}
                <label className={b.el("label")}>
                    <span className={b.el("label-text")}>{label}</span>
                    <input
                        className={b.el("input")}
                        value={value}
                        placeholder={"..."}
                        type={type}
                        onChange={this.onChange}
                    />
                </label>
            </div>
        );
    }
}

Input.types = Object.freeze({
    TYPE: "type",
    BUTTON: "button",
    CHECKBOX: "checkbox",
    COLOR: "color",
    DATE: "date",
    DATETIME_LOCAL: "datetime-local",
    EMAIL: "email",
    FILE: "file",
    HIDDEN: "hidden",
    IMAGE: "image",
    MONTH: "month",
    NUMBER: "number",
    PASSWORD: "password",
    RADIO: "radio",
    RANGE: "range",
    RESET: "reset",
    SEARCH: "search",
    SUBMIT: "submit",
    TEL: "tel",
    TEXT: "text",
    TIME: "time",
    URL: "url",
    WEEK: "week",
});

Input.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    clearButton: PropTypes.bool,
};

Input.defaultProps = {
    label: "",
    type: "",
    clearButton: false,
};

export default Input;
