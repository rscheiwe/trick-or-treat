'use strict';
const Alexa = require('alexa-sdk'); // import the library
const request = require('request-promise');
const stateless = require('./state-handlers/stateless');
const funFacts = require('./state-handlers/fun-facts');
const spookySounds = require('./state-handlers/spooky-sounds');
const ghostySays = require('./state-handlers/ghosty-says');
const APP_ID = 'amzn1.ask.skill.4cfe6b70-0ddf-4f56-9567-ff140c7066c1';

const messageMetadata = {
  'account_id': '',
  'platform': 'AMZN',
  'message_type': 'incoming',
};

const dmpConfig = {
  'mode': process.env.dmp_mode || 'sandbox',
  'client_id': process.env.client_id,
  'client_secret': process.env.client_secret
};

const dmp = require('dmp_external_sdk')(messageMetadata, dmpConfig).alexa;




exports.handler = dmp.handler(function (event, context, callback) {
    const AWS = require('aws-sdk');
    AWS.config.region = 'us-east-1';
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.dynamoDBTableName = '2017_Alexa_Trick_Or_Treat_For_Unicef';
    alexa.registerHandlers(
        stateless.statelessHandlers, funFacts.funFactsStateHandler,
        spookySounds.spookySoundsStateHandler,
        ghostySays.ghostySaysStateHandler, ghostySays.confirmGoAgainStateHandler, ghostySays.askIfPlayOtherGamesStateHandler,
        ghostySays.playScreamAwayStateHandler, ghostySays.playJumpingJackAndGoToLevel2StateHandler, ghostySays.playLevelTwoStateHandler,
        ghostySays.playHopOnOneLegStateHandler, ghostySays.playSayingTrickOrTreatStateHandler
    );
    alexa.execute();
});