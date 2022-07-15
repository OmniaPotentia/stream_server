const {Router} = require('express');

const getChatHistory = require('./getChat');


const router = Router();

module.exports = (params) => {
    router.use(getChatHistory(params));

    return router;
};
