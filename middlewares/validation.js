const ErrorResponse = require("../utils/errorResponse");

const validate = (schema) => (req, res, next) => {
  const options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  };
  const { error, value } = schema.validate(req.body, options);
  if (error) {
    next(new ErrorResponse(error.details[0].message, 400));
  } else {
    req.body = value;
    next();
  }
};

module.exports = validate;
