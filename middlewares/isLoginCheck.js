const STATUS_CODE = require('../ConstantVariables/HTTP_STATUS_CODES')

module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.session && req.session.cookie && req.session.cookie.maxAge) {
            return next();
        }
        res.status(STATUS_CODE.HTTP_UNAUTHORIZED).send("Please log in to view that resource")
    },
    forwardAuthenticated: function (req, res, next) {
        if (!req.session && req.session.cookie && req.session.cookie.maxAge) {
            return next();
        }
    },
};

/*module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.session && req.session.rememberme ) {
            return next();
        }
        res.status(STATUS_CODE.HTTP_UNAUTHORIZED).send("Please log in to view that resource")
    },
    forwardAuthenticated: function (req, res, next) {
        if (!req.session && req.session.rememberme) {
            return next();
        }
    },
};*/
