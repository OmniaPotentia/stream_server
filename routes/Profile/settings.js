const {Router} = require('express');
const UserService = require('../../services/UserService');
//const EmailService = require('../../services/EmailService');
//const SmsService = require('../../services/SmsService');

const validation = require('../../middlewares/validation');
const {HTTP_OK, HTTP_BAD_REQUEST, HTTP_CREATED} = require("../../ConstantVariables/HTTP_STATUS_CODES");
const isLoginCheck = require("../../middlewares/isLoginCheck")
const router = Router();

module.exports = () => {
    router.post(
        '/set-username',
        isLoginCheck.ensureAuthenticated,
        validation.validateUsername,
        async (req, res, next) => {
            try {
                let {username} = req.body;
                const existingUsername = await UserService.findByUsername(
                    username
                );
                if (existingUsername) {
                    res.status(HTTP_BAD_REQUEST).send(
                        'The given username exist already!'
                    );
                }
                await UserService.addUserName(req.user.email,username);
                return res.status(HTTP_OK).json("The username is added");
            } catch (err) {
                return next(err);
            }
        }
    );

    return router;
};
