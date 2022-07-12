const {Router} = require('express');

const cors = require('cors');

const router = Router();

const isLoginCheck = require('../middlewares/isLoginCheck');
const STATUS_CODE = require('../ConstantVariables/HTTP_STATUS_CODES')
const authRouter = require('./Auth/index');

module.exports = (params) => {
    router.get('/', isLoginCheck.ensureAuthenticated,(req, res) => {
        res.status(STATUS_CODE.HTTP_OK).send('Test Connection');
    });

    router.use('/auth', authRouter(params));
    //router.use('/api', cors(), apiRouter(params));
    return router;
};
