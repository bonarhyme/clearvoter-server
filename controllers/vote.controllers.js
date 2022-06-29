const axios = require("axios");
const asyncHandler = require("express-async-handler");
const VoteModel = require("../models/vote.models");
const responseHandle = require("../utilities/handleResponse");

const vote = {};

vote.createPoll = asyncHandler(async (req, res) => {
  const { title, description, expiration, allowVpn } = req.body;

  try {
    const isTitleTaken = await VoteModel.findOne({
      title: title.trim(),
    }).select(["-parties.voters"]);

    if (isTitleTaken) {
      res.status(400);
      throw new Error("Title is already been used. Please try another one.");
    }
    const poll = await VoteModel.create({
      title: title.trim(),
      description: description.trim(),
      expiration,
      creator: {
        id: req.user._id,
        username: req.user.username,
      },
      allowVpn,
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
    }).select(["-parties.voters"]);

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
    }).select(["-parties.voters"]);

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

vote.publishPoll = asyncHandler(async (req, res) => {
  const slug = req.params.slug;

  try {
    const poll = await VoteModel.updateOne(
      { slug },
      {
        draft: false,
      }
    );

    if (!poll) {
      res.status(400);
      throw new Error("An error occured. It seems like your link is broken.");
    }

    responseHandle.successResponse(
      res,
      201,
      "The poll has been published and you can now share the link."
    );
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

vote.endPoll = asyncHandler(async (req, res) => {
  const slug = req.params.slug;

  try {
    const poll = await VoteModel.updateOne(
      { slug },
      {
        endVoting: true,
      }
    );

    if (!poll) {
      res.status(400);
      throw new Error("An error occured. It seems like your link is broken.");
    }

    responseHandle.successResponse(
      res,
      201,
      "The poll has been closed. Results can only be viewed."
    );
  } catch (error) {
    throw new Error(error);
  }
});

// This uses the abstract api to check the ip address of the voter and confirm their validity to vote in a particular poll without saving their ip address. It also checks to see if a poll has expired or ended by the creator.

vote.addVote = asyncHandler(async (req, res) => {
  const slug = req.params.slug;
  const selectionId = req.params.selectionId;

  try {
    // Check if poll is still valid or ended or expired
    const poll = await VoteModel.findOne({
      slug,
      expiration: {
        $gte: Date.now(),
      },
      endVoting: false,
      draft: false,
    });

    if (!poll) {
      res.status(400);
      throw new Error(
        "You cannot vote now. Poll has either not been published yet or expired or has been closed."
      );
    }

    // Check if party user selected to vote exits
    const findParty = poll.parties.find(
      (x) => x._id.toString() === selectionId.toString()
    );

    if (!findParty) {
      res.status(400);
      throw new Error("Invalid party selected.");
    }

    // Check voter details
    const { data } = await axios.get(
      `${process.env.ABSTRACT_API}&ip_address=${req.ip}`
    );

    if (poll.allowVpn === false && data.security.is_vpn === true) {
      res.status(401);
      throw new Error("It seems that you use a vpn. Turn it off to vote.");
    }

    // Check if user location is allowed to vote
    if (
      poll.targetLocations.length > 0 &&
      poll.targetLocations.findIndex(
        (x) => x?.location?.toLowerCase() === data?.country?.toLowerCase()
      ) === -1
    ) {
      res.status(401);
      throw new Error(
        "People from your current location cannot vote in this poll."
      );
    }

    // Check if voters for party is greater than 0 and also check if user has voted for the party already
    if (
      findParty.voters.length > 0 &&
      findParty.voters.findIndex((x) => x === data.ip_address)
    ) {
      res.status(400);
      throw new Error("You already voted in this poll.");
    }

    // Update the vote count
    const vote = await VoteModel.updateOne(
      { slug, "parties._id": selectionId },
      {
        $push: {
          "parties.$.voters": data.ip_address,
        },
        $inc: {
          "parties.$.voteCount": 1,
        },
      }
    );

    if (!vote) {
      res.status(500);
      throw new Error(
        "An error occured. Your vote was not registered. Please try again."
      );
    }

    responseHandle.successResponse(res, 201, "Poll casted successfully");
  } catch (error) {
    throw new Error(error);
  }
});

vote.getPoll = asyncHandler(async (req, res) => {
  const slug = req.params.slug;

  try {
    const poll = await VoteModel.findOne({ slug }).select(["-parties.voters"]);

    if (!poll) {
      res.status(400);
      throw new Error("An error occured. It seems like your link is broken.");
    }

    responseHandle.successResponse(
      res,
      201,
      "The poll was fetched successfully.",
      poll
    );
  } catch (error) {
    throw new Error(error);
  }
});

vote.getPolls = asyncHandler(async (req, res) => {
  try {
    const poll = await VoteModel.find({ draft: false }).select([
      "-parties.voters",
    ]);

    if (poll.length === 0) {
      res.status(400);
      throw new Error(
        "An error occured. It seems like your link is broken or polls found."
      );
    }

    responseHandle.successResponse(
      res,
      201,
      "Polls has been fetched successfully.",
      poll
    );
  } catch (error) {
    throw new Error(error);
  }
});

vote.getAssociatedPolls = asyncHandler(async (req, res) => {
  const username = req.params.username;
  try {
    const poll = await VoteModel.find({ "creator.username": username }).select([
      "-parties.voters",
    ]);

    if (poll.length === 0) {
      res.status(400);
      throw new Error(
        "An error occured. It seems like your link is broken or polls not found."
      );
    }

    responseHandle.successResponse(
      res,
      201,
      "Your Polls has been fetched successfully.",
      poll
    );
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = vote;
