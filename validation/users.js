const Joi = require("joi");

const userSchema = Joi.object({
  username: Joi.string().min(5).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("admin", "scientist").default("scientist"),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const userUpdateSchema = Joi.object({
  username: Joi.string().min(5).max(20).required(),
  email: Joi.string().email().required(),
});

const passwordSchema = Joi.object({
  password: Joi.string().min(6).required(),
});

module.exports = { userSchema, loginSchema, userUpdateSchema, passwordSchema };
