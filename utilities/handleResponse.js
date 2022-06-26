const responseHandle = {};

responseHandle.successResponse = (res, status, message, data) => {
  return res.status(status).json({
    message,
    data
  });
};

module.exports = responseHandle;
