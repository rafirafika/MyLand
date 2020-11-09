import React, { memo, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { estateSelector } from 'src/views/selectors';
import { loginUser } from 'src/views/actions';
import { Helmet } from "react-helmet";
import history from 'src/routes/history';
import AuthenticationFunc from "src/utils/authentication";
import Validate from "src/utils/validate";
import Alert from 'src/components/common/Alert';

import {
  InputGroupAddon,
  InputGroupText,
  FormCheckbox,
  FormInput,
  InputGroup,
  Button,
  Col,
  Row,
  CardTitle
} from "shards-react";

const initialForm = {
  email: '',
  password: '',
  rememberMe: false,
}

class FormLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: JSON.parse(JSON.stringify(initialForm)),
      showAlert: false,
      alertMessage: '',
      errors : {
        email : false,
        password : false,
      }
    };
    this.onChangeForm = this.onChangeForm.bind(this);
  }

  componentDidMount() {
    if (AuthenticationFunc.cekDataStorages('estate')) {
      let dataDecrypt = AuthenticationFunc.decryptData('estate');
      let decode = AuthenticationFunc.getDecodeJwttoken(dataDecrypt.token);
      if (decode.exp > 0) {
        history.push('/');
      }
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { loginUserFailed, loginUserError } = nextProps;
    
    if (loginUserFailed) {
      if (loginUserError.message != undefined) {
        this.setState({
          alertMessage: loginUserError.message,
          showAlert: true,
        })
      }
    }
  }

  onChangeForm(e, chkBox) {
    let { form, errors } = this.state;
    let { name, value } = e.target;
    if (chkBox != undefined && chkBox != '') {
      form[chkBox] = !form[chkBox];
    } else {
      form[name] = value;
      errors[name] = false;
    }
    this.setState({ form, errors });
  }
  onSubmit() {
    const { form, errors } = this.state;
    const location = this.props.location;
    if(!Validate.checkEmpty(form, errors)){
      this.props.loginUserFirebase(form.email, form.password, location);      
    } else {
      this.setState({
        errors: Validate.setErrEmpty(form, errors),
      })
    }
    
  }
  render() {
    const { form, showAlert, alertMessage, errors } = this.state;
    const { location } = this.props;
    const { title } = location.state;
    return (
      <div>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{title}</title>
          <link rel="canonical" href="http://mysite.com/example" />
        </Helmet>
        <CardTitle className="text-center">
          <i className="material-icons iconLogin">grass</i>
          <br></br>
          Access Your Account
        </CardTitle>
        <Alert
          theme="danger"
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
            value={form.email}
            onChange={this.onChangeForm}
            invalid={errors.email}            
          ></FormInput>
        </InputGroup >
        <InputGroup className="mb-2">
          <InputGroupAddon type="prepend">
            <InputGroupText><i className="material-icons">lock</i></InputGroupText>
          </InputGroupAddon>
          <FormInput
            type="password"
            placeholder="Password"
            name="password"
            invalid={errors.password}
            value={form.password}
            onChange={this.onChangeForm}>
          </FormInput>
        </InputGroup >
        <Row style={{ marginTop: '5px' }}>
          <Col style={{ paddingTop: '5px' }}>
            <FormCheckbox
              name="rememberMe"
              value={form.rememberMe ? false : true}
              checked={form.rememberMe}
              onChange={e => this.onChangeForm(e, "rememberMe")}
            >Remember me?</FormCheckbox>
          </Col>
        </Row>
        <Button style={{ width: '100%' }} onClick={() => this.onSubmit()}>Submit</Button>
      </div>
    );
  }
}

FormLogin.propTypes = {
  loginUserFirebase: PropTypes.func,
}
const mapStateToProps = createStructuredSelector({
  loginUserResult: estateSelector('loginUserResult'),
  loginUserError: estateSelector('loginUserError'),
  loginUserSuccess: estateSelector('loginUserSuccess'),
  loginUserFailed: estateSelector('loginUserFailed'),
})

export function mapDispatchToProps(dispatch) {
  return {
    loginUserFirebase: (email, password, location) => dispatch(loginUser(email, password, location)),
  };
}
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(FormLogin);
// export default FormLogin;