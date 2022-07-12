const {Router} = require('express');
const UserService = require('../../services/UserService');
//const EmailService = require('../../services/EmailService');
//const SmsService = require('../../services/SmsService');

const validation = require('../../middlewares/validation');
const {HTTP_OK, HTTP_BAD_REQUEST, HTTP_CREATED} = require("../../ConstantVariables/HTTP_STATUS_CODES");

const router = Router();

module.exports = () => {
    router.post(
        '/register',
        validation.validateUsername,
        validation.validateEmail,
        validation.validatePassword,
        validation.validateFirstName,
        validation.validateLastName,
        validation.validateMobileNumber,
        async (req, res, next) => {
            try {
                const validationErrors = validation.validationResult(req);
                const errors = [];

                if (!validationErrors.isEmpty()) {
                    validationErrors.errors.forEach((error) => {
                        errors.push(error.param);
                        res.status(HTTP_BAD_REQUEST).send(
                            error.msg
                        );
                    });
                } else {
                    const existingEmail = await UserService.findByEmail(req.body.email);
                    const existingUsername = await UserService.findByUsername(
                        req.body.username
                    );

                    if (existingEmail || existingUsername) {
                        res.send(
                            'The given email address or the username exist already!'
                        );
                    }
                }

                if (errors.length) {
                    return res.status(HTTP_BAD_REQUEST).send(`data: ${req.body} and error is ${errors}`
                    );
                }

                const user = await UserService.createUser(
                    req.body.username,
                    req.body.firstName,
                    req.body.lastName,
                    req.body.email,
                    req.body.password,
                    req.body.mobileNumber
                );

                /*if (req.body.mobileNumber) {
                    await SmsService.sendSms(user);
                } else {
                    await EmailService.sendEmail(user);
                }*/

                return res.status(HTTP_CREATED).json({user: user});
            } catch (err) {
                return next(err);
            }
        }
    );

    return router;
};
