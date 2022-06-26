const asyncHandler = require("express-async-handler");
const Joi = require("joi");
const schema = require("./schema");

const validation = {};

validation.register = asyncHandler(async (req, res, next) => {
  try {
    await schema.register.validateAsync(req.body);
    next();
  } catch (error) {
    res.status(422);
    throw new Error(error.details[0].message);
  }
});

module.exports = validation;
