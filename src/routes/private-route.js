import React from "react";
import moment from 'moment';
import AuthenticationFunc from "src/utils/authentication";
import {
  Router,
  Route,
  Redirect
} from "react-router-dom";

const PrivateRoute = ({ component: Component, layout: Layout, ...rest }) => {
  let exp = 0;
  let timeToken = null;
  let timeNow = null;
  let goToLogin = false;
  let goToPage = false;
  if (AuthenticationFunc.cekDataStorages('estate')) {
    let dataDecrypt = AuthenticationFunc.decryptData('estate');
    let decode = AuthenticationFunc.getDecodeJwttoken(dataDecrypt.token);
    exp = decode.exp;
    timeToken = moment.unix(exp).format('DD MMM YYYY HH:mm');
    timeNow = moment().format('DD MMM YYYY HH:mm');
    if (timeToken < timeNow) {
      sessionStorage.removeItem('estate');
      goToLogin = true;
    } else {
      goToPage = true;
    }
  } else {
    goToLogin = true;
  }

  if (goToLogin) {
    return (
      <Route {...rest} render={props => {
        props.location = { ...props.location, title: rest.title };
        return (
          <Redirect to={{
            pathname: '/Login',
            search: `?redirect=${props.location.pathname}${props.location.search}`,
            state: { from: props.location }
          }} />
        );
      }} />
    )
  } else if (goToPage) {
    return (      
      <Route {...rest} render={props => {
        props.location = { ...props.location, title: rest.title };
        return (
          <Layout {...props}>
            <Component {...props} />
          </Layout>
        );
      }} />
    );
  }
}

export default PrivateRoute;