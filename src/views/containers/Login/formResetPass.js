import React, { memo, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { estateSelector } from 'src/views/selectors';
import { Helmet } from "react-helmet";
import { sendPasswordResetEmail } from 'src/views/actions';
import Alert from 'src/components/common/Alert';
import {
  InputGroupAddon,
  InputGroupText,
  FormInput,
  InputGroup,
  Button,
  CardTitle
} from "shards-react";
class FormResetPass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      errEmail : false,
      actionCodeSettings : {
        url : 'http://localhost:8080/',
      },
      showAlert: false,
      alertMessage: '',
    };
    this.onChangeForm = this.onChangeForm.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { sendPassResetFailed, sendPassResetError, sendPassResetSuccess  } = nextProps;
    
    if (sendPassResetFailed) {
      if (sendPassResetError.message != undefined) {
        this.setState({
          alertMessage: sendPassResetError.message,
          showAlert: true,
        })
      }
    } else if(sendPassResetSuccess){
      this.setState({
        alertMessage: 'Reset password confirmation has been sent, please check your email to reset password',
        showAlert: true,
        email : '',
      })
    }
  }

  onChangeForm(e){
    let { name, value } = e.target;
    this.setState({email : value, errEmail:false});
  }

  sendResetEmail(){
    let { actionCodeSettings, email, errEmail } = this.state;
    if(email == ''){
      errEmail = true;
    } else {
      this.props.sendPasswordResetEmail(email, actionCodeSettings);
    }
    this.setState({errEmail});

  }
  render() {
    const { email, showAlert, alertMessage, errEmail } = this.state;
    const { sendPassResetSuccess } = this.props;
    return (
      <div>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{'forgot password?'}</title>
          <link rel="canonical" href="http://mysite.com/example" />
        </Helmet>
        <CardTitle className="text-center">
          <i className="material-icons iconLogin">grass</i>
          <br></br>
          <span>Reset Password</span>
        </CardTitle>
        <Alert
          theme={sendPassResetSuccess? "primary" : "danger"}
          open={showAlert}
          dismissible={() => this.setState({ showAlert: false, alertMessage: '' })}
          message={alertMessage}
        >
        </Alert>
        <InputGroup className="mb-2">
          <InputGroupAddon type="prepend">
            <InputGroupText><i className="material-icons">account_circle</i></InputGroupText>
          </InputGroupAddon>
          <FormInput
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={this.onChangeForm}
            invalid={errEmail}
          >
          </FormInput>
        </InputGroup>
        <Button style={{ width: '100%' }} onClick={()=>this.sendResetEmail()}>Reset Password</Button>
      </div>
    );
  }
}

FormResetPass.propTypes = {
  sendPasswordResetEmail: PropTypes.func,
}
const mapStateToProps = createStructuredSelector({
  sendPassResetResult: estateSelector('sendPassResetResult'),
  sendPassResetError: estateSelector('sendPassResetError'),
  sendPassResetSuccess: estateSelector('sendPassResetSuccess'),
  sendPassResetFailed: estateSelector('sendPassResetFailed'),
})

export function mapDispatchToProps(dispatch) {
  return {
    sendPasswordResetEmail: (email, actionCodeSettings) => dispatch(sendPasswordResetEmail(email, actionCodeSettings)),
  };
}
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(FormResetPass);
// export default FormResetPass;