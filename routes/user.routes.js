const user = require("../controllers/user.controllers");
const validation = require("../utilities/form-validation/users");

const routes = require("express").Router();

// localhost:5020/api/users

routes.post("/register", validation.register, user.register);
routes.post("/login", validation.login, user.login);
routes.put("/verify-email/:token", user.verifyEmail);

module.exports = routes;
