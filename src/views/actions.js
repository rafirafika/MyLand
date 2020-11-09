import {
  GET_PROVINCE, GET_PROVINCE_SUCCESS, GET_PROVINCE_FAILED,
  GET_CITY, GET_CITY_SUCCESS, GET_CITY_FAILED,
  GET_DISTRICT, GET_DISTRICT_SUCCESS, GET_DISTRICT_FAILED,
  GET_SUBDISTRICT, GET_SUBDISTRICT_SUCCESS, GET_SUBDISTRICT_FAILED,
  SAVE_DATA_FARM_LOCATION, SAVE_DATA_FARM_HARVEST, SAVE_DATA_RAM,
  SAVE_DATA_PRICE_RAM, SAVE_DATA_NEWS, SAVE_DATA_PURCHASE_TRANS,
  CREATE_USER, CREATE_USER_SUCCESS, CREATE_USER_FAILED,
  LOGIN_USER, LOGIN_USER_SUCCESS, LOGIN_USER_FAILED,
  LOGOUT_USER, LOGOUT_USER_SUCCESS, LOGOUT_USER_FAILED,
  SENDPASS_RESETEMAIL, SENDPASS_RESETEMAIL_SUCCESS, SENDPASS_RESETEMAIL_FAILED

} from './constants';

export function getProvince() {
  return {
    type: GET_PROVINCE,
  };
}
export function getProvinceSuccess(provinces) {
  return {
    type: GET_PROVINCE_SUCCESS,
    provinces
  };
}
export function getProvinceFailed(provincesError) {
  return {
    type: GET_PROVINCE_FAILED,
    provincesError
  };
}

export function getCity(province) {
  return {
    type: GET_CITY,
    province,
  };
}
export function getCitySuccess(cities) {
  return {
    type: GET_CITY_SUCCESS,
    cities,
  };
}
export function getCityFailed(citiesError) {
  return {
    type: GET_CITY_FAILED,
    citiesError,
  };
}

export function getDistrict(city) {
  return {
    type: GET_DISTRICT,
    city,
  };
}
export function getDistrictSuccess(districts) {
  return {
    type: GET_DISTRICT_SUCCESS,
    districts,
  };
}
export function getDistrictFailed(districtsError) {
  return {
    type: GET_DISTRICT_FAILED,
    districtsError,
  };
}

export function getSubDistrict(district) {
  return {
    type: GET_SUBDISTRICT,
    district,
  };
}
export function getSubDistrictSuccess(subDistricts) {
  return {
    type: GET_SUBDISTRICT_SUCCESS,
    subDistricts,
  };
}
export function getSubDistrictFailed(subDistrictsError) {
  return {
    type: GET_SUBDISTRICT_FAILED,
    subDistricts,
  };
}

export function saveDataFarmLocation(dataFarmLocation) {
  return {
    type: SAVE_DATA_FARM_LOCATION,
    dataFarmLocation
  }
}

export function saveDataFarmHarvest(dataFarmHarvest) {
  return {
    type: SAVE_DATA_FARM_HARVEST,
    dataFarmHarvest
  }
}

export function saveDataRAM(dataRAM) {
  return {
    type: SAVE_DATA_RAM,
    dataRAM
  }
}

export function saveDataPriceRAM(dataPrice) {
  return {
    type: SAVE_DATA_PRICE_RAM,
    dataPrice
  }
}

export function saveDataNews(dataNews) {
  return {
    type: SAVE_DATA_NEWS,
    dataNews
  }
}

export function saveDataPurchaseTrans(dataPurchaseTrans) {
  return {
    type: SAVE_DATA_PURCHASE_TRANS,
    dataPurchaseTrans
  }
}

export function createUser(email, password, location) {
  return {
    type: CREATE_USER,
    email, password, location
  };
}
export function createUserSuccess(createUserResult) {
  return {
    type: CREATE_USER_SUCCESS,
    createUserResult,
  };
}
export function createUserFailed(createUserError) {
  return {
    type: CREATE_USER_FAILED,
    createUserError,
  };
}

export function loginUser(email, password, location) {
  return {
    type: LOGIN_USER,
    email, password, location,
  };
}
export function loginUserSuccess(loginUserResult) {
  return {
    type: LOGIN_USER_SUCCESS,
    loginUserResult,
  };
}
export function loginUserFailed(loginUserError) {
  return {
    type: LOGIN_USER_FAILED,
    loginUserError,
  };
}

export function logoutUser() {
  return {
    type: LOGOUT_USER,
  };
}
export function logoutUserSuccess(logoutUserResult) {
  return {
    type: LOGOUT_USER_SUCCESS,
    logoutUserResult,
  };
}
export function logoutUserFailed(logoutUserError) {
  return {
    type: LOGOUT_USER_FAILED,
    logoutUserError,
  };
}

export function sendPasswordResetEmail(email, actionCodeSettings) {
  return {
    type: SENDPASS_RESETEMAIL,
    email, actionCodeSettings
  };
}
export function sendPasswordResetEmailSuccess(sendPassResetResult) {
  return {
    type: SENDPASS_RESETEMAIL_SUCCESS,
    sendPassResetResult,
  };
}
export function sendPasswordResetEmailFailed(sendPassResetError) {
  return {
    type: SENDPASS_RESETEMAIL_FAILED,
    sendPassResetError,
  };
}