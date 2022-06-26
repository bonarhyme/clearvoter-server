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

vote.addParty = asyncHandler(async (req, res) => {
  const slug = req.params.slug;
  const { name, description } = req.body;

  try {
    const checkPartyAdded = await VoteModel.findOne({
      slug,
      "parties.name": name,
    });

    if (checkPartyAdded) {
      res.status(400);
      throw new Error("Added the Party already");
    }
    const poll = await VoteModel.updateOne(
      { slug },
      {
        $push: {
          parties: {
            name,
            description,
          },
        },
      }
    );

    if (!poll) {
      res.status(400);
      throw new Error("The party was not added. Please try again");
    }

    responseHandle.successResponse(res, 201, "Party was added successfully.");
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

vote.addLocation = asyncHandler(async (req, res) => {
  const slug = req.params.slug;
  const { location } = req.body;

  try {
    const checkLocationAdded = await VoteModel.findOne({
      slug,
      "targetLocations.location": location,
    });

    if (checkLocationAdded) {
      res.status(400);
      throw new Error("Added the location already");
    }
    const poll = await VoteModel.updateOne(
      { slug },
      {
        $push: {
          targetLocations: {
            location,
          },
        },
      }
    );

    if (!poll) {
      res.status(400);
      throw new Error("The location was not added. Please try again");
    }

    responseHandle.successResponse(
      res,
      201,
      "Location was added successfully."
    );
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

module.exports = vote;
