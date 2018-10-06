'use strict';

const crypto = require('crypto');
const config = require('../config.js');

function encrypt(text) {
    const iv  = Buffer.from(config.IV, 'hex');
    const cipher = crypto.createCipheriv(config.ALGORITHM, config.KEY, iv);
    let crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    const iv  = Buffer.from(config.IV, 'hex');
    const decipher = crypto.createDecipheriv(config.ALGORITHM, config.KEY, iv);
    let dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

function normEmail(email) {
    return email.toLowerCase();
}

function isAdmin(user) {
    return user.admin === config.ADMIN_TOKEN
}

module.exports = {
    encrypt,
    decrypt,
    normEmail,
    isAdmin
};
