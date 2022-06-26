const Joi = require("joi");
const checkers = require("./checkers");

const schema = {};

schema.createPoll = Joi.object({
  title: checkers.title,
  description: checkers.description,
  expiration: checkers.expiration,
});

module.exports = schema;
