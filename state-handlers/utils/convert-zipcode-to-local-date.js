const convertToTimezon = require('zipcode-to-timezone');

module.exports = function (zipCode) {
    let now = new Date();
    let UTCNow = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes());

    return new Date(new Date(UTCNow).toLocaleString('en-US', { timeZone: convertToTimezon.lookup(zipCode) })).getDate();
};

// console.log(convertToTimezon.lookup('07307'));
// let now = new Date();
// let UTCNow = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes());
// console.log('UTCNow: ', UTCNow);
// console.log('Date.now(): ', Date.now());
// console.log('UTC date: ', new Date(UTCNow));
// let easternDate = new Date(now.setHours(now.getHours() - 4)).getDate();
// console.log('Local date time in LA:', new Date(UTCNow).toLocaleString('en-US', { timeZone: convertToTimezon.lookup('90001') }));
// console.log('Local date time in Denver:', new Date(UTCNow).toLocaleString('en-US', { timeZone: convertToTimezon.lookup('80014') }));
// console.log('Local date time in Kansas:', new Date(UTCNow).toLocaleString('en-US', { timeZone: convertToTimezon.lookup('66101') }));
// console.log('Local date time in NY:', new Date(UTCNow).toLocaleString('en-US', { timeZone: convertToTimezon.lookup('10038') }));
// console.log('Local date time in Taipei:', new Date(UTCNow).toLocaleString('en-US', { timeZone: 'Asia/Taipei' }));
// console.log('Local date time in Tokyo:', new Date(UTCNow).toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
// console.log('2:', new Date(new Date(UTCNow).toLocaleString('en-US', { timeZone: convertToTimezon.lookup('90001') })).getDate());