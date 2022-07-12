const {Router} = require('express');

const UserService = require('../../services/UserService');
const validation = require('../../middlewares/validation');
const {HTTP_OK, HTTP_BAD_REQUEST} = require("../../ConstantVariables/HTTP_STATUS_CODES");

const router = Router();

module.exports = () => {
    router.post(
        '/resetpassword',
        validation.validateEmail,
        async (req, res, next) => {
            try {
                const validationErrors = validation.validationResult(req);
                const errors = [];
                if (!validationErrors.isEmpty()) {
                    validationErrors.errors.forEach((error) => {
                        res.status(HTTP_BAD_REQUEST).send(error.message);
                    });
                } else {
                    const user = await UserService.findByEmail(req.body.email);
                    if (user) {
                        const resetToken = await UserService.createPasswordResetToken(
                            user.id
                        );
                    }
                }

                if (errors.length) {
                    return res.status(HTTP_BAD_REQUEST).send(
                        `data ${req.body} and error ${errors}`
                    );
                }

                return res.status(HTTP_OK).send(
                    'If we found a matching user, you will receive a password reset link.'
                );
            } catch (err) {
                return next(err);
            }
        }
    );

    router.post(
        '/resetpassword/:userId/:resetToken',
        validation.validatePassword,
        validation.validatePasswordMatch,
        async (req, res, next) => {
            try {
                const resetToken = await UserService.verifyPasswordResetToken(
                    req.params.userId,
                    req.params.resetToken
                );
                if (!resetToken) {
                    return res.status(HTTP_BAD_REQUEST).send('The provided token is invalid!');
                }
                const validationErrors = validation.validationResult(req);
                const errors = [];
                if (!validationErrors.isEmpty()) {
                    validationErrors.errors.forEach((error) => {
                        errors.push(error.param);
                        res.status(HTTP_BAD_REQUEST).send(error.message)
                    });
                }

                await UserService.changePassword(req.params.userId, req.body.password);
                await UserService.deletePasswordResetToken(req.params.resetToken);
                return res.status(HTTP_OK).send('Password is changed successfully');
            } catch (err) {
                return next(err);
            }
        }
    );

    return router;
};
