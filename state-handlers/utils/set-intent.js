/**
 * save intent handler in DynamoDB
 */
module.exports = function (intent, that) {
    that.attributes['intent'] = intent;
    that.emit(':saveState', true);
};