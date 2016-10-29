const validator = require('validator');

var validateEmail = function(value) {
    return validator.isEmail(value);
}

var validateName = function(value) {
    return !validator.isEmpty(value) && validator.isAlpha(value);
}

// dodati 18+ requirement (moment.js?)
var validateDateOfBirth = function(value) {
    return validator.isDate(value) && validator.isBefore(Date.now);
}

module.exports = {
    validateEmail: validateEmail,
    validateName: validateName,
    validateDate: validateDate
};