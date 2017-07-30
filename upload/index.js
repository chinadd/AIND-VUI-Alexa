'use strict';
var Alexa = require('alexa-sdk');
var APP_ID = undefined;  // can be replaced with your app ID if publishing
var facts = require('./facts');
var GET_FACT_MSG_EN = [
    "Here's your fact: "
    ,"This is your fact:"
    ,"You know what?"
    ,"How about this?"
    ,"Do you know this?"
]
var GET_REPROMPT_MESSAGE = [
    "Actually I have somthing more to share"
    ,"Feel free to ask me more"
    ,"I will be there in case you have more to ask"
]
// Test hooks - do not remove!
exports.GetFactMsg = GET_FACT_MSG_EN;
var APP_ID_TEST = "mochatest";  // used for mocha tests to prevent warning

// end Test hooks
/*
    TODO (Part 2) add messages needed for the additional intent
    TODO (Part 3) add reprompt messages as needed
*/
var languageStrings = {
    "en": {
        "translation": {
            "FACTS": facts.FACTS_EN,
            "SKILL_NAME": "My History Facts",  // OPTIONAL change this to a more descriptive name
            "GET_FACT_MESSAGE": GET_FACT_MSG_EN,
            "GET_REPROMPT_MESSAGE": GET_REPROMPT_MESSAGE,
            "HELP_MESSAGE": "You can say tell me a fact, or, you can say exit... What can I help you with?",
            "HELP_REPROMPT": "What can I help you with?",
            "STOP_MESSAGE": "Goodbye!"
        }
    }
};

exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // set a test appId if running the mocha local tests
    if (event.session.application.applicationId == "mochatest") {
        alexa.appId = APP_ID_TEST
    }
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

/*
    TODO (Part 2) add an intent for specifying a fact by year named 'GetNewYearFactIntent'
    TODO (Part 2) provide a function for the new intent named 'GetYearFact'
        that emits a randomized fact that includes the year requested by the user
        - if such a fact is not available, tell the user this and provide an alternative fact.
    TODO (Part 3) Keep the session open by providing the fact with :askWithCard instead of :tellWithCard
        - make sure the user knows that they need to respond
        - provide a reprompt that lets the user know how they can respond
    TODO (Part 3) Provide a randomized response for the GET_FACT_MESSAGE
        - add message to the array GET_FACT_MSG_EN
        - randomize this starting portion of the response for conversational variety
*/

var handlers = {
    'LaunchRequest': function () {
        this.emit('GetFact');
    },
    'GetNewFactIntent': function () {
        this.emit('GetFact');
    },
    'GetFact': function () {
        // Get a random fact from the facts list
        // Use this.t() to get corresponding language data
        var factArr = this.t('FACTS');
        var randomFact = randomPhrase(factArr);

        // Create speech output
        var speechOutput = randomPhrase(this.t("GET_FACT_MESSAGE")) + randomFact;
        var repromptSpeech = randomPhrase(this.t("GET_REPROMPT_MESSAGE"))
        this.emit(':askWithCard', speechOutput, repromptSpeech, this.t("SKILL_NAME"), randomFact)
    },
    'GetNewYearFactIntent': function () {
        //TODO your code here
        var validAnswer = Year_with_fact(this.event.request.intent);
        if (validAnswer) {
          var year_selected = parseInt(this.event.request.intent.slots.FACT_YEAR.value);
          var year_list = [];
          year_list[1950] = 0;
          year_list[1951] = 1
          year_list[1956] = 2;
          year_list[1961] = 3;
          year_list[1963] = 4;
          year_list[1965] = 5;
          year_list[1967] = 6;
          year_list[1969] = 7;
          year_list[1972] = 8;
          year_list[1974] = 9;
          year_list[1979] = 10;
          year_list[1980] = 11;        
          year_list[1997] = 12;
          year_list[2005] = 13;
          year_list[2016] = 14;

          if (typeof(year_selected) === 'undefined') {
            this.emit('GetFact');//offer a random fact
          }
          else {
          var randomGetFactMessage = randomPhrase(this.t("GET_FACT_MESSAGE"));
          var response = this.t("FACTS");
          var fact = response[year_list[year_selected]];

          var speechOutput = randomPhrase(this.t("GET_FACT_MESSAGE")) + fact;
          var repromptSpeech = randomPhrase(this.t("GET_REPROMPT_MESSAGE"))

          this.emit(':askWithCard', speechOutput, repromptSpeech, this.t("SKILL_NAME"), fact)
        }
      } else {
        this.emit('GetFact');
      }
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = this.t("HELP_MESSAGE");
        var reprompt = this.t("HELP_MESSAGE");
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    }
};

function randomPhrase(phraseArr) {
    // returns a random phrase
    // where phraseArr is an array of string phrases
    var i = 0;
    i = Math.floor(Math.random() * phraseArr.length);
    return (phraseArr[i]);
};

function Year_with_fact(intent) {
  var Year_slot_filled = intent && intent.slots && intent.slots.FACT_YEAR && intent.slots.FACT_YEAR.value;
  var Year_valid = Year_slot_filled && !isNaN(parseInt(intent.slots.FACT_YEAR.value));
  return Year_valid;
}
