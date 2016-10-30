import validator from 'validator';

var validateEmail = function(value) {
    return validator.isEmail(value);
}

var validateName = function(value) {
    return !validator.isEmpty(value) && validator.isAlpha(value)
            && validator.isLength(value, {min:0, max:20});
}

var validateDateOfBirth = function(value) {
    var limitDate = new Date().setFullYear(new Date().getFullYear() - 18);
    return validator.isDate(value) && validator.isBefore(limitDate);
}

var validateURL = function(value) {
    return validator.isURL(value);
}

module.exports = {
    validateEmail: validateEmail,
    validateName: validateName,
    validateDate: validateDate,
    validateURL: validateURL
};