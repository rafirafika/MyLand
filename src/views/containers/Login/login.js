import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'src/utils/injectReducer';
import { useInjectSaga } from 'src/utils/injectSaga';
import reducer from 'src/views/reducer';
import saga from 'src/views/saga';
import CoverLogin from 'src/assets/images/key.png';
import FormLogin from './formLogin';
import FormRegister from './formRegister';
import FormResetPass from './formResetPass';
import {
  Button,
  Row,
  Card,
  Col,
  CardImg,
  CardBody,
} from "shards-react";

const key = 'estate';

export function Login(props) {
  const [stateForm, setStateForm] = useState('login');
  const { location } = props;
  useEffect(() => {
  }, []);
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  
  return (
    <div>      
      <Card className="loginForm" style={{ width: '350px', margin: 'auto', marginTop: '5%' }}>
        <CardBody>
          {stateForm === 'login' &&
            <div>
              <FormLogin location={location}></FormLogin>
              <Row style={{ marginTop: '10px' }}>
                <Col sm="12" lg="6" style={{ marginTop: '5px' }}>
                  <Button
                    outline
                    type="button"
                    theme="secondary"
                    style={{ width: '100%' }}
                    onClick={() => setStateForm('forpass')}>Forgot Password</Button>
                </Col>
                <Col sm="12" lg="6" style={{ marginTop: '5px' }}>
                  <Button
                    outline
                    type="button"
                    theme="secondary"
                    style={{ width: '100%' }}
                    onClick={() => setStateForm('reg')}
                  >Sign Up</Button>
                </Col>
              </Row>
            </div>
          }
          {stateForm === 'reg' &&
            <div>
              <FormRegister location={location}></FormRegister>
              <Row>
                <Col sm="12" lg="6" style={{ marginTop: '5px' }}>
                  <Button
                    outline
                    type="button"
                    theme="secondary"
                    style={{ width: '100%' }}
                    onClick={() => setStateForm('login')}
                  >Sign In</Button>
                </Col>
              </Row>
            </div>
          }
          {stateForm === 'forpass' &&
            <div>
              <FormResetPass location={location}></FormResetPass>
              <Row>
                <Col sm="12" lg="6" style={{ marginTop: '5px' }}>
                  <Button
                    outline
                    type="button"
                    theme="secondary"
                    style={{ width: '100%' }}
                    onClick={() => setStateForm('login')}
                  >Sign In</Button>
                </Col>
                <Col sm="12" lg="6" style={{ marginTop: '5px' }}>
                  <Button
                    outline
                    type="button"
                    theme="secondary"
                    style={{ width: '100%' }}
                    onClick={() => setStateForm('reg')}
                  >Sign Up</Button>
                </Col>
              </Row>
            </div>
          }
        </CardBody>
      </Card>
    </div>
  );

}


Login.propTypes = {

}
const mapStateToProps = createStructuredSelector({

})

export function mapDispatchToProps(dispatch) {
  return {

  };
}
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(Login);