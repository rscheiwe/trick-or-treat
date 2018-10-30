/**
 * make sure Alexa SDK save the state in DynamoDB
 */
module.exports = function (state, that) {
    that.attributes['state'] = state;
    that.attributes['STATE'] = state;
    that.handler.state = state;
    that.emit(':saveState', true);
};