const vote = require("../controllers/vote.controllers");
const protectPoll = require("../middleware/spamCheck");
const protectUser = require("../middleware/userMiddleware");
const validation = require("../utilities/form-validation/vote");

const routes = require("express").Router();

// api/polls

routes.post("/create", validation.createPoll, protectUser, vote.createPoll); // done
routes.put(
  "/add-party/:slug",
  protectUser,
  protectPoll,
  validation.addParty,
  vote.addParty
); //done
routes.put(
  "/add-location/:slug",
  protectUser,
  protectPoll,
  validation.addLocation,
  vote.addLocation
); //done
routes.put("/publish/:slug", protectUser, protectPoll, vote.publishPoll); //done
routes.put("/end-poll/:slug", protectUser, protectPoll, vote.endPoll); //done
routes.put("/vote/:slug/:selectionId", vote.addVote); //done
routes.get("/view-poll/:slug", vote.getPoll); //done
routes.get("/view-polls", vote.getPolls); //done
routes.get("/view-polls/associated/:username", vote.getAssociatedPolls); //done

module.exports = routes;
