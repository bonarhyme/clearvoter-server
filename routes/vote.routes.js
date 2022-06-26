const vote = require("../controllers/vote.controllers");
const validation = require("../utilities/form-validation/vote");

const routes = require("express").Router();

// api/polls

routes.post("/create", validation.createPoll, vote.createPoll);
routes.put("/add-party/:slug", validation.addParty, vote.addParty);
routes.put("/add-location/:slug", validation.addLocation, vote.addLocation);

module.exports = routes;
