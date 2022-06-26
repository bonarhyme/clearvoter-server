const user = require("../controllers/user.controllers");
const validation = require("../utilities/form-validation/users");

const routes = require("express").Router();

// localhost:5020/api/users

routes.post("/register", validation.register, user.register);

module.exports = routes;
