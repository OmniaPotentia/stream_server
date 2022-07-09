const pino = require('pino')
const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
})
require('dotenv').config();

module.exports = {
    database: {
        dsn: process.env.DATABASE_CONNECTION
    },
    JWTSECRET: process.env.JWTSECRET,
    logger,
};
