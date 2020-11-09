
import * as firebase from "firebase/app";
import "firebase/auth";
import 'firebase/firestore';
import 'firebase/database';

// Your app's Firebase configuration
var firebaseConfig = {
  apiKey: 'AIzaSyBpSqHYV8a7v7P9a5Rm7RuMkiKPS2YtdVA',
  authDomain: 'estatebe-4da29.firebaseapp.com',
  databaseURL: 'https://estatebe-4da29.firebaseio.com',
  projectId: 'estatebe-4da29',
  storageBucket: 'estatebe-4da29.appspot.com',
  messagingSenderId: '165274831792',
  appId: '1:165274831792:web:2350d909df362f99bfa475',
  measurementId: 'G-BL0CQWZT6J'
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.firestore()

// Finally, export it to use it throughout your app
export default firebase;