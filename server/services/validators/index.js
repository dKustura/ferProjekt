const validator = require('validator');

var validateEmail = function(value) {
    return validator.isEmail(value);
}

var validateName = function(value) {
    return !validator.isEmpty(value) && validator.isAlpha(value)
            && validator.isLength(value, {min:0, max:20});
}

var validateDateOfBirth = function(value) {
   var maxlimitDate = new Date().setFullYear(new Date().getFullYear() - 18);
	 var minlimitDate = new Date().setFullYear(new Date().getFullYear() - 100);
	 return value > minlimitDate && value < maxlimitDate;
}

var validateURL = function(value) {
    return validator.isURL(value);
}

module.exports = {
    validateEmail: validateEmail,
    validateName: validateName,
    validateDate: validateDateOfBirth,   
    validateURL: validateURL
};
