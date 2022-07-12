const {Router} = require('express');

const registrationRouter = require('./registration');
const loginRouter = require('./login');
const verificationRouter = require('./verification');
const passwordResetRouter = require('./resetpassword');
const getUserlistRouter = require('./userlist');

const router = Router();

module.exports = (params) => {
    router.use(registrationRouter(params));
    router.use(loginRouter(params));
    router.use(verificationRouter(params));
    router.use(passwordResetRouter(params));
    router.use(getUserlistRouter(params));
    return router;
};
