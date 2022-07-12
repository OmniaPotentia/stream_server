const {Router} = require('express');
const passport = require('passport');
const UserService = require('../../services/UserService');
const {HTTP_OK} = require("../../ConstantVariables/HTTP_STATUS_CODES");


const router = Router();

module.exports = () => {
    router.post(
        '/login',
        passport.authenticate('local', {
            message: 'Failed to login'
        }),
        async (req, res, next) => {
            try {
                if (req.body.remember) {
                    req.sessionOptions.maxAge = 24 * 60 * 60 * 1000 * 14;
                    req.session.rememberme = req.sessionOptions.maxAge;
                } else {
                    req.session.rememberme = null;
                }
                const dbUser = await UserService.findByUsername(req.user.username);
                res.status(HTTP_OK).json({
                    user: {
                        username: dbUser.username,
                        _id: dbUser._id,
                        email: dbUser.email,
                        mobileNumber: dbUser.mobileNumber
                    }, session: req.session.rememberme
                });
            } catch (err) {
                return next(err);
            }
        }
    );

    router.get('/logout', (req, res) => {
        req.logout();
        req.session.rememberme = null;
        return res.status(HTTP_OK).send('Successfully logged out');
    });

    return router;
};
