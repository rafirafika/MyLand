import { call, put, select, takeEvery, all } from 'redux-saga/effects';
import request from 'src/utils/request';
import { estateSelector } from './selectors';
import ReduxSagaFirebase from 'redux-saga-firebase';
import firebaseConf from 'src/config/firebase';
import AuthenticationFunc from "src/utils/authentication";
import moment from 'moment';
import history from 'src/routes/history';

import {
  getProvinceFailed, getProvinceSuccess,
  getCitySuccess, getCityFailed,
  getDistrictSuccess, getDistrictFailed,
  getSubDistrictSuccess, getSubDistrictFailed,
  createUserSuccess, createUserFailed,
  loginUserSuccess, loginUserFailed,
  logoutUserSuccess, logoutUserFailed,
  sendPasswordResetEmailSuccess, sendPasswordResetEmailFailed
} from 'src/views/actions'

import {
  GET_PROVINCE, GET_CITY,
  GET_DISTRICT, GET_SUBDISTRICT,
  CREATE_USER, LOGIN_USER,
  LOGOUT_USER, SENDPASS_RESETEMAIL,
} from './constants';

const reduxSagaFirebase = new ReduxSagaFirebase(firebaseConf);

export function* getProvince() {
  const requestURL = 'https://dev.farizdotid.com/api/daerahindonesia/provinsi';

  try {
    const provinces = yield call(request, requestURL);
    yield put(getProvinceSuccess(provinces.provinsi));

  } catch (provincesError) {
    yield put(getProvinceFailed(provincesError));
  }
}

export function* getCity(param) {
  let provinceCode = param.province;
  const requestURL = 'https://dev.farizdotid.com/api/daerahindonesia/kota?id_provinsi=' + param.province;

  try {
    const cities = yield call(request, requestURL);
    yield put(getCitySuccess(cities.kota_kabupaten));

  } catch (cityError) {
    yield put(getCityFailed(cityError));
  }
}

export function* getDistrict(param) {
  let cityCode = param.city;
  const requestURL = 'https://dev.farizdotid.com/api/daerahindonesia/kecamatan?id_kota=' + cityCode;

  try {
    const districts = yield call(request, requestURL);
    yield put(getDistrictSuccess(districts.kecamatan));

  } catch (districtError) {
    yield put(getDistrictFailed(districtError));
  }
}

export function* getSubDistrict(param) {
  let districtCode = param.district;
  const requestURL = 'https://dev.farizdotid.com/api/daerahindonesia/kelurahan?id_kecamatan=' + districtCode;

  try {
    const subDistricts = yield call(request, requestURL);
    yield put(getSubDistrictSuccess(subDistricts.kelurahan));

  } catch (subDistrictError) {
    yield put(getSubDistrictFailed(subDistrictError));
  }
}

function* createUserFirebase(param) {
  try {
    const createUserResult = yield call(reduxSagaFirebase.auth.createUserWithEmailAndPassword, param.email, param.password);
    console.log('createUserResult', createUserResult);
    const resp = JSON.parse(JSON.stringify(createUserResult.user));

    var decoded = AuthenticationFunc.getDecodeJwttoken(resp.stsTokenManager.accessToken);
    var expTime = moment.unix(decoded.exp);

    var dataSaved = {
      token: resp.stsTokenManager.accessToken,
      expTime: expTime,
    }
    if (decoded.exp > 0) {

      AuthenticationFunc.setJwttokenToStorage(dataSaved, 'estate');
      if (param.location.search) {
        const reg = new RegExp('[?&]redirect=([^&#]*)', 'i');
        const string = reg.exec(param.location.search);

        window.location.replace(string[1]);
        return;
      }
      window.location.replace('/');

    } else {
      var error = {
        error: {
          message: 'Token expired',
        }
      }
      yield put(createUserFailed(error));
      return;
    }
    yield put(createUserSuccess(createUserResult));
  }
  catch (createUserError) {
    console.log('createUserError', createUserError);

    yield put(createUserFailed(createUserError));
  }
}

function* loginUserFirebase(param) {
  try {
    const data = yield call(reduxSagaFirebase.auth.signInWithEmailAndPassword, param.email, param.password);
    const resp = JSON.parse(JSON.stringify(data.user));

    var decoded = AuthenticationFunc.getDecodeJwttoken(resp.stsTokenManager.accessToken);
    var expTime = moment.unix(decoded.exp);

    var dataSaved = {
      token: resp.stsTokenManager.accessToken,
      expTime: expTime,
    }

    if (decoded.exp > 0) {

      AuthenticationFunc.setJwttokenToStorage(dataSaved, 'estate');
      if (param.location.search) {
        const reg = new RegExp('[?&]redirect=([^&#]*)', 'i');
        const string = reg.exec(param.location.search);

        window.location.replace(string[1]);
        return;
      }
      window.location.replace('/');

    } else {
      var error = {
        error: {
          message: 'Token expired',
        }
      }
      yield put(loginUserFailed(error));
      return;
    }

    yield put(loginUserSuccess(resp));
  }
  catch (error) {
    yield put(loginUserFailed(error));
  }
}

function* logoutUserFirebase() {
  try {
    const data = yield call(reduxSagaFirebase.auth.signOut);

    if (AuthenticationFunc.cekDataStorages('estate')) {
      sessionStorage.removeItem('estate');
      history.push('/Login');
    }
    yield put(logoutUserSuccess(data));
  }
  catch (error) {
    yield put(logoutUserFailed(error));
  }
}

function* sendPasswordResetEmail(param) {
  try {
    const resp = yield call(reduxSagaFirebase.auth.sendPasswordResetEmail, param.email, param.actionCodeSettings);
    yield put(sendPasswordResetEmailSuccess(resp));
  }
  catch (error) {
    console.log('SAGA error ', error);
    yield put(sendPasswordResetEmailFailed(error));
  }
}





function* actionWatcher() {
  yield takeEvery(GET_PROVINCE, getProvince);
  yield takeEvery(GET_CITY, getCity);
  yield takeEvery(GET_DISTRICT, getDistrict);
  yield takeEvery(GET_SUBDISTRICT, getSubDistrict);
  yield takeEvery(CREATE_USER, createUserFirebase);
  yield takeEvery(LOGIN_USER, loginUserFirebase);
  yield takeEvery(LOGOUT_USER, logoutUserFirebase);
  yield takeEvery(SENDPASS_RESETEMAIL, sendPasswordResetEmail);
}
export default function* rootSaga() {
  yield all([
    actionWatcher(),
  ]);
}