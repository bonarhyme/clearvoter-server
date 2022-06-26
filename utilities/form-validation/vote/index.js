const asyncHandler = require("express-async-handler");
const schema = require("./schema");

const validation = {};

validation._callable = (schemaName) =>
  asyncHandler(async (req, res, next) => {
    try {
      await schema[schemaName].validateAsync(req.body);
      next();
    } catch (error) {
      res.status(422);
      throw new Error(error.details[0].message);
    }
  });

validation.createPoll = validation._callable("createPoll");
validation.addParty = validation._callable("addParty");
validation.addLocation = validation._callable("addLocation");

module.exports = validation;
