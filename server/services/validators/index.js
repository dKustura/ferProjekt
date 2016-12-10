const validator = require('validator');

const validateEmail = function(value) {
  return validator.isEmail(value);
}

const validateName = function(value) {
  return !validator.isEmpty(value) && validator.isAlpha(value)
        && validator.isLength(value, {min:0, max:20});
}

const validateDate = function(value) {
  return validator.isDate(value);
}

const validateURL = function(value) {
  return validator.isURL(value);
}

const validatePassword = function(value){
  return validator.isLength(value, {
    min: 6,
    max: 15
  });
}

module.exports = {
  validateEmail: validateEmail,
  validateName: validateName,
  validateDate: validateDate,
  validateURL: validateURL,
  validatePassword: validatePassword
};
