import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase'
import App from './App';
import './assets/styles/main.sass';
import history from 'src/routes/history';
import configureStore from 'src/config/store';
import firebase from 'src/config/firebase';
import { ConnectedRouter } from 'connected-react-router';
import { createFirestoreInstance } from 'redux-firestore';
import 'firebase/auth';

const rrfConfig = {
    userProfile: 'users',
    userFireStoreForProfile: true,
}
const initialState = {};
const store = configureStore(initialState, history);

const rrfProps = {
    firebase,
    config: rrfConfig,
    dispatch: store.dispatch,
    createFirestoreInstance,
}
ReactDOM.render(
    <Provider store={store} >
        <ReactReduxFirebaseProvider {...rrfProps}>
            <ConnectedRouter history={history} >
                <App />
            </ConnectedRouter>
        </ReactReduxFirebaseProvider>

    </Provider>, document.getElementById('app')
);


//REACT
// ReactDOM.render(
//     <BrowserRouter>
//      <App />
//     </BrowserRouter>
//     , document.getElementById('app'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
