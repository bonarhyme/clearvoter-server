const Joi = require("joi");
const checkers = require("./checkers");

const schema = {};

schema.createPoll = Joi.object({
  title: checkers.title,
  description: checkers.description,
  expiration: checkers.expiration,
});

schema.addParty = Joi.object({
  name: checkers.partyName,
  description: checkers.description,
});

schema.addLocation = Joi.object({
  location: checkers.targetLocation,
});

module.exports = schema;
