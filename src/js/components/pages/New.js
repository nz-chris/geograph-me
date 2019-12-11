import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Input from '../simple-ui/Input';
import Button from '../simple-ui/Button';
import H1 from '../simple-ui/H1';

class New extends Component {
    render() {
        return (
            <div className={"narrow-container"}>
                <H1 className={"tc"}>registration</H1>
                <div style={{height: "4vmin"}} />
                <Input label={"username"} />
                <div style={{height: "4vmin"}} />
                <Input label={"email"} type={Input.types.EMAIL} />
                <div style={{height: "4vmin"}} />
                <Input label={"confirm email"} type={Input.types.EMAIL} />
                <div style={{height: "4vmin"}} />
                <Input label={"password"} type={Input.types.PASSWORD} />
                <div style={{height: "4vmin"}} />
                <Input label={"confirm password"} type={Input.types.PASSWORD} />
                <div style={{height: "4vmin"}} />
                <Button label={"REGISTER"} />
            </div>
        );
    }
}

New.propTypes = {
    // myProp: PropTypes.string.isRequired
};

export default New;
