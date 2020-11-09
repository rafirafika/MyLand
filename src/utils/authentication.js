import Cookies from 'js-cookie';
import jwtDecode from "jwt-decode";

var randomToken = require('random-token');
var engine = require('store/src/store-engine');
var storages = [
    require('store/storages/sessionStorage'),
    require('store/storages/cookieStorage'),
]
var plugins = [
    require('store/plugins/defaults'),
]
var CryptoJS = require('crypto-js');
var store = engine.createStore(storages, plugins);

const authentication = {
    csrftoken,
    getToken,
    getDecodeJwttoken,
    setJwttokenToStorage,
    cekDataStorages,
    decryptData,
    getDataStorages,
}

function csrftoken(lengthToken){
    let cookies = randomToken(lengthToken);
    Cookies.set('CSRF-TOKEN', cookies);
    return cookies;
}

function decryptData(name){
    let dataStorage = store.get(name);
    let bytes = CryptoJS.AES.decrypt(dataStorage.page,'estate');
    let dataJSON = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return dataJSON;
}

function getToken(name){
    let token = decryptData(name).token;
    return token;
}

function getDecodeJwttoken(token){
    let decoded = jwtDecode(token);
    return decoded;
}

function setJwttokenToStorage(data, name){
    let dataToStorage = CryptoJS.AES.encrypt(JSON.stringify(data), 'estate');
    let stringDataToStorage = dataToStorage.toString();

    store.set(name, {
        page : stringDataToStorage,
    });
}

function cekDataStorages(name){
    if(store.get(name)){
        return true;
    }
    return false;
}

function getDataStorages(name){
    let data = store.get(name);
    return data;
}

export default authentication;