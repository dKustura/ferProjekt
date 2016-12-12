const validator = require('validator');

const minPasswordLength = 6;

const validateEmail = function(value) {
  return validator.isEmail(value);
};

const validateName = function(value) {
  return !validator.isEmpty(value) && validator.isAlpha(value) && validator.isLength(value, {min: 0, max: 20});
};

const validateDate = function(value) {
  if (!value) {
    return false;
  }
  return validator.isDate(value.toString());
};

const validateURL = function(value) {
  return validator.isURL(value);
};

module.exports = {
  validateEmail,
  validateName,
  validateDate,
  validateURL
};
