const Joi = require("joi");

const checkers = {};

checkers.email = Joi.string()
  .email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  })
  .required()
  .messages({
    "string.base":
      "Your email should have the format of name@example.com or name@example.net",
    "string.empty": "Your email address cannot have an empty field",
    "string.email":
      "Please enter a valid email address. It should have the format of name@example.com or name@example.net",
    "any.required":
      "Please enter a valid email address. It should have the format of name@example.com or name@example.net",
  });

checkers.username = Joi.string().required().alphanum().min(3).max(30).messages({
  "string.empty": "Your username cannot be an empty field",
  "string.min":
    "Your username should have a minimum length of three characters",
  "string.max":
    "Your username should have a maximum length of thirty characters",
  "string.alphanum":
    "Your username must contain only alphabets and/or numbers.",
  "any.required": "Please enter a valid username.",
});

checkers.password = Joi.string().required().min(6).messages({
  "string.empty": "Your password cannot be an empty field",
  "string.min": "Your password should have a minimum length of 6 characters",
  "any.required": "Please enter a secure password",
});

checkers.name = Joi.string().required().min(3).max(40).messages({
  "string.base": "Your name should be texts only",
  "string.empty": "Your name cannot be an empty field",
  "string.min": "Your name should have a minimum length of three characters",
  "string.max": "Your name should have a maximum length of forty characters",
  "any.required": "Please enter a valid name.",
});

checkers.loginPassword = Joi.string().required().messages({
  "string.empty": "Your password cannot be an empty field",
  "any.required": "Please enter your password",
});

checkers.loginUsername = Joi.string().required().alphanum().messages({
  "string.empty": "Your username cannot be an empty field",
  "string.alphanum":
    "Your username must contain only alphabets and/or numbers.",
  "any.required": "Please enter a valid username.",
});

module.exports = checkers;
