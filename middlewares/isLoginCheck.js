const STATUS_CODE = require('../ConstantVariables/HTTP_STATUS_CODES')

module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.status(STATUS_CODE.HTTP_UNAUTHORIZED).send("Please log in to view that resource")
    },
    forwardAuthenticated: function (req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
    },
};
