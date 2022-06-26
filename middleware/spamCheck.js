const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const userModel = require("../models/user.model");
const { decodeToken } = require("../utilities/handleToken");
const VoteModel = require("../models/vote.models");

/**
 * @description This middleware checks the creator of a poll token supplied as Bearer authorization
 * @required Bearer Authorization
 */

const protectPoll = asyncHandler(async (req, res, next) => {
  const poll = await VoteModel.findOne({
    slug: req.params.slug,
    "creator.id": req.user._id,
  });

  if (!poll) {
    res.status(401);
    throw new Error("You cannot modify this poll.");
  }

  next();
});

module.exports = protectPoll;
