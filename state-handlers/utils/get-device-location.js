const axios = require('axios');

module.exports = function(deviceId, consentToken) {
    let apiUrl = 'https://api.amazonalexa.com/v1/devices/${deviceId}/settings/address/countryAndPostalCode';
    let config = {
        headers: {
            Authorization: 'Bearer ${consentToken}',
        },
    };
    return axios.get(apiUrl, config).then((response) => {
        return response.data;
    }).catch((err) => {
        throw err;
    });
};
