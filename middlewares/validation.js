const {body, validationResult} = require('express-validator');
const validator = require('validator');

module.exports.validatePassword = body('password')
    .isLength({min: 8})
    .trim()
    .withMessage('The password has to be at least 8 characters long.');

module.exports.validatePasswordMatch = body('password')
    .custom((value, {req}) => {
        if (value !== req.body.confirmPassword) {
            return false;
        }
        return true;
    })
    .withMessage("Passwords don't match");

module.exports.validateEmail = body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address.');

module.exports.validateUsername = body('username')
    .isLength({min: 6})
    .trim()
    .withMessage('The username has to be at least 6 characters long.');

module.exports.validateFirstName = body('firstName')
    .notEmpty()
    .trim()
    .withMessage("The first name can't be empty.");

module.exports.validateLastName = body('lastName')
    .notEmpty()
    .trim()
    .withMessage("The last name can't be empty.");

module.exports.validateMobileNumber = body('mobileNumber').custom(
    (value) => {
        return validator.isMobilePhone(value);
    }
).withMessage(`Phone is invalid`);

module.exports.validationResult = validationResult;
