const {App} = require('jovo-framework');


const config = {
    logging: true,
    intentMap: {
        'AMAZON.YesIntent': 'YesIntent',
        'AMAZON.NoIntent': 'NoIntent',
        'AMAZON.CancelIntent': 'CancelIntent',
        'AMAZON.RepeatIntent': 'RepeatIntent',
        'AMAZON.HelpIntent': 'HelpIntent',
        'AMAZON.FallbackIntent': 'NoMatch',
    },
    // db: {
    //     type: 'file',
    //     localDbFilename: 'db',
    // },
    db: {
        type: 'dynamodb',
        tableName: 'VotewithVoice-UserData',
        awsConfig: {
            region: 'us-east-1',
            // Don't need these as long as you have ~/.aws/credentials setup, or AWS_* setup in ENV:
            // accessKeyId: 'yourAccessKeyId',
            // secretAccessKey: 'yourSecretAccessKey',
        }
    },
};

const app = new App(config);


// =================================================================================
// App Logic
// =================================================================================

app.setHandler({
    'LAUNCH': function() {
        this.ask(`Welcome to ${VotewithVoice}!` +
                    ` To get started, ask me about a federal or state election in your ` +
                    ` area, for example: who's running for governor in New York?` +
                    `  `);
    },
  })

  module.exports.app = app;
