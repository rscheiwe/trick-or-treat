const convertToTimezon = require('zipcode-to-timezone');
const getDeviceLocation = require('./state-handlers/utils/get-device-location');
const convertZipcodeToLocalDate = require('./state-handlers/utils/convert-zipcode-to-local-date');

// let deviceId = 'amzn1.ask.device.AEV3IL4SRN3DS7XK2L3HYAN2QJYUYTCC54MUWUP2KMSRWMU7ZWTK4ABM2BN5FKBBGEZHPR6WQHX3XSGHVGW3O4WGTGB5ZVO4XDKH7Z7LSNSW5JXIOLWWGGZXGIZESADZNSYCSJZANPQYJTE6OAZJB4M5KVWQ';
// let consentToken = 'Atza|IwEBIJGUURfJ5m3rbDlwbEXHgfLf77C9vYsqNYUkmNzDHFcRVCYO9Fe0ZQRraPrA0ipYJvpSs-gtxcZnF4CjdbZKXFyfWwkR_u-ms4AyIXLZun2uHbPg_VIzlqlY9AQ3eouSXXN_o638YpVcA967hCbICmP3djme3U2MgRk0_K-s3ZAyhZHwQfuZLgpwhS9l7cACeUWIeGwomaPg7_mwgs_qZWPL8xsOpMTIMXyBTUYCi0TeHM5dNA9YUEOIGOi1Y6NivPdIJDJo9uBfZLQeliVfhkfstOuCjN4qdw550vQde-YXnQ7RxxM4PGK7YC7UBiK2HzSsrcg73N1cZ7KS98dfPXSn4slD4QZBz3YMz29P5g9l272LBiMjYxFKUwDW-NRPTHIhokKe_uGL8pE7PiDGg5cBkPbiS4wMrVXdM7NBIvdR3oM2CRvKNHRqfi9k3eErzkAT7aJTgqTdG1HJuFe14C0xlVQ8EZ5L9CSkQXfdnf1-56MSZ2ecZHG5HHcktUXfh88pA1YiTxqV0ncFUDXFNMyj';

// getDeviceLocation(deviceId, consentToken).then((response) => {
//     return response.postalCode;
// }).then((zipcode) => {
//     return convertZipcodeToLocalDate(zipcode);
// }).catch((err) => {
//     console.error('1st err: ', err.message);
//     throw err;
// }).then((date) => {
//     console.log('date: ', date);
// }).catch((err) => {
//     console.error('2nd err: ', err.message);
// });

// console.log(JSON.parse({
//     'access_token': 'ya29.GlvdBKkN7OW9d1SjaDU3xXSO_MSeJ_V928SvrDJCO1OIvHiRNRFHwDvKtMTXmnLLf7UUgTr9X7hrwjYdm7kfzAAQ6-duG3OF8Xrc5xdq9GIEwqWXhjnw8893YHyQ',
//     'refresh_token': '1/GXsUEVdjUo7mQ8Tls1VwAGwAWSxVWcIRpRDb8y_BkA4',
//     'token_type': 'Bearer'
//     // ,expiry_date: 1507355706575
// }));
a = 'a';
let obj = {
    f: function () {
        return function () {
            this.a = 'b';
            console.log(this.a);
        };
    }
};
let closure = obj.f();
closure();