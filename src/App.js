import "regenerator-runtime/runtime";
import React from "react";
import {
  Router,
  Route,
  Switch
} from "react-router-dom";
import routes from "src/routes/routes";
import PrivateRoutes from "src/routes/private-route";
import history from "src/routes/history";
import withTracker from "src/withTracker";
import Errors404 from "src/views/containers/Errors/404";

export default () => (
  <Router basename={process.env.REACT_APP_BASENAME || ""} history={history}>
    <Switch>
      {routes.map((route, index) => {
        return (route.private ? (
          <PrivateRoutes
            key={index}
            path={route.path}
            exact={route.exact}
            component={route.component}
            layout={route.layout}
            title={route.title}
          />
        ) : (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              title={route.title}
              component={withTracker(props => {
                props.location.state = { title: route.title };
                return (
                  <route.layout {...props}>
                    <route.component {...props} />
                  </route.layout>
                );
              })}
            />
          ))

      })}
      <Route path="*" component={Errors404} />
    </Switch>
  </Router>
);
