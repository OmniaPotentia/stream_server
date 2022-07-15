const {Router} = require('express');
const UserService = require('../../services/UserService');
const {HTTP_OK, HTTP_NOT_FOUND} = require("../../ConstantVariables/HTTP_STATUS_CODES");

const router = Router();

module.exports = () => {
    router.post('/verify/:userId/:token', async (req, res, next) => {
        try {
            const user = await UserService.findById(req.params.userId);
            if (!user || user.verificationToken !== req.params.token) {
                return res.status(HTTP_NOT_FOUND).send(
                    'Invalid credentials provided!');
            } else {
                user.verified = true;
                user.update({}, {
                    $unset: {
                        verificationToken: 1
                    }
                })
                await user.save();
                return res.status(HTTP_OK).send(
                    'You have been verified!');
            }
        } catch (err) {
            return next(err);
        }
    });

    return router;
};
