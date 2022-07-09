#!/usr/bin/env node

const http = require('http');
const mongoose = require('mongoose');
const config = require('../config/config');

const {logger} = config;

const app = require('../index.js')(config);

function normalizePort(val) {
    const port = parseInt(val, 10);

    if (Number.isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
}

const port = normalizePort(process.env.PORT || '3000');

app.set('port', port);

const server = http.createServer(app);

mongoose.connect(config.database.dsn
    , (error) => {
        if (error) {
            logger.info(config.database.dsn)
            logger.fatal(error);
            server.listen(port);
        } else {
            logger.info('Connected to MongoDB ');
            server.listen(port);
        }
    })

server.on('error', (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

    switch (error.code) {
        case 'EACCES':
            logger.fatal(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            logger.fatal(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
});

server.on('listening', () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
    logger.info(`Listening on ${bind}`);
});
