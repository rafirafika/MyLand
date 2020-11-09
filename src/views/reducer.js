import produce from 'immer';
import { fromJS } from 'immutable';
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
  SENDPASS_RESETEMAIL, SENDPASS_RESETEMAIL_SUCCESS, SENDPASS_RESETEMAIL_FAILED,

} from './constants';


export const initialState = {
  provinces: [],
  provincesError: false,
  cities: [],
  districts: [],
  subDistricts: [],
  dataFarmLocation: [{
    city: 'Kabupaten Dharmasraya',
    cityCode: '1311',
    district: 'Koto Besar',
    districtCode: '1311011',
    idLoc: 'u4j799s2oinvq0aqr3dcqf',
    landArea: '3',
    nameloc: 'Log',
    province: 'Sumatera Barat',
    provinceCode: '13',
    subDistrict: 'Koto Ranah',
    subDistrictCode: '1311011007',
  }
  ],
  dataFarmHarvest: [],
  dataRAM: [
    {
      "province": "Sumatera Barat",
      "provinceCode": "13",
      "city": "Kabupaten Dharmasraya",
      "cityCode": "1311",
      "district": "Sungai Rumbai",
      "districtCode": "1311010",
      "subDistrict": "Sungai Rumbai",
      "subDistrictCode": "1311010005",
      "ramName": "TEST 1",
      "idRAM": "larbonqz0be0ddjbahh06"
    }
  ],
  dataPriceRAM: [
    {
      "ramName": "TEST 1",
      "idRAM": "larbonqz0be0ddjbahh06",
      "idPrice": "o2jqac4bvwoyqi5dxvty78",
      "startDate": "20 September 2020",
      "finishDate": "30 September 2020",
      "priceKg": "1800",
      "reduction": "6"
    }
  ],
  dataNews: [],
  dataPurchaseTrans: [],
  createUserResult: {},
  createUserError: {},
  loginUserResult: {},
  loginUserError: {},
  logoutUserResult: {},
  logoutUserError: {},
  sendPassResetResult : {},
  sendPassResetError : {},
};


const estateReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_PROVINCE:
        draft.getProvinceSuccess = false;
        draft.getProvinceFailed = false;
        break;
      case GET_PROVINCE_SUCCESS:
        draft.getProvinceSuccess = true;
        draft.provinces = action.provinces;
        break;
      case GET_PROVINCE_FAILED:
        draft.getProvinceFailed = true;
        draft.provincesError = action.provincesError;
        break;

      case GET_CITY:
        draft.getCitySuccess = false;
        draft.getCityFailed = false;
        break;
      case GET_CITY_SUCCESS:
        draft.getCitySuccess = true;
        draft.cities = action.cities;
        break;
      case GET_CITY_FAILED:
        draft.getCityFailed = true;
        draft.citiesError = action.citiesError;
        break;

      case GET_DISTRICT:
        draft.getDistrictSuccess = false;
        draft.getDistrictFailed = false;
        break;
      case GET_DISTRICT_SUCCESS:
        draft.getDistrictSuccess = true;
        draft.districts = action.districts;
        break;
      case GET_DISTRICT_FAILED:
        draft.getDistrictFailed = true;
        draft.districtError = action.districtError;
        break;

      case GET_SUBDISTRICT:
        draft.getSubDistSuccess = false;
        draft.getSubDistFailed = false;
        break;
      case GET_SUBDISTRICT_SUCCESS:
        draft.getSubDistSuccess = true;
        draft.subDistricts = action.subDistricts;
        break;
      case GET_SUBDISTRICT_FAILED:
        draft.getSubDistFailed = true;
        draft.subDistrictError = action.subDistrictError;
        break;

      case SAVE_DATA_FARM_LOCATION:
        draft.dataFarmLocation = action.dataFarmLocation;
        break;

      case SAVE_DATA_FARM_HARVEST:
        draft.dataFarmHarvest = action.dataFarmHarvest;
        break;

      case SAVE_DATA_RAM:
        draft.dataRAM = action.dataRAM;
        break;

      case SAVE_DATA_PRICE_RAM:
        draft.dataPriceRAM = action.dataPrice;
        break;

      case SAVE_DATA_NEWS:
        draft.dataNews = action.dataNews;
        break;

      case SAVE_DATA_PURCHASE_TRANS:
        draft.dataPurchaseTrans = action.dataPurchaseTrans;
        break;

      case CREATE_USER:
        draft.createUserSuccess = false;
        draft.createUserFailed = false;
        draft.createUserResult = {};
        draft.createUserError = {};
        break;
      case CREATE_USER_SUCCESS:
        draft.createUserSuccess = true;
        draft.createUserResult = action.createUserResult;
        break;
      case CREATE_USER_FAILED:
        draft.createUserFailed = true;
        draft.createUserError = action.createUserError;
        break;

      case LOGIN_USER:
        draft.loginUserSuccess = false;
        draft.loginUserFailed = false;
        draft.loginUserResult = {};
        draft.loginUserError = {};
        break;
      case LOGIN_USER_SUCCESS:
        draft.loginUserSuccess = true;
        draft.loginUserResult = action.loginUserResult;
        break;
      case LOGIN_USER_FAILED:
        draft.loginUserFailed = true;
        draft.loginUserError = action.loginUserError;
        break;

      case LOGOUT_USER:
        draft.logoutUserSuccess = false;
        draft.logoutUserFailed = false;
        draft.logoutUserResult = {};
        draft.logoutUserError = {};
        break;
      case LOGOUT_USER_SUCCESS:
        draft.logoutUserSuccess = true;
        draft.logoutUserResult = action.logoutUserResult;
        break;
      case LOGOUT_USER_FAILED:
        draft.logoutUserFailed = true;
        draft.logoutUserError = action.logoutUserError;
        break;

      case SENDPASS_RESETEMAIL:
        draft.sendPassResetSuccess = false;
        draft.sendPassResetFailed = false;
        draft.sendPassResetResult = {};
        draft.sendPassResetError = {};
        break;
      case SENDPASS_RESETEMAIL_SUCCESS:
        draft.sendPassResetSuccess = true;
        draft.sendPassResetResult = action.sendPassResetResult;
        break;
      case SENDPASS_RESETEMAIL_FAILED:
        draft.sendPassResetFailed = true;
        draft.sendPassResetError = action.sendPassResetError;
        break;


    }
  });


export default estateReducer;
