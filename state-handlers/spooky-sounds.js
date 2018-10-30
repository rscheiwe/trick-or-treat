'use strict';
const Alexa = require('alexa-sdk');
const setState = require('./utils/set-state.js');
const setIntent = require('./utils/set-intent.js');
const spookySoundsState = require('../states/spooky-sounds-states');

var spookySoundsStateHandler = Alexa.CreateStateHandler(spookySoundsState.spookySounds, {
    'LaunchRequest': function () {
        setState(undefined, this);
        this.emit('LaunchRequest');
    },
    'PlayFunFactsIntent': function () {
        setState(undefined, this);
        this.emit('PlayFunFactsIntent');
    },
    'PlaySpookySoundsIntent': function () {
        setState(undefined, this);
        this.emit('PlaySpookySoundsIntent');
    },
    'PlayGhostySaysIntent': function () {
        setState(undefined, this);
        this.emit('PlayGhostySaysIntent');
    },
    'AMAZON.YesIntent': function () {
        this.emitWithState('MoreIntent');
    },
    'MoreIntent': function () {
        let speechQueue = [this.attributes.spookySounds[this.attributes.spookySoundsIndex % this.attributes.spookySounds.length]];
        speechQueue.push(`<break time='500ms'/>If you would like to hear another spooky sound, say next.`);
        this.attributes.spookySoundsIndex++;
        this.emit(':ask', speechQueue.join(" "), 'say next to hear more spooky sounds, or say stop to take a break.');
    },
    'AMAZON.NoIntent': function () {
        this.emitWithState('AMAZON.StopIntent');
    },
    'AMAZON.StopIntent': function () {
        this.attributes['previousGame'] = 'SPOOKY-SOUNDS';
        let speech = `Now, would you like to hear some Halloween fun facts or play Ghosty Says?`;
        setState(undefined, this);
        this.emit(':ask', speech, 'Would you like to hear some Halloween fun facts, or play Ghosty Says?');
    },
    'PlayFunFactsIntent': function () {
        setState(undefined, this);
        this.emit('PlayFunFactsIntent');
    },
    'PlayGhostySaysIntent': function () {
        setState(undefined, this);
        this.emit('PlayGhostySaysIntent');
    },
    'Unhandled': function () {
        var message = "I couldn't understand what you said, please say it again.";
        this.emit(':ask', message, message);
    },
    'SessionEndedRequest': function () {
        console.log('SessionEndedRequest in spookySoundsStateHandler');
    }
});

exports.spookySoundsStateHandler = spookySoundsStateHandler;