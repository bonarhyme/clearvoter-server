const User = require("../models/user.model");
const UserModel = require("../models/user.model");

const services = {};

/**
 *
 * @param {*} field
 * @description field must be a valid mongoose query
 */
services.checkFieldsValidity = async (fields) => {
  if (typeof fields !== "object") {
    return { user: null, success: false, error: false };
  }

  try {
    return {
      user: await UserModel.findOne(fields),
      success: true,
      error: false,
    };
  } catch (error) {
    return { user: null, success: false, error: false };
  }
};

module.exports = services;
