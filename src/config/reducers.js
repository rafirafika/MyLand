import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import history from 'src/routes/history';
import globalReducer from 'src/views/reducer';
import languageProviderReducer from 'src/components/langProvider/reducer';
import {firebaseReducer} from "react-redux-firebase";
import {firestoreReducer} from "redux-firestore";

export default function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer,
    // global : globalReducer,
    language : languageProviderReducer,
    router: connectRouter(history),
    ...injectedReducers,
  });

  return rootReducer;
}

