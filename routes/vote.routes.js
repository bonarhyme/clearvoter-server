const vote = require("../controllers/vote.controllers");
const protectPoll = require("../middleware/spamCheck");
const protectUser = require("../middleware/userMiddleware");
const validation = require("../utilities/form-validation/vote");

const routes = require("express").Router();

// api/polls

routes.post("/create", validation.createPoll, protectUser, vote.createPoll);
routes.put(
  "/add-party/:slug",
  protectUser,
  protectPoll,
  validation.addParty,
  vote.addParty
);
routes.put(
  "/add-location/:slug",
  protectUser,
  protectPoll,
  validation.addLocation,
  vote.addLocation
);

module.exports = routes;
