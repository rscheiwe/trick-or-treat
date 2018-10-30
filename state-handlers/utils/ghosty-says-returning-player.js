const ghostySaysStates = require('../../states/ghosty-says-states');
const setState = require('./set-state');
const setIntent = require('./set-intent.js');

/**
 * unlike Kid Power says using state, this game use INTENT to store the progress
 */
function ghostySaysReturningPlayer(that) {
    let intent = that.attributes['intent'];
    let stateBeforeStop = that.attributes['stateBeforeStop'];
    let progress = '';
    let state = undefined;
    let nextIntent = undefined;
    console.log('intent in ghostySaysReturningPlayer', intent);
    switch (intent) {
        case 'PlayJumpOverPumpkinsIntent':
            state = ghostySaysStates.playScreamAway;
            nextIntent = 'PlayScreamAwayIntent';
            progress = `You were playing level one of ghosty says, do you want to keep playing?`;
            break;
        case 'PlayScreamAwayIntent':
            state = ghostySaysStates.playJumpingJackAndGoToLevel2;
            progress = `You were playing level one of ghosty says, do you want to keep playing?`;
            nextIntent = 'PlayJumpingJackIntent';
            break;
        case 'PlayJumpingJackIntent':
            state = ghostySaysStates.playLevelTwo;
            progress = `You were playing level one of ghosty says, do you want to keep playing?`;
            nextIntent = 'PlayLevelTwoIntent';
            break;
        case 'PlayLevelTwoIntent':
            state = ghostySaysStates.playHopOnOneLeg;
            progress = `You were playing level two of ghosty says, do you want to keep playing?`;
            nextIntent = 'PlayHopOnOneLegIntent';
            break;
        case 'PlayHopOnOneLegIntent':
            state = ghostySaysStates.playSayingTrickOrTreat;
            progress = `You were playing level two of ghosty says, do you want to keep playing?`;
            nextIntent = 'PlaySayingTrickOrTreatIntent';
            break;
        case 'PlaySayingTrickOrTreatIntent':
            setState(undefined, that);
            that.emit('LaunchRequest');
            break;
        default:
            break;
    }
    setIntent(nextIntent, that);
    setState(state, that);
    let speech = `WELCOME BACK TO TRICK OR TREAT UNICEF, WHERE HALLOWEEN IS MORE THAN JUST CANDY. ${progress}
    You can say continue playing to continue or say start over to hear some Halloween fun facts or spooky sounds.`;
    that.emit(':ask', speech);
}

module.exports = ghostySaysReturningPlayer;