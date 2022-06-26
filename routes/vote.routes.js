const vote = require("../controllers/vote.controllers");
const validation = require("../utilities/form-validation/vote");

const routes = require("express").Router();

routes.post("/create", validation.createPoll, vote.createPoll);

module.exports = routes;
