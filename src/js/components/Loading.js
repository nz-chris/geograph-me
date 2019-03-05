import React, {Component} from 'react';

class Loading extends Component {
    constructor(props) {
        super(props);

        this.ref = React.createRef();
    }

    componentDidMount() {
        this.ref.current.style.transition = `opacity ${this.props.fadeInTime}ms ease-in-out`;
        setTimeout((ref) => {
            ref.style.opacity = 1;
        }, this.props.showAfterTime, this.ref.current);
        setTimeout((ref) => {
            ref.style.transition = 'none';
        }, this.props.fadeInTime, this.ref.current);
    }

    render() {
        return (
            <div className={'loading'}
                 style={this.props.style}
                 ref={this.ref}
            >
                <div className={"lds-ring"}>
                    <div/>
                    <div/>
                    <div/>
                    <div/>
                </div>
            </div>
        );
    }
}

Loading.defaultProps = {
    showAfterTime: 200,
    fadeInTime: 1000,
};

export default Loading;
