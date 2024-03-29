const {Router} = require('express');
const passport = require('passport');
const UserService = require('../../services/UserService');
const {HTTP_OK} = require("../../ConstantVariables/HTTP_STATUS_CODES");
const {ensureAuthenticated} = require("../../middlewares/isLoginCheck");
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
                    req.body.session_time = null
                }
                req.user.username ? await UserService.changeStatus(req.user.username, true,false,false)
                    :  req.user.email ? await UserService.changeStatus(req.user.email, true,true,false)
                    : await UserService.changeStatus(req.user.mobileNumber, true,false,true)

                const dbUser = req.user.username ? await UserService.findByUsername(req.user.username)
                    :  req.user.email ? await UserService.findByEmail(req.user.email)
                        : await UserService.findByMobileNumber(req.user.mobileNumber)

                res.status(HTTP_OK).json({
                    user: {
                        username: dbUser.username,
                        firstName: dbUser.firstName,
                        lastName: dbUser.lastName,
                        _id: dbUser._id,
                        email: dbUser.email,
                        mobileNumber: dbUser.mobileNumber,
                        activeStatus: dbUser.activeStatus,
                    }, session_time: req.session.cookie.maxAge, expires: req.session.cookie.expires
                });
            } catch (err) {
                return next(err);
            }
        }
    );

    router.get('/logout', async (req, res, next) => {
        await UserService.changeStatus(req.user.username, false)
        req.logout(function (err) {
            if (err) {
                return next(err);
            }
            req.session.cookie.maxAge = null;
            req.body.session_time = null
            return res.status(HTTP_OK).send('Successfully logged out');
        });
    });

    router.get('/connect', ensureAuthenticated, async (req, res, next) => {
        await UserService.changeStatus(req.user.username, true)
        return res.status(HTTP_OK).send('Status Successfully Changed');
    });

    router.get('/disconnect', ensureAuthenticated, async (req, res, next) => {
        await UserService.changeStatus(req.user.username, false)
        return res.status(HTTP_OK).send('Status Successfully Changed');
    });


    return router;
};
