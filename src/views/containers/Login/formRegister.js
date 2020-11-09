import React, { memo, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { estateSelector } from 'src/views/selectors';
import { createUser } from 'src/views/actions';
import { Helmet } from "react-helmet";
import Alert from 'src/components/common/Alert';
import Validate from "src/utils/validate";
import {
  InputGroupAddon,
  InputGroupText,
  FormInput,
  InputGroup,
  Button,
  CardTitle,
  Tooltip,
} from "shards-react";

const initialForm = {
  email: '',
  password: '',
  rePassword: '',
}
class FormRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: JSON.parse(JSON.stringify(initialForm)),
      errors: {
        email: false,
        password: false,
        rePassword: false,
      },
      showAlert: false,
      alertMessage: '',
      openTooltip : false,
    };
    this.onChangeForm = this.onChangeForm.bind(this);
    this.checkPass = this.checkPass.bind(this);

  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { createUserFailed, createUserError } = nextProps;
    if (createUserFailed) {
      if (createUserError.message != undefined) {
        this.setState({
          alertMessage: createUserError.message,
          showAlert: true,
        })
      }
    }
  }

  onChangeForm(e) {
    let { form, errors, openTooltip } = this.state;
    let { name, value } = e.target;
    form[name] = value;
    errors[name] = false;
    openTooltip = false;
    this.setState({ form, errors, openTooltip });
  }

  onSubmit() {
    let { form, errors } = this.state;
    const location = this.props.location;
    if (!Validate.checkEmpty(form, errors)) {
      this.props.createUserFirebase(form.email, form.password, location);
    } else {
      this.setState({
        errors: Validate.setErrEmpty(form, errors),
      })
    }
  }

  checkPass() {
    const {form, errors } = this.state;
    if(form.password != form.rePassword){
      errors.rePassword = true;
      this.setState({
        openTooltip: true,
        errors,
      });
    }
   
  }

  render() {
    const { createUserResult, createUserError } = this.props;
    const { form, showAlert, alertMessage, errors, openTooltip } = this.state;
    return (
      <div>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{'Registration'}</title>
          <link rel="canonical" href="http://mysite.com/example" />
        </Helmet>
        <CardTitle className="text-center">
          <i className="material-icons iconLogin">grass</i>
          <br></br>
          Create New Account
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
            <InputGroupText><i className="material-icons">email</i></InputGroupText>
          </InputGroupAddon>
          <FormInput
            type="email"
            placeholder="Email"
            name="email"
            value={form.email}
            onChange={this.onChangeForm}
            invalid={errors.email}
          ></FormInput>
        </InputGroup>
        <InputGroup className="mb-2">
          <InputGroupAddon type="prepend">
            <InputGroupText><i className="material-icons">lock</i></InputGroupText>
          </InputGroupAddon>
          <FormInput
            type="password"
            placeholder="Password"
            name="password"
            value={form.password}
            onChange={this.onChangeForm}
            invalid={errors.password}
            onBlur={this.checkPass}
          ></FormInput>
        </InputGroup>
        <InputGroup className="mb-2">
          <InputGroupAddon type="prepend">
            <InputGroupText><i className="material-icons">lock</i></InputGroupText>
          </InputGroupAddon>
          <FormInput
            type="password"
            placeholder="Confirm Password"
            name="rePassword"
            value={form.rePassword}
            onChange={this.onChangeForm}
            invalid={errors.rePassword}
            id="tooltipPass"
            onBlur={this.checkPass}
          ></FormInput>
          <Tooltip
            open={openTooltip}
            target="#tooltipPass"
          >
            Password is Incorrect 
        </Tooltip>
        </InputGroup>
        <Button
          variant="primary"
          className="btn-block"
          onClick={() => this.onSubmit()}
          disabled={openTooltip}
        >Register</Button>
      </div>
    );
  }
}

FormRegister.propTypes = {
  createUserFirebase: PropTypes.func,
}
const mapStateToProps = createStructuredSelector({
  createUserResult: estateSelector('createUserResult'),
  createUserError: estateSelector('createUserError'),
  createUserSuccess: estateSelector('createUserSuccess'),
  createUserFailed: estateSelector('createUserFailed'),
})

export function mapDispatchToProps(dispatch) {
  return {
    createUserFirebase: (email, password, location) => dispatch(createUser(email, password, location)),
  };
}
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(FormRegister);
// export default FormRegister;