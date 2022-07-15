const {Router} = require('express');
const UserService = require('../../services/UserService');
//const EmailService = require('../../services/EmailService');
//const SmsService = require('../../services/SmsService');

const validation = require('../../middlewares/validation');
const {HTTP_OK, HTTP_BAD_REQUEST, HTTP_CREATED} = require("../../ConstantVariables/HTTP_STATUS_CODES");
const isLoginCheck = require("../../middlewares/isLoginCheck")
const router = Router();

module.exports = () => {
    router.get(
        '/broadcast',
        isLoginCheck.ensureAuthenticated,
        async (req, res, next) => {
            try {

                return res.status(HTTP_OK).json({"message": "Broadcast"});
            } catch (err) {
                return next(err);
            }
        }
    );
    router.get(
        '/:room',
        isLoginCheck.ensureAuthenticated,
        async (req, res, next) => {
            try {

                return res.status(HTTP_OK).json({"message": req.params.room});
            } catch (err) {
                return next(err);
            }
        }
    );

    return router;
};
