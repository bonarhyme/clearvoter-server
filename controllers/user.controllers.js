const asyncHandler = require("express-async-handler");
const UserModel = require("../models/user.model");
const { successResponse } = require("../utilities/handleResponse");
const tokenHandler = require("../utilities/handleToken");
const mailHandler = require("../utilities/mail/handleMail");
const CLIENT_URL = process.env.CLIENT_URL;

const user = {};

user.register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const emailTaken = await UserModel.findOne({ email });

    if (emailTaken) {
      res.status(400);
      throw new Error("Email is already taken.");
    }

    const usernameTaken = await UserModel.findOne({ username });

    if (usernameTaken) {
      res.status(400);
      throw new Error("Username is already taken.");
    }

    const newUser = await UserModel.create({
      email,
      username,
      password,
    });

    if (newUser) {
      const token = tokenHandler.generateToken(email, "1d");
      mailHandler.sendMessage({
        mailExplainer:
          "You have received this message because your email address has been registered with our site.",
        mailPrompt:
          "Please click the button below to verify your email address and confirm that you are the owner of this account.",
        url: CLIENT_URL + "/verify/" + token,
        buttonText: "Verify Email",
        subject: "ClearVoter: Verify your email",
      });
      successResponse(res, 201, "Account created successfully.");
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

user.login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  try {
    const usernameTaken = await UserModel.findOne({ username });

    if (
      !usernameTaken ||
      (await usernameTaken.matchPassword(password)) === false
    ) {
      res.status(400);
      throw new Error("Invalid username or password");
    }

    successResponse(res, "200", "Login success", {
      username: usernameTaken.username,
      token: tokenHandler.generateToken(username),
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

module.exports = user;
