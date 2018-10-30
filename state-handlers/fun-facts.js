'use strict';
const Alexa = require('alexa-sdk');
const setState = require('./utils/set-state.js');
const setIntent = require('./utils/set-intent.js');
const funFactsState = require('../states/fun-facts-states');

var funFactsStateHandler = Alexa.CreateStateHandler(funFactsState.funFacts, {
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
        let speechQueue = [this.attributes.funFacts[this.attributes.funFactsIndex % this.attributes.funFacts.length]];
        this.attributes.funFactsIndex++;
        // let dailyTreats = require('../docs/daily-treats');
        // if (!this.attributes.day || this.attributes.day > 31)
        //     this.attributes.day = 15;
        // let speechQueue = [dailyTreats[this.attributes.day]];
        // this.attributes.day++;
        speechQueue.push(`<break time='500ms'/>If you would like to hear another fun fact, say next.`);
        this.emit(':ask', speechQueue.join(" "), 'say next to hear more fun facts, or say stop to take a break.');
    },
    'AMAZON.NoIntent': function () {
        this.emitWithState('AMAZON.StopIntent');
    },
    'AMAZON.StopIntent': function () {
        this.attributes['previousGame'] = 'FUN-FACTS';
        let speech = `Ok, would you like to hear some spooky sounds, or play Ghosty Says?`;
        setState(undefined, this);
        this.emit(':ask', speech, 'Would you like to hear some spooky sounds, or play Ghosty Says?');
    },
    'PlaySpookySoundsIntent': function () {
        setState(undefined, this);
        this.emit('PlaySpookySoundsIntent');
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
        console.log('SessionEndedRequest in funFactsStateHandler');
    }
});

exports.funFactsStateHandler = funFactsStateHandler;