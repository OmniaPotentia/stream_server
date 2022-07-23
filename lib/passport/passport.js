const passport = require('passport');
const passportJWT = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
require('dotenv').config();

const UserService = require('../../services/UserService');
const {validateEmail} = require("../../middlewares/validation");

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

module.exports = (config) => {
    passport.use(new LocalStrategy({
        passReqToCallback: true,
    }, async (req, username, password, done) => {
        try {
            let user;
            let email;
            let mobileNumber;

            if (UserService.validateEmail(username)) {
                email = true;
            } else if (UserService.validatePhoneNumber(username)) {
                mobileNumber = true;
            }

            if (email) {
                user = await UserService.findByEmail(req.body.username);
                if (!user) {
                    req.session.messages.push({
                        text: 'We cannot find the email address', type: 'danger',
                    });
                    return done(null, false);
                }
            } else if (mobileNumber) {
                user = await UserService.findByMobileNumber(req.body.username);
                if (!user) {
                    req.session.messages.push({
                        text: 'We cannot find the mobile number', type: 'danger',
                    });
                    return done(null, false);
                }
            } else {
                user = await UserService.findByUsername(req.body.username);
                if (!user) {
                    req.session.messages.push({
                        text: 'We cannot find the username', type: 'danger',
                    });
                    return done(null, false);
                }
            }

            const isValid = await user.comparePassword(req.body.password);
            if (!isValid) {
                req.session.messages.push({
                    text: 'The password does not match!', type: 'danger',
                });
                return done(null, false);
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }));

    passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), secretOrKey: config.JWTSECRET,
    }, async (jwtPayload, done) => {
        try {
            const user = await UserService.findById(jwtPayload.userId);
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await UserService.findById(id);
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    });

    return passport;
};
