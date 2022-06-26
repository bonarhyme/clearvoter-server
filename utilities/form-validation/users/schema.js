const Joi = require("joi");
const checkers = require("./checkers");

const schema = {};

schema.register = Joi.object({
  email: checkers.email,
  username: checkers.username,
  password: checkers.password,
});

module.exports = schema;
