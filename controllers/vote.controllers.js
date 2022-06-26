const asyncHandler = require("express-async-handler");
const VoteModel = require("../models/vote.models");
const responseHandle = require("../utilities/handleResponse");

const vote = {};

vote.createPoll = asyncHandler(async (req, res) => {
  const { title, description, expiration } = req.body;

  try {
    const isTitleTaken = await VoteModel.findOne({ title: title.trim() });

    if (isTitleTaken) {
      res.status(400);
      throw new Error("Title is already been used. Please try another one.");
    }
    const poll = await VoteModel.create({
      title: title.trim(),
      description: description.trim(),
      expiration,
    });

    if (!poll) {
      res.status(500);
      throw new Error(
        "We were unable to create the poll at the moment. Please try again."
      );
    }

    responseHandle.successResponse(res, 201, "Poll created successfully", poll);
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

module.exports = vote;