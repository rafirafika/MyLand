import request from 'src/utils/request';
const zoneService = {
    getProvince,
    // getCity,
    // getDistrict,
    // getSubDistrict,
}
function getProvince(){ 
    return fetch('https://dev.farizdotid.com/api/daerahindonesia/provinsi').then(request.handleResponse);
}
export default zoneService;