import React from "react";
import propTypes from 'prop-types';
import { Alert, Button } from "shards-react";

export default class AlertComp extends React.Component {
  constructor(props) {
    super(props);

    this.interval = null;
    this.state = {
      visible: false,
      countdown: 0,
      timeUntilDismissed: 5
    };

    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.clearInterval = this.clearInterval.bind(this);
  }

  componentDidMount(){
    const {open} = this.props;
    if(open){
        this.clearInterval();
        this.setState({ visible: true, countdown: 0, timeUntilDismissed: 5 });
        this.interval = setInterval(this.handleTimeChange, 1000);
    }
  }
  
  UNSAFE_componentWillReceiveProps(nextProps){
    if(nextProps.open){
        this.clearInterval();
        this.setState({ visible: true, countdown: 0, timeUntilDismissed: 5 });
        this.interval = setInterval(this.handleTimeChange, 1000);
    }
  }
  handleTimeChange() {
    if (this.state.countdown < this.state.timeUntilDismissed - 1) {
      this.setState({
        ...this.state,
        ...{ countdown: this.state.countdown + 1 }
      });
      return;
    }

    this.setState({ ...this.state, ...{ visible: false } });
    this.clearInterval();
    this.props.dismissible();
  }

  clearInterval() {
    clearInterval(this.interval);
    this.interval = null;
  }

  componentWillUnmount(){
    this.clearInterval();
  }
  dismissible(){
      this.setState({
          visible : false,
      })
      clearInterval();
      this.props.dismissible();
  }
  render() {
    const {
        message,
        theme,                
    } = this.props;
    const {
        visible
    } = this.state;
    
    return (
      <div>
        <Alert open={visible} theme={theme} dismissible={()=>this.dismissible()}>
          <span style={{display:'block', maxWidth:'90%'}}>{message || 'Unknow Error'}</span>
        </Alert>
      </div>
    );
  }
}

AlertComp.propTypes = {
    open : propTypes.bool,
    closeAlert : propTypes.bool,
    message : propTypes.string,
    theme : propTypes.string,
}

AlertComp.defaultProps = {
    open : false,
    theme : "primary",
};

