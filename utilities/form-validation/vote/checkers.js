const Joi = require("joi");

const checkers = {};

checkers.title = Joi.string().required().min(10).max(255).messages({
  "string.empty": "The title cannot be an empty field",
  "string.min": "The title should have a minimum length of ten characters",
  "string.max":
    "The title should have a maximum length of two hundred and fifty five  characters",
  "any.required": "Please enter a valid title.",
});

checkers.description = Joi.string().required().min(10).max(1000).messages({
  "string.empty": "The description cannot be an empty field",
  "string.min":
    "The description should have a minimum length of ten characters",
  "string.max":
    "The description should have a maximum length of one thousand characters",
  "any.required": "Please enter a valid description.",
});

checkers.expiration = Joi.string().required().messages({
  "any.required": "Please enter a valid date.",
});

checkers.targetLocation = Joi.string().min(2).messages({
  "string.min": "A location must have a minimum of two characters",
});

checkers.partyName = Joi.string().required().min(2).messages({
  "string.min": "Party name must have a minimum of two characters",
  "any.required": "Enter a party name",
});
checkers.partyDescription = Joi.string().required().min(10).messages({
  "string.min": "Party description must have a minimum of ten characters",
  "any.required": "Enter a party description",
});

module.exports = checkers;
