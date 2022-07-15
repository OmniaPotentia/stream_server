const cookieParser = require('cookie-parser');
const express = require('express');
const bodyparser = require("body-parser");
const session = require('express-session');

const indexRouter = require('./routes/index');
const setupPassport = require('./lib/passport/passport');
const STATUS_CODE = require('./ConstantVariables/HTTP_STATUS_CODES')

module.exports = (config) => {
    const app = express();
    const passport = setupPassport(config);

    app.use(
        session({
            name: 'session',
            keys: [
                'a set',
                'of keys',
                'used',
                'to encrypt',
                'the session',
                'change in',
                'production',
            ],
            resave: false,
            secret: process.env.EXPRESS_SECRET,
            saveUninitialized: true,
            sameSite: 'lax',
            cookie: {
                maxAge: null,
                expires: null
            },

        })
    );

    app.use(bodyparser.json());
    app.use(bodyparser.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(async (req, res, next) => {
        req.session.cookie.maxAge =
            req.session.rememberme || req.session.cookie.maxAge;
        res.locals.user = req.user;
        return next();
    });

    app.use(async (req, res, next) => {
        if (!req.session.messages) {
            req.session.messages = [];
        }
        res.locals.messages = req.session.messages;
        return next();
    });

    app.use('/', indexRouter({config}));

    app.use((req, res, next) => {
        res.status(STATUS_CODE.HTTP_NOT_FOUND).send('404 Not Found');
    });

    app.use((err, req, res) => {
        res.locals.error = req.app.get('env') === 'development' ? err : {};
        res.status(err.status || STATUS_CODE.HTTP_INTERNAL_SERVER_ERROR).send(err);
    });

    return app;
};
