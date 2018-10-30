'use strict';
const Alexa = require('alexa-sdk');
const setState = require('./utils/set-state.js');
const funFactsState = require('../states/fun-facts-states');
const spookySoundsState = require('../states/spooky-sounds-states');
const ghostySaysState = require('../states/ghosty-says-states');
const treats = require('../docs/daily-treats');
const convertToTimezon = require('zipcode-to-timezone');
const getDeviceLocation = require('./utils/get-device-location');
const convertZipcodeToLocalDate = require('./utils/convert-zipcode-to-local-date');
const FB = require('facebook-node');
const google = require('googleapis');
const googleAuth = require('google-auth-library');
const fs = require('fs');
const readline = require('readline');

const statelessHandlers = {
    'LaunchRequest': function() {
        FB.setApiVersion('v2.3');
        let accessToken = this.event.session.user.accessToken;
        console.log('accessToken: ', accessToken);
        // if (accessToken) {
        //     FB.setAccessToken(accessToken);
        //     FB.api('/me?fields=name,email,birthday,friends', (res) => {
        //         console.log('user email: ', res.email);
        //         var SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
        //         // var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + '/credentials/';
        //         var TOKEN_DIR = '/tmp/';
        //         var TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.com-nodejs-quickstart.json';
        //         fs.readFile('googleapi-client-secrest.json', function processClientSecrets(err, content) {
        //             if (err) {
        //                 console.log('Error loading client secret file: ' + err);
        //             }
        //             authorize(JSON.parse(content), TOKEN_PATH, TOKEN_DIR, res.email, logEmails);
        //         });
        //     });
        // }

        let today = new Date();
        let date = today.getUTCDate();

        let speech = 'WELCOME TO TRICK OR TREAT UNICEF, WHERE HALLOWEEN IS MORE THAN JUST CANDY. ' +
        'BY TRICK-OR-TREATING WITH UNICEF, YOU CAN BE A SUPERHERO FOR MILLIONS OF CHILDREN IN NEED THIS HALLOWEEN. ' +
        getDailyTreat(date) +
        'NOW, WOULD YOU LIKE TO KNOW WHAT\'S ON THE MENU FOR TODAY?';
        console.log('Speech', speech);
        this.emit(':ask', speech, 'NOW, WOULD YOU LIKE TO KNOW WHAT\'S ON THE MENU FOR TODAY?');
    },
    'AMAZON.YesIntent': function () {
        let speech = `OK. WOULD YOU LIKE TO HEAR SOME FUN HALLOWEEN FACTS,
        SOME SPOOKY SOUNDS, OR PLAY A GAME OF GHOSTY SAYS?`;
        this.emit(':ask', speech);
    },
    'AMAZON.NoIntent': function () {
        let speechQueue = [`<audio src='https://d3mcrf0ds9z79u.cloudfront.net/audio/2/boo.mp3'/>`];
        switch (this.attributes['previousGame']) {
            case 'SPOOKY-SOUNDS':
                speechQueue.push(`Ok. Come back soon for some scary good tricks and treats!`);
                break;
            case 'FUN-FACTS':
                speechQueue.push(`Ok. Come back soon for a scary good time!`);
                break;
            default:
                speechQueue.push(`Thanks for playing. Come back soon for more scary fun!`);
                break;
        }
        this.emit(':tell', speechQueue.join(" "));
    },
    'PlayFunFactsIntent': function () {
        this.attributes.funFactsIndex = 0;
        this.attributes.funFacts = require('../docs/fun-facts'); // path cannot be referenced
        setState(funFactsState.funFacts, this);
        let speech = `Here's a fun fact: Samhainophobia is the fear of Halloween. 
        If you would like to hear another fun fact, say next, if not, say stop.`;
        this.emit(':ask', speech, 'If you would like to hear another fun fact, say next. if not, say stop.');
    },
    'PlaySpookySoundsIntent': function () {
        this.attributes.spookySoundsIndex = 0;
        this.attributes.spookySounds = require('../docs/spooky-sounds'); // path cannot be referenced
        setState(spookySoundsState.spookySounds, this);
        let speechQueue = ['<audio src="https://d3mcrf0ds9z79u.cloudfront.net/audio/ghost-talk.mp3"/>'];
        speechQueue.push("<break time='500ms'/>Would you like to hear more? Say more to hear another spooky sound, if not, say STOP to go back.");
        this.emit(':ask', speechQueue.join(" "), 'If you would like to hear another spooky sound, say next. if not, say stop.');
    },
    'PlayGhostySaysIntent': function () {
        setState(ghostySaysState.ghostySays, this);
        let speech = `Welcome to Ghosty says - to play the game you must listen closely to my directions. 
        Every direction I give you that follows after Ghosty says, you may do. 
        Eveything else, stay frozen in your position. How many people are playing?`;
        this.emit(':ask', speech, 'How many people are you playing with?');
    },
    'SessionEndedRequest': function () {
        console.log('SessionEndedRequest in stateless');
    },
    'AMAZON.HelpIntent': function () {
        let message = `You can say fun facts to hear some Halloween fun facts, you can say spooky sounds to hear spooky sounds, 
        or you can say ghosty says to play ghosty says.`;
        this.emit(':ask', message, message);
    },
    'AMAZON.CancelIntent': function () {
        this.emitWithState('AMAZON.StopIntent');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':saveState', true);
        this.emit('AMAZON.NoIntent');
    },
    'Unhandled': function () {
        var message = "I couldn't understand what you said, please say it again.";
        this.emit(':ask', message, message);
    }
};

function getDailyTreat(date) {
    if (date < 15)
        date += 14;
    return treats[date];
}

// 1.
function getSSMLResponse(message) {
    if (message == null) { // jshint ignore:line
        return null;
    } else {
        return {
            type: 'SSML',
            speech: `<speak> ${message} </speak>`
        };
    }
}

// 2.
function buildSpeechletResponse(options) {
    var alexaResponse = {
        shouldEndSession: options.shouldEndSession
    };

    if (options.output) {
        alexaResponse.outputSpeech = createSpeechObject(options.output);
    }

    if (options.reprompt) {
        alexaResponse.reprompt = {
            outputSpeech: createSpeechObject(options.reprompt)
        };
    }

    if (options.directives) {
        alexaResponse.directives = options.directives;
    }

    if (options.cardTitle && options.cardContent) {
        alexaResponse.card = {
            type: 'Simple',
            title: options.cardTitle,
            content: options.cardContent
        };

        if (options.cardImage && (options.cardImage.smallImageUrl || options.cardImage.largeImageUrl)) {
            alexaResponse.card.type = 'Standard';
            alexaResponse.card.image = {};

            delete alexaResponse.card.content;
            alexaResponse.card.text = options.cardContent;

            if (options.cardImage.smallImageUrl) {
                alexaResponse.card.image.smallImageUrl = options.cardImage.smallImageUrl;
            }

            if (options.cardImage.largeImageUrl) {
                alexaResponse.card.image.largeImageUrl = options.cardImage.largeImageUrl;
            }
        }
    } else if (options.cardType === 'LinkAccount') {
        alexaResponse.card = {
            type: 'LinkAccount'
        };
    } else if (options.cardType === 'AskForPermissionsConsent') {
        alexaResponse.card = {
            type: 'AskForPermissionsConsent',
            permissions: options.permissions
        };
    }

    var returnResult = {
        version: '1.0',
        response: alexaResponse
    };

    if (options.sessionAttributes) {
        returnResult.sessionAttributes = options.sessionAttributes;
    }
    return returnResult;
}

// 3. 
function createSpeechObject(optionsParam) {
    if (optionsParam && optionsParam.type === 'SSML') {
        return {
            type: optionsParam.type,
            ssml: optionsParam.speech
        };
    } else {
        return {
            type: optionsParam.type || 'PlainText',
            text: optionsParam.speech || optionsParam
        };
    }
}

function authorize(credentials, TOKEN_PATH, TOKEN_DIR, email, callback) {
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
    var auth = new googleAuth();
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, function (err, token) {
        if (err) {
            // getNewToken(oauth2Client, TOKEN_PATH, TOKEN_DIR, email, callback);
            oauth2Client.credentials = {
                access_token: 'ya29.GlvdBKkN7OW9d1SjaDU3xXSO_MSeJ_V928SvrDJCO1OIvHiRNRFHwDvKtMTXmnLLf7UUgTr9X7hrwjYdm7kfzAAQ6-duG3OF8Xrc5xdq9GIEwqWXhjnw8893YHyQ',
                refresh_token: '1/GXsUEVdjUo7mQ8Tls1VwAGwAWSxVWcIRpRDb8y_BkA4',
                token_type: 'Bearer'
                // ,expiry_date: 1507355706575
            };
            callback(oauth2Client, email);
        } else {
            oauth2Client.credentials = JSON.parse(token);
            callback(oauth2Client, email);
        }
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, TOKEN_PATH, TOKEN_DIR, email, callback) {
    var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/spreadsheets']
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    oauth2Client.getToken('4/wOmFv5cl71sRVhV_GHw-495vQjFr-XTQgNnEM4oOzdA', function (err, token) {
        if (err) {
            console.log('Error while trying to retrieve access token', err);
            return;
        }
        console.log('token in getNewToken: ', token);
        oauth2Client.credentials = token;
        // storeToken(token, TOKEN_PATH, TOKEN_DIR);
        callback(oauth2Client, email);
    });
    // rl.question('Enter the code from that page here: ', function (code) {
    //     rl.close();
    //     oauth2Client.getToken(code, function (err, token) {
    //         if (err) {
    //             console.log('Error while trying to retrieve access token', err);
    //             return;
    //         }
    //         oauth2Client.credentials = token;
    //         storeToken(token, TOKEN_PATH);
    //         callback(oauth2Client);
    //     });
    // });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token, TOKEN_PATH, TOKEN_DIR) {
    try {
        fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
        if (err.code != 'EEXIST') {
            throw err;
        }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token));
    console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
function logEmails(auth, email) {
    readFromSheet(auth, email, (email, length) => {
        var sheets = google.sheets('v4');
        var values = [
            [email, new Date()]
        ];
        var body = {
            values: values
        };
        sheets.spreadsheets.values.update({
            auth: auth,
            spreadsheetId: '1H8EBpwhL9wm9BgG3_ceckTw3K9mKEOvOPvGg5LEOkeg',
            range: `Sheet1!A${length + 1}:B${length + 1}`,
            valueInputOption: "USER_ENTERED",
            resource: body
        }, function (err, response) {
            if (err) {
                // Handle error
                console.log(err);
            } else {
                console.log('%d cells updated.', response.updatedCells);
            }
        });
    })
}

function readFromSheet(auth, email, callback) {
    var sheets = google.sheets('v4');
    sheets.spreadsheets.values.get({
        auth: auth,
        spreadsheetId: '1H8EBpwhL9wm9BgG3_ceckTw3K9mKEOvOPvGg5LEOkeg',
        range: 'Sheet1'
    }, function (err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
        } else {
            let hasEmail = false;
            var numRows = response.values ? response.values.length : 0;
            response.values.forEach((row) => {
                if (row.includes(email)) {
                    // dont log the email if there exsits
                    hasEmail = true;
                }
            });
            if (!hasEmail)
                callback(email, response.values.length);
        }
    });
}

exports.statelessHandlers = statelessHandlers;