const Joi = require('joi');

const FORGOT_PASSWORD_MODEL = Joi.object({
  email: Joi.string().email().required(),
});

const RESET_PASSWORD_MODEL = Joi.object({
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().min(6).required(),
  otp: Joi.string().length(4).required(),
});

module.exports = {
  FORGOT_PASSWORD_MODEL,
  RESET_PASSWORD_MODEL,
};
