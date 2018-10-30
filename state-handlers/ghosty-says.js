'use strict';
const Alexa = require('alexa-sdk');
const setState = require('./utils/set-state.js');
const setIntent = require('./utils/set-intent.js');
const ghostySaysState = require('../states/ghosty-says-states');
const ghostySaysReturningPlayer = require('./utils/ghosty-says-returning-player');

var ghostySaysStateHandler = Alexa.CreateStateHandler(ghostySaysState.ghostySays, {
    'LaunchRequest': function () {
        ghostySaysReturningPlayer(this);
    },
    'HowManyPeopleOnlyIntent': function () {
        this.emitWithState('HowManyPeopleIntent');
    },
    'HowManyPeopleIntent': function () {
        let speechQueue = ["Great, let's get started, good luck!"];
        this.emitWithState('PlayJumpOverPumpkinsIntent', speechQueue);
    },
    'PlayJumpOverPumpkinsIntent': function (speechQueue) {
        setIntent('PlayJumpOverPumpkinsIntent', this);
        if (!speechQueue) speechQueue = [];
        speechQueue.push("Let's start off easy. Ghosty says jump in place to jump over pumpkins!");
        speechQueue.push(`<audio src="https://d3mcrf0ds9z79u.cloudfront.net/audio/3/3.mp3"/>`);
        speechQueue.push("Ghosty says stop jumping. You've got the hang of it now! Let's step it up a notch.<break time='1s'/>");
        speechQueue.push("Ghosty says stomp on the ground to stop spiders!");
        speechQueue.push(`<audio src="https://d3mcrf0ds9z79u.cloudfront.net/audio/15.mp3"/>`);
        speechQueue.push("Hold your breath so the Ghost doesn't know you are there.");
        speechQueue.push(`<audio src="https://d3mcrf0ds9z79u.cloudfront.net/audio/9.mp3"/>`);
        speechQueue.push("<break time='2s'/>Did I get you?");

        this.emit(':ask', speechQueue.join(" "), 'Did I get you?');
    },
    'AMAZON.YesIntent': function () {
        this.emitWithState('AMAZON.NoIntent');
    },
    'AMAZON.NoIntent': function () {
        setState(ghostySaysState.confirmGoAgain, this);
        this.emit(':ask', 'Ha ha. Ok. Ready to go again?', 'Ready to go again?');
    },
    'AMAZON.ResumeIntent': function () {
        this.emitWithState(this.attributes['intent']);
    },
    'AMAZON.StartOverIntent': function () {
        setState(undefined, this); // back to default state
        this.emit('AMAZON.YesIntent');
    },
    'AMAZON.StopIntent': function () {
        let speech = `Ok, would you like to hear Halloween fun facts or some spooky sounds?`;
        setState(ghostySaysState.askIfPlayOtherGames, this);
        this.emit(':ask', speech, 'Would you like to to hear Halloween fun facts or some spooky sounds?');
    },
    'AMAZON.HelpIntent': function () {
        let speech = `Did I get you? You can say yes or no to indicate if you got caught.`;
        this.emit(':ask', speech, speech);
    },
    'Unhandled': function () {
        var message = "I couldn't understand what you said, please say it again.";
        this.emit(':ask', message, message);
    }
});

var playScreamAwayStateHandler = Alexa.CreateStateHandler(ghostySaysState.playScreamAway, {
    'LaunchRequest': function () {
        ghostySaysReturningPlayer(this);
    },
    'PlayScreamAwayIntent': function () {
        setIntent('PlayScreamAwayIntent', this);
        let speechQueue = ["Ghosty says scream so you scare away the vampires!"];
        speechQueue.push("<audio src='https://d3mcrf0ds9z79u.cloudfront.net/audio/10.mp3'/>");
        speechQueue.push("Ghosty says put your arms in front of you and walk like a mummy!");
        speechQueue.push("<audio src='https://d3mcrf0ds9z79u.cloudfront.net/audio/14.mp3'/>");
        speechQueue.push("Ghosty says howl so werewolves don't come near you!");
        speechQueue.push("<audio src='https://d3mcrf0ds9z79u.cloudfront.net/audio/17.mp3'/>");
        speechQueue.push("Rub your tummy from all the candy!");
        speechQueue.push("<audio src='https://d3mcrf0ds9z79u.cloudfront.net/audio/6.mp3'/>");
        speechQueue.push("<break time='1500ms'/>Did I get you?");

        this.emit(':ask', speechQueue.join(" "), 'Did I get you?');
    },
    'AMAZON.YesIntent': function () {
        this.emitWithState('AMAZON.NoIntent');
    },
    'AMAZON.NoIntent': function () {
        setState(ghostySaysState.confirmGoAgain, this);
        this.emit(':ask', 'Ha ha. Ok. Ready to go again?', 'Ready to go again?');
    },
    'AMAZON.ResumeIntent': function () {
        this.emitWithState(this.attributes['intent']);
    },
    'AMAZON.StartOverIntent': function () {
        setState(undefined, this); // back to default state
        this.emit('AMAZON.YesIntent');
    },
    'AMAZON.StopIntent': function () {
        let speech = `Ok, would you like to hear Halloween fun facts or some spooky sounds?`;
        setState(ghostySaysState.askIfPlayOtherGames, this);
        this.emit(':ask', speech, 'Would you like to hear Halloween fun facts or some spooky sounds?');
    },
    'AMAZON.HelpIntent': function () {
        let speech = `Did I get you? You can say yes or no to indicate if you got caught.`;
        this.emit(':ask', speech, speech);
    },
    'Unhandled': function () {
        var message = "I couldn't understand what you said, You can say yes if you got caught or no if you didn't.";
        this.emit(':ask', message, message);
    }
});

var playJumpingJackAndGoToLevel2StateHandler = Alexa.CreateStateHandler(ghostySaysState.playJumpingJackAndGoToLevel2, {
    'LaunchRequest': function () {
        ghostySaysReturningPlayer(this);
    },
    'PlayJumpingJackIntent': function () {
        setIntent('PlayJumpingJackIntent', this);
        let speechQueue = ["Ghosty says do jumping jack-o-lanterns!"];
        speechQueue.push("<audio src='https://d3mcrf0ds9z79u.cloudfront.net/audio/3/1.mp3'/>");
        speechQueue.push("Ghosty says freeze like a scarecrow!");
        speechQueue.push("<audio src='https://d3mcrf0ds9z79u.cloudfront.net/audio/4.mp3'/>");
        speechQueue.push(`<break time='1500ms'/>Congrats! You have finished Ghosty says Level 1! Would you like to play
        Level 2 or are you too scared? Say "Level 2" to move on or say stop to take a break.`);

        this.emit(':ask', speechQueue.join(" "), 'You can say "Level 2" to move on or say stop to take a break.');
    },
    'LevelTwoIntent': function () {
        setState(ghostySaysState.playLevelTwo, this);
        this.emit(':ask', 'How many people are left?');
    },
    'AMAZON.ResumeIntent': function () {
        this.emitWithState(this.attributes['intent']);
    },
    'AMAZON.NoIntent': function () {
        this.emitWithState('AMAZON.StopIntent');
    },
    'AMAZON.StopIntent': function () {
        let speech = `Ok, would you like to hear Halloween fun facts or some spooky sounds?`;
        setState(ghostySaysState.askIfPlayOtherGames, this);
        this.emit(':ask', speech, 'Would you like to to hear Halloween fun facts or some spooky sounds?');
    },
    'AMAZON.StartOverIntent': function () {
        setState(undefined, this); // back to default state
        this.emit('AMAZON.YesIntent');
    },
    'AMAZON.HelpIntent': function () {
        let speech = `You can say Level two to play the next level of Ghosty Says, or you can say stop to take a break.`;
        this.emit(':ask', speech, speech);
    },
    'Unhandled': function () {
        var message = `I couldn't understand what you said, you can say Level two to play the next level of Ghosty Says, 
        or you can say stop to take a break.`;
        this.emit(':ask', message, message);
    }
});

var playLevelTwoStateHandler = Alexa.CreateStateHandler(ghostySaysState.playLevelTwo, {
    'LaunchRequest': function () {
        ghostySaysReturningPlayer(this);
    },
    'HowManyPeopleOnlyIntent': function () {
        this.emitWithState('HowManyPeopleIntent');
    },
    'HowManyPeopleIntent': function () {
        this.emitWithState('PlayLevelTwoIntent');
    },
    'PlayLevelTwoIntent': function () {
        setIntent('PlayLevelTwoIntent', this);
        let speechQueue = ["Ghosty says run in place to get away from zombies!"];
        speechQueue.push("<audio src='https://d3mcrf0ds9z79u.cloudfront.net/audio/2.mp3'/>");
        speechQueue.push("Ghosty says tip-toe away from the black cat!");
        speechQueue.push("<audio src='https://d3mcrf0ds9z79u.cloudfront.net/audio/5.mp3'/>");
        speechQueue.push(`Ghosty says, stomp on the ground to stop spiders!`);
        speechQueue.push("<audio src='https://d3mcrf0ds9z79u.cloudfront.net/audio/15.mp3'/>");
        speechQueue.push(`Cover your eyes so the spirit can't look into your soul!`);
        speechQueue.push("<audio src='https://d3mcrf0ds9z79u.cloudfront.net/audio/8.mp3'/>");
        speechQueue.push("<break time='1500ms'/>Did I get you?");

        this.emit(':ask', speechQueue.join(" "), 'Did I get you?');
    },
    'AMAZON.ResumeIntent': function () {
        this.emitWithState(this.attributes['intent']);
    },
    'AMAZON.YesIntent': function () {
        this.emitWithState('AMAZON.NoIntent');
    },
    'AMAZON.NoIntent': function () {
        setState(ghostySaysState.confirmGoAgain, this);
        this.emit(':ask', 'Ha ha. Ok. Ready to go again?', 'Ready to go again?');
    },
    'AMAZON.StopIntent': function () {
        let speech = `Ok, would you like to hear Halloween fun facts or some spooky sounds?`;
        setState(ghostySaysState.askIfPlayOtherGames, this);
        this.emit(':ask', speech, 'Would you like to hear Halloween fun facts or some spooky sounds?');
    },
    'AMAZON.StartOverIntent': function () {
        setState(undefined, this);
        this.emit('AMAZON.YesIntent');
    },
    'AMAZON.HelpIntent': function () {
        let speech = `Did I get you? You can say yes or no to indicate if you got caught.`;
        this.emit(':ask', speech, speech);
    },
    'Unhandled': function () {
        var message = `I couldn't understand what you said, You can say yes if you got caught or no if you didn't.`;
        this.emit(':ask', message, message);
    }
});

var playHopOnOneLegStateHandler = Alexa.CreateStateHandler(ghostySaysState.playHopOnOneLeg, {
    'LaunchRequest': function () {
        ghostySaysReturningPlayer(this);
    },
    'PlayHopOnOneLegIntent': function () {
        setIntent('PlayHopOnOneLegIntent', this);
        let speechQueue = ["Ghosty says hop on one leg so you don't trip on your cape!"];
        speechQueue.push("<audio src='https://d3mcrf0ds9z79u.cloudfront.net/audio/11.mp3'/>");
        speechQueue.push("Ghosty says put up your arms and roar so you scare away monsters!");
        speechQueue.push("<audio src='https://d3mcrf0ds9z79u.cloudfront.net/audio/12.mp3'/>");
        speechQueue.push(`Ghosty says make a funny face so people think you're wearing a mask!`);
        speechQueue.push("<audio src='https://d3mcrf0ds9z79u.cloudfront.net/audio/16.mp3'/>");
        speechQueue.push(` Touch your toes so witches can fly above you!`);
        speechQueue.push("<audio src='https://d3mcrf0ds9z79u.cloudfront.net/audio/7.mp3'/>");
        speechQueue.push("<break time='1500ms'/>Did I get you?");

        this.emit(':ask', speechQueue.join(" "), 'Did I get you?');
    },
    'AMAZON.ResumeIntent': function () {
        this.emitWithState(this.attributes['intent']);
    },
    'AMAZON.YesIntent': function () {
        this.emitWithState('AMAZON.NoIntent');
    },
    'AMAZON.NoIntent': function () {
        setState(ghostySaysState.confirmGoAgain, this);
        this.emit(':ask', 'Ha ha. Ok. Ready to go again?', 'Ready to go again?');
    },
    'AMAZON.StopIntent': function () {
        let speech = `Ok, would you like to hear Halloween fun facts or some spooky sounds?`;
        setState(ghostySaysState.askIfPlayOtherGames, this);
        this.emit(':ask', speech, 'Would you like to hear some spooky sounds, or play Ghosty Sounds?');
    },
    'AMAZON.StartOverIntent': function () {
        setState(undefined, this);
        this.emit('AMAZON.YesIntent');
    },
    'AMAZON.HelpIntent': function () {
        let speech = `Did I get you? You can say yes or no to indicate if you got caught.`;
        this.emit(':ask', speech, speech);
    },
    'Unhandled': function () {
        var message = `I couldn't understand what you said, You can say yes if you got caught or no if you didn't.`;
        this.emit(':ask', message, message);
    }
});

var playSayingTrickOrTreatStateHandler = Alexa.CreateStateHandler(ghostySaysState.playSayingTrickOrTreat, {
    'LaunchRequest': function () {
        ghostySaysReturningPlayer(this);
    },
    'PlaySayingTrickOrTreatIntent': function () {
        setIntent('PlaySayingTrickOrTreatIntent', this);
        let speechQueue = ["Ghosty says practice saying Trick-or-Treat for Halloween!"];
        speechQueue.push("<audio src='https://d3mcrf0ds9z79u.cloudfront.net/audio/3/19.mp3'/>");
        speechQueue.push("Ghosty says tilt your head back so you can drink the magic portion!");
        speechQueue.push("<audio src='https://d3mcrf0ds9z79u.cloudfront.net/audio/20.mp3'/>");
        speechQueue.push(`Ghosty says lay down like you are in a grave so zombies think that you are dead and don't attack you!`);
        speechQueue.push("<audio src='https://d3mcrf0ds9z79u.cloudfront.net/audio/13.mp3'/>");
        speechQueue.push(`<break time='1s'/>Congratulations! You have finished level two! You are quite the competitive monster!
        Now, would you like to hear some Haloween fun facts or spooky sounds?`);

        setState(undefined, this);
        this.emit(':ask', speechQueue.join(" "), 'Would you like to hear some Haloween fun facts or spooky sounds?');
    },
    'AMAZON.ResumeIntent': function () {
        this.emitWithState(this.attributes['intent']);
    },
    // 'AMAZON.YesIntent': function () {
    //     this.emit(':ask', 'Ok, would you like to hear Halloween fun facts or spooky sounds?');
    // },
    // 'PlayFunFactsIntent': function () {
    //     setState(undefined, this);
    //     this.emit('PlayFunFactsIntent');
    // },
    // 'PlaySpookySoundsIntent': function () {
    //     setState(undefined, this);
    //     this.emit('PlaySpookySoundsIntent');
    // },
    'AMAZON.StopIntent': function () {
        // this.emitWithState('AMAZON.NoIntent');
        let speechQueue = ['Thanks for playing Spooky says! Come back soon and play some more games!'];
        speechQueue.push(`<audio src='https://d3mcrf0ds9z79u.cloudfront.net/audio/witch-laugh.mp3'/>`);
        this.emit(':tell', speechQueue.join(" "));
    },
    // 'AMAZON.NoIntent': function () {
    //     let speechQueue = ['Thanks for playing Spooky says! Come back soon and play some more games!'];
    //     speechQueue.push(`<audio src='https://d3mcrf0ds9z79u.cloudfront.net/audio/witch-laugh.mp3'/>`);
    //     this.emit(':tell', speechQueue.join(" "));
    // },
    'AMAZON.StartOverIntent': function () {
        setState(undefined, this);
        this.emit('AMAZON.YesIntent');
    },
    'AMAZON.HelpIntent': function () {
        let speech = `You can say fun facts to hear more Halloween fun facts or say spooky sounds to hear more spooky sounds.
        Or you can say stop to take a break.`;
        this.emit(':ask', speech, speech);
    },
    'Unhandled': function () {
        var message = `I couldn't understand what you said, You can say fun facts to hear more Halloween fun facts 
        , say spooky sounds to hear more spooky sounds. Or you can say stop to take a break.`;
        this.emit(':ask', message, message);
    }
});

var confirmGoAgainStateHandler = Alexa.CreateStateHandler(ghostySaysState.confirmGoAgain, {
    'LaunchRequest': function () {
        ghostySaysReturningPlayer(this);
    },
    'AMAZON.YesIntent': function () {
        switch (this.attributes.intent) {
            case 'PlayJumpOverPumpkinsIntent':
                setState(ghostySaysState.playScreamAway, this);
                this.emitWithState('PlayScreamAwayIntent');
                break;
            case 'PlayScreamAwayIntent':
                setState(ghostySaysState.playJumpingJackAndGoToLevel2, this);
                this.emitWithState('PlayJumpingJackIntent');
                break;
            case 'PlayLevelTwoIntent':
                setState(ghostySaysState.playHopOnOneLeg, this);
                this.emitWithState('PlayHopOnOneLegIntent');
                break;
            case 'PlayHopOnOneLegIntent':
                setState(ghostySaysState.playSayingTrickOrTreat, this);
                this.emitWithState('PlaySayingTrickOrTreatIntent');
                break;
        }
    },
    'AMAZON.StopIntent': function () {
        this.emitWithState('AMAZON.NoIntent');
    },
    'AMAZON.NoIntent': function () {
        setState(ghostySaysState.askIfPlayOtherGames, this);
        let speech = `Ok, would you like to hear Halloween fun facts or some spooky sounds?`;
        this.emit(':ask', speech, 'Would you like to hear some Halloween fun facts or listen to some spooky sounds?');
    },
    'AMAZON.ResumeIntent': function () {
        this.emitWithState(this.attributes['intent']);
    },
    'AMAZON.StartOverIntent': function () {
        setState(undefined, this);
        this.emit('AMAZON.YesIntent');
    },
    'AMAZON.HelpIntent': function () {
        let speech = `You can say yes to continue playing or say no to choose something else.`;
        this.emit(':ask', speech, speech);
    },
    'Unhandled': function () {
        var message = "I couldn't understand what you said, You can say yes if you got caught or no if you didn't.";
        this.emit(':ask', message, message);
    }
});

var askIfPlayOtherGamesStateHandler = Alexa.CreateStateHandler(ghostySaysState.askIfPlayOtherGames, {
    'LaunchRequest': function () {
        console.log('LaunchRequest in askIfPlayOtherGamesStateHandler');
        ghostySaysReturningPlayer(this);
    },
    'AMAZON.YesIntent': function () {
        this.emit(':ask', 'Ok, would you like to hear Halloween fun facts or spooky sounds?');
    },
    'PlayGhostySaysIntent': function () {
        console.log('PlayGhostySaysIntent in askIfPlayOtherGamesStateHandler');
        this.emitWithState('LaunchRequest');
    },
    'PlayFunFactsIntent': function () {
        setState(undefined, this);
        this.emit('PlayFunFactsIntent');
    },
    'PlaySpookySoundsIntent': function () {
        setState(undefined, this);
        this.emit('PlaySpookySoundsIntent');
    },
    'AMAZON.StopIntent': function () {
        this.emitWithState('AMAZON.NoIntent');
    },
    'AMAZON.NoIntent': function () {
        let speechQueue = ['Thanks for playing. Come back soon for more scary fun!'];
        speechQueue.push(`<audio src='https://d3mcrf0ds9z79u.cloudfront.net/audio/witch-laugh.mp3'/>`);
        this.emit(':tell', speechQueue.join(" "));
    },
    // 'AMAZON.ResumeIntent': function () {
    //     this.emitWithState(this.attributes['intent']);
    // },
    'AMAZON.StartOverIntent': function () {
        setState(undefined, this); // back to default state
        this.emit('AMAZON.YesIntent');
    },
    'AMAZON.HelpIntent': function () {
        let speech = `You can say Halloween fun facts to hear Halloween fun facts 
        or say spooky sounds to hear some spooky sounds.`;
        this.emit(':ask', speech, speech);
    },
    'Unhandled': function () {
        var message = "I couldn't understand what you said, please say it again.";
        console.log('Unhandled in askIfPlayOtherGamesStateHandler');
        this.emit(':ask', message, message);
    }
});

exports.ghostySaysStateHandler = ghostySaysStateHandler;
exports.playScreamAwayStateHandler = playScreamAwayStateHandler;
exports.confirmGoAgainStateHandler = confirmGoAgainStateHandler;
exports.askIfPlayOtherGamesStateHandler = askIfPlayOtherGamesStateHandler;
exports.playJumpingJackAndGoToLevel2StateHandler = playJumpingJackAndGoToLevel2StateHandler;
exports.playLevelTwoStateHandler = playLevelTwoStateHandler;
exports.playHopOnOneLegStateHandler = playHopOnOneLegStateHandler;
exports.playSayingTrickOrTreatStateHandler = playSayingTrickOrTreatStateHandler;