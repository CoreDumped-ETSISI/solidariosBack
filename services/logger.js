'use strict';

const fs = require('fs');
const rfs = require('rotating-file-stream');
const morgan = require('morgan');
const config = require('../config');
const chalk = require('chalk');

const formatConsole = function (tokens, req, res) {
    let line = '';
    const method = tokens.method(req, res);
    switch (method) {
    case 'GET':
        line += chalk.blue(method) + '\t';
        break;
    case 'POST':
        line += chalk.yellow(method);
        break;
    case 'PUT':
        line += chalk.magenta(method);
        break;
    case 'DELETE':
        line += chalk.red(method);
        break;
    case 'PATCH':
        line += chalk.cyan(method);
        break;
    }
    line += '\t';
    const status = tokens.status(req, res);
    if (status > 499) {
        line += chalk.red(status);
    } else if (status > 399) {
        line += chalk.yellow(status);
    } else if (status > 299) {
        line += chalk.blue(status);
    } else {
        line += status;
    }
    line += ' ' + tokens.url(req, res);
    line += ' ' + chalk.bold(tokens['response-time'](req, res) + 'ms\n');
    line += chalk.inverse('           Body            ');
    let auxPass = undefined;
    if(req.body && req.body.password) {
        auxPass = req.body.password;
        req.body.password = '**********';
    }
    line += '\n' + JSON.stringify(req.body) + '\n';
    req.body.password = auxPass;
    line += chalk.inverse('           Params          ');
    line += '\n' + JSON.stringify(req.params) + '\n';
    line += chalk.inverse('           Query           ');
    line += '\n' + JSON.stringify(req.query) + '\n';
    return line;
};

const formatFile = function (tokens, req, res) {
    let line = tokens.method(req, res);
    line += ' ' + tokens.status(req, res);
    line += ' ' + tokens.url(req, res);
    line += ' ' + tokens['remote-addr'](req, res);
    line += ' ' + tokens['response-time'](req, res) + 'ms';
    let auxPass = req.body.password;
    req.body.password = '**********';
    line += '\n\tBody: ' + JSON.stringify(req.body);
    req.body.password = auxPass;
    line += '\n\tParams: ' + JSON.stringify(req.params);
    line += '\n\tQuery: ' + JSON.stringify(req.query);
    return line;
};

// ensure log directory exists
fs.existsSync(config.LOG_DIR) || fs.mkdirSync(config.LOG_DIR);

// create a rotating write stream
const accessLogStream = rfs('console.log', {
    interval: '1d', // rotate daily
    path: config.LOG_DIR
});

function log(app) {
    app.use(morgan(formatConsole));
    app.use(morgan(formatFile, {stream: accessLogStream}));
}

module.exports = log;