import React, { Component } from 'react';
import propTypes from 'prop-types';
import ReactLoadingOverlay from 'react-loading-overlay';


class LoadingOverlay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCount: 2,
        };
        this.timer = this.timer.bind(this);
    }
    componentDidMount() {
        var intervalId = setInterval(this.timer, 1000);
        this.setState({ intervalId: intervalId });
    }
    componentWillUnmount() {
        clearInterval(this.state.intervalId);
    }
    timer() {
        if (this.state.currentCount == 0) {
            clearInterval(this.state.intervalId);
        } else {
            this.setState({ currentCount: this.state.currentCount - 1 });
        }
    }

    render() {
        const {
            isActive,
            message,
            useTimer,
        } = this.props;

        return (
            <ReactLoadingOverlay
                active={useTimer ? this.state.currentCount > 0 : isActive}
                spinner
                text={message}
                styles={{
                    overlay: (base) => ({
                        ...base,
                        background: '#f6f4e6',
                        opacity: '0.9',
                        color: '#838383'
                    }),
                    spinner: (base) => ({
                        ...base,
                        width: '50px',
                        '& svg circle': {
                            stroke: '#0779e4'
                        }
                    })
                }
                }
            >
                {this.props.children}
            </ReactLoadingOverlay>
        )
    }
}

LoadingOverlay.propTypes = {
    isActive: propTypes.bool,
    message: propTypes.string,
    useTimer: propTypes.bool,
}

LoadingOverlay.defaultProps = {
    useTimer: false,
    isActive: false,
    message: 'Loading your content...',
};

export default LoadingOverlay;