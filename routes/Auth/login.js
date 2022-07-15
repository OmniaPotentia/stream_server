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
                const hour = 720000000;
                if (req.body.session_time) {
                    req.session.cookie.expires = new Date(Date.now() + hour).toLocaleDateString();
                    req.session.cookie.maxAge = hour
                } else {
                    req.session.cookie.maxAge = null;
                    req.body.session_time=null
                }
                const dbUser = await UserService.findByUsername(req.user.username);
                res.status(HTTP_OK).json({
                    user: {
                        username: dbUser.username,
                        firstName: dbUser.firstName,
                        lastName: dbUser.lastName,
                        _id: dbUser._id,
                        email: dbUser.email,
                        mobileNumber: dbUser.mobileNumber
                    }, session_time: req.session.cookie.maxAge, expires: req.session.cookie.expires
                });
            } catch (err) {
                return next(err);
            }
        }
    );

    router.get('/logout', (req, res,next) => {
        req.logout(function (err) {
            if (err) {
                return next(err);
            }
            req.session.cookie.maxAge = null;
            req.body.session_time=null
            return res.status(HTTP_OK).send('Successfully logged out');
        });

    });

    return router;
};
