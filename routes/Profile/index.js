const {Router} = require('express');

const profileSettings = require('./settings');

const router = Router();

module.exports = (params) => {
    router.use(profileSettings(params));

    return router;
};
